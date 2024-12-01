import express from 'express';

import {
  allBooking,
  createAdminBooking,
  updateBooking,
  deleteBooking,
  getBookingById,
  getDashboardInfo,
  getBookingByDate,
  getUnpaidRefund,
  updateRefund,
} from '../controllers/booking';
import passport from 'passport';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware';

const router = express.Router();

//get all
router.get(
  '/limit-30/:page',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  allBooking
);

//get refund info
router.get(
  '/refund',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  getUnpaidRefund
);

//get info for dashboard
router.get('/dashboard',
  passport.authenticate('jwt', {session: false}),
  adminAuthMiddleware,
  getDashboardInfo
)

//get by id
router.get(
  '/:bookingId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  getBookingById
);


//get booking by date
router.get(
  '/booking-by-date/:date',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  getBookingByDate
);

//create Booking
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  createAdminBooking
); //check is it being used or not

//update one Booking
router.post(
  '/update/:bookingId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  updateBooking
); //check is it being used or not

router.post('/refund/:bookingId', updateRefund);


//delete Booking
router.delete(
  '/:bookingId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  deleteBooking
); //check is it being used or not

export default router;
