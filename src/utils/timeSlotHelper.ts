import mongoose from 'mongoose';
import { IBooking } from '../models/Booking';

// Function to generate time slots in 30-minute intervals
export const generateTimeSlots = (
  open: string,
  close: string,
  selectedDate: string
): string[] => {
  const slots: string[] = [];
  let openHour = parseInt(open.slice(0, 2));
  let openMinute = parseInt(open.slice(2));
  let closeHour = parseInt(close.slice(0, 2));
  let closeMinute = parseInt(close.slice(2));

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayDate = today.toISOString().split('T')[0];

  // Get the current time in HHMM format
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 100 + currentMinute;

  while (
    openHour < closeHour ||
    (openHour === closeHour && openMinute < closeMinute)
  ) {
    const slot = `${String(openHour).padStart(2, '0')}${String(
      openMinute
    ).padStart(2, '0')}`;

    // Convert slot time to an integer for comparison
    const slotTime = parseInt(slot);

    // Filter slots only for today, allow all slots for other dates
    if (selectedDate === todayDate) {
      if (slotTime >= currentTime) {
        slots.push(slot);
      }
    } else {
      slots.push(slot);
    }

    openMinute += 30;

    if (openMinute >= 60) {
      openMinute = 0;
      openHour += 1;
    }
  }
  return slots;
};

// Function to filter out slots that overlap with existing bookings
export const filterAvailableSlots = (
  slots: string[],
  bookings: IBooking[],
  facilities: mongoose.Types.ObjectId[]
): string[] => {
  return slots.filter((slot) => {
    // For each slot, check if there is at least one facility that is not booked
    const isSlotAvailable = facilities.some((facilityId) => {
      // Check if this facility is booked during the current slot
      const isFacilityBooked = bookings.some((booking) => {
        const bookingStart = booking.startTime;
        const bookingEnd = booking.endTime;

        // Check if the slot overlaps with the booking for this facility
        return (
          booking.facility.equals(facilityId) &&
          parseInt(slot) >= parseInt(bookingStart) &&
          parseInt(slot) < parseInt(bookingEnd)
        );
      });

      // If the facility is not booked for this slot, return true to indicate the slot is available
      return !isFacilityBooked;
    });

    return isSlotAvailable; // Slot remains available if at least one facility is unbooked
  });
};

// Function to add minutes to a time string (hh:mm)
export const addMinutes = (time: string, minutes: number): string => {
  let hour = parseInt(time.slice(0, 2));
  let minute = parseInt(time.slice(2));

  minute += minutes;

  if (minute >= 60) {
    hour += Math.floor(minute / 60);
    minute %= 60;
  }

  return `${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}`;
};

//Important: Do not delete this. Delete end of the project.
// // Check if the slot overlaps with the booking for this facility
// return (
//   booking.facility.equals(facilityId) &&
//   ((parseInt(slot) >= parseInt(bookingStart) && parseInt(slot) < parseInt(bookingEnd)) ||
//     (parseInt(addMinutes(slot, 30)) > parseInt(bookingStart) && parseInt(slot) < parseInt(bookingStart)))
// );
