import express from 'express';
import passport from 'passport';

import {
  getAvailableTime,
  getAvailableCourt,
  getAvailableDuration,
  getUserBooking,
  cancelBookingByUser,
} from '../controllers/bookingClient';

const router = express.Router();

//get available time according to the date and facility(court) name comes with req.body
router.post('/available-time', getAvailableTime);

// get available court according to date, facility(court) and time
router.post('/available-court', getAvailableCourt);

//get available time duration for a facility(court)
router.post('/available-duration', getAvailableDuration);

//get bookings for one user
router.get(
  '/booking-for-user',
  passport.authenticate('jwt', { session: false }),
  getUserBooking
);

// delete booking by user
router.post(
  '/:bookingId',
  passport.authenticate('jwt', { session: false }),
  cancelBookingByUser
);

export default router;
