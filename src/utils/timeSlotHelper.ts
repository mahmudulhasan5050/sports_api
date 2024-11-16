import mongoose from 'mongoose';
import moment from 'moment-timezone';
import { IBooking } from '../models/Booking';

// Function to generate time slots in 30-minute intervals
// Here openTime and closeTime convert kora hoise Moment diye.
// Ajker date neya hoise and ajker time neya hoise as now.
// While loop a jodi ajker date hoy tahole slot create hobe koyta baje tar upor.
// Mane holo ajke er date a joto time gese tar por theke slot gula create hobe.
// But porer din gulate pura diner slot create hobe open and closing hours er upor base kore.
export const generateTimeSlots = (
  open: string,
  close: string,
  selectedDate: string
): string[] => {
  const slots: string[] = [];
  const openTime = moment.tz(
    `${selectedDate} ${open.slice(0, 2)}:${open.slice(2)}`,
    'YYYY-MM-DD HH:mm',
    'Europe/Helsinki'
  );
  const closeTime = moment.tz(
    `${selectedDate} ${close.slice(0, 2)}:${close.slice(2)}`,
    'YYYY-MM-DD HH:mm',
    'Europe/Helsinki'
  );
  // console.log('openTime ', openTime);
  // console.log('closeTime ', closeTime);

  // Get today's date in YYYY-MM-DD format
  const todayDate = moment.tz('Europe/Helsinki').format('YYYY-MM-DD');
  //console.log('todayDate  ', todayDate);
  // const todayDate = today.toISOString().split('T')[0];

  // Get the current time in HHMM format
  const now = moment.tz('Europe/Helsinki');
  //console.log('now  ', now);
  let currentSlotTime = openTime.clone();
  //console.log('currentSlotTime ', currentSlotTime);

  while (currentSlotTime.isBefore(closeTime)) {
    const slot = currentSlotTime.format('HHmm');
    if (selectedDate === todayDate) {
      if (currentSlotTime.isSameOrAfter(now)) {
        slots.push(slot);
      }
    } else {
      slots.push(slot);
    }
    currentSlotTime.add(30, 'minutes')
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
