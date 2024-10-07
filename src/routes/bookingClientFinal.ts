import express from 'express';
import passport from 'passport';

import {
  createBooking,
  deleteBooking,
} from '../controllers/bookingClientFinal';

const router = express.Router();

//create Booking
router.post(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  createBooking
);

//Cancel Booking
router.delete(
  '/:bookingId',
  passport.authenticate('jwt', { session: false }),
  deleteBooking
);

export default router;
