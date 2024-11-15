import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import moment from 'moment-timezone';

import bookingClientServices from '../services/bookingClient';
import Booking, { IBooking } from '../models/Booking';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../apiErrors/apiErrors';
import Facility, { IFacility } from '../models/Facility';
import OpeningHour from '../models/OpeningHour';
import {
  addMinutes,
  filterAvailableSlots,
  generateTimeSlots,
} from '../utils/timeSlotHelper';
import User, { IUser } from '../models/User';
import { calculateTimeDifference } from '../utils/timeDifference';

// get available time
export const getAvailableTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { selectedDate, facilityName } = req.body;

  try {
    if (!selectedDate || !facilityName) {
      return res
        .status(400)
        .json({ error: 'Date and facility name are required' });
    }
    const convertStringToDate = moment.tz(
      selectedDate,
      'YYYY-MM-DD',
      'Europe/Helsinki'
    );
    const findDayStringFromDate = convertStringToDate
      .format('dddd')
      .toLowerCase();

    // Find the facility by name
    const facility = await Facility.find({ type: facilityName });
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    const facilityIds = facility.map(
      (faci) => faci._id
    ) as mongoose.Types.ObjectId[];

    // Find the opening hours for the given day
    const openingHour = await OpeningHour.findOne({
      day: findDayStringFromDate,
    });
    if (!openingHour) {
      return res
        .status(404)
        .json({ error: 'Opening hours not found for the selected day' });
    }

    const timeSlots = generateTimeSlots(
      openingHour.open,
      openingHour.close,
      selectedDate
    );

    const bookingsSuccess = await bookingClientServices.getAvailableTime(
      facilityIds,
      selectedDate
    );

    // Filter out booked slots
    const filteredSlots = filterAvailableSlots(
      timeSlots,
      bookingsSuccess,
      facilityIds
    );

    res.status(200).json({ availableTime: filteredSlots });
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

// find available court
export const getAvailableCourt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { facilityName, selectedDate, selectedTime } = req.body;
  const bookedFacilityIds = new Set<mongoose.Types.ObjectId>();
  try {
    // Find the facility by name
    const facilities: IFacility[] = await Facility.find({
      type: facilityName,
    }).exec();
    if (!facilities || facilities.length === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    const facilityIds = facilities.map((facility) => facility._id);
    // Find bookings for the selected date
    const bookings = await Booking.find({
      facility: { $in: facilityIds },
      isCancelled: false,
      date: selectedDate,
    }).select('facility startTime endTime duration');

    // Filter out booked facilities considering the selected time
    const availableCourts = facilities.filter((facility) => {
      return bookings.every((booking) => {
        // The court is available if the selected start time is greater than or equal to the booking end time
        return !(
          booking.facility.equals(facility._id as mongoose.Types.ObjectId) &&
          selectedTime < booking.endTime &&
          addMinutes(selectedTime, 30) >= booking.startTime
        );
      });
    });
    //console.log(availableCourts);
    res.status(200).json({ availableCourts });
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

export const getAvailableDuration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //no need: facilityName here
  const { selectedDate, selectedTime, selectedFacilityId } = req.body;
  try {
    const validDurations = [60, 90]; //customer wanted strict game duration for booking
    // Find bookings for the selected date
    const bookings = await Booking.find({
      facility: selectedFacilityId,
      date: selectedDate,
      isCancelled: false,
    }).select('facility startTime endTime duration');

    //Find possible durations for booking [60,90]
    bookings.filter((booking) => {
      if (selectedTime < booking.endTime) {
        if (addMinutes(selectedTime, 60) > booking.startTime) {
          const index = validDurations.indexOf(60);
          if (index > -1) validDurations.splice(index, 1);
        }
        if (addMinutes(selectedTime, 90) > booking.startTime) {
          const index = validDurations.indexOf(90);
          if (index > -1) validDurations.splice(index, 1);
        }
      }
    });

    res.status(200).json({ validDurations });
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

// get active bookings for user
export const getUserBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as IUser;
  if (!user) {
    return next(new ForbiddenError('User not authenticated'));
  }
  try {
    const isExist = await User.findById(user._id);
    if (!isExist) throw new NotFoundError();
    const bookingsByUserSuccess = await bookingClientServices.getUserBooking(
      isExist._id as mongoose.Types.ObjectId
    );

    // Get today's date and reset time to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter bookings for today or in the future. Past bookings are excluded.
    const futureBookings = bookingsByUserSuccess.filter((booking: IBooking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= today && booking.isCancelled === false;
    });

    res.status(200).json(futureBookings);
  } catch (error) {
    next(new BadRequestError());
  }
};

// delete booking by user
export const cancelBookingByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const bookingId = req.params.bookingId;
    // Fetch the booking from the database
    const booking = await Booking.findById(bookingId);

    // If booking does not exist, throw an error
    if (!booking) throw new NotFoundError('Booking not found');
    const timeDifferenceInHours = calculateTimeDifference(
      booking.date,
      booking.startTime
    );

    // Check if the time difference is more than 12 hours
    if (timeDifferenceInHours < 12) {
      next(
        new BadRequestError(
          'Cannot cancel the booking as it starts in less than 12 hours'
        )
      );
    } else {
      booking.isCancelled = true;
      const cancelSuccess = await bookingClientServices.cancelBookingByUser(
        booking
      );

      res.status(204).json(cancelSuccess);
    }
  } catch (error) {
    next(new BadRequestError('Can not delete.....', error));
  }
};

// // delete booking by user (****KEEP IT FOR FUTURE USE****)
// export const deleteBookingByUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //get id from params
//     const bookingId = req.params.bookingId;
//     // Fetch the booking from the database
//     const booking = await Booking.findById(bookingId);

//     // If booking does not exist, throw an error
//     if (!booking) throw new NotFoundError('Booking not found');
//     const timeDifferenceInHours = calculateTimeDifference(
//       booking.date,
//       booking.startTime
//     );

//     // Check if the time difference is more than 12 hours
//     if (timeDifferenceInHours < 12) {
//       next(
//         new BadRequestError(
//           'Cannot cancel the booking as it starts in less than 12 hours'
//         )
//       );
//     } else {
//       const deleteSuccess = await bookingClientServices.deleteBookingByUser(
//         bookingId
//       );
//       console.log('deleteSuccess controller:: ', deleteSuccess);
//       res.status(204).json(deleteSuccess);
//     }
//   } catch (error) {
//     next(new BadRequestError('Can not delete.....', error));
//   }
// };
