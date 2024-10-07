import express from 'express';
import passport from 'passport';

import {
    allRefund,
    getRefundById,
    createRefund,
    updateRefund,
    deleteRefund,
} from '../controllers/refund';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware';

const router = express.Router();

//get all
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  allRefund
);
//get by id
router.get(
  '/:refundId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  getRefundById
);

//create refund user will create refund
router.post(
  '/:bookingId',
  passport.authenticate('jwt', { session: false }),
  createRefund
);

//update one facility
router.post(
  '/update/:refundId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  updateRefund
);

//delete facility
router.delete(
  '/:refundId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  deleteRefund
);

export default router;
