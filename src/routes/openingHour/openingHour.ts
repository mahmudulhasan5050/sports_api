import express from 'express';
import passport from 'passport';

import {
  allOpeningHours,
  getOpeningHourById,
  createOpeningHour,
  updateOpeningHour,
  deleteOpeningHour,
} from '../../controllers/openingHour/openingHour';
import adminAuthMiddleware from '../../middleware/adminAuthMiddleware';

const router = express.Router();

//get all
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  allOpeningHours
);
//get by id
router.get(
  '/:openinghourId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  getOpeningHourById
);

//create 
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  createOpeningHour
);

//update one 
router.post(
  '/:openingHourId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  updateOpeningHour
);

//delete
router.delete(
  '/:openingHourId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  deleteOpeningHour
);

export default router;
