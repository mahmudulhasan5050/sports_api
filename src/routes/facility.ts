import express from 'express';
import passport from 'passport';

import {
  allFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilityById,
} from '../controllers/facility';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware';
 
const router = express.Router();

//get all
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  allFacility
);
//get by id
router.get(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  getFacilityById
);

//create facility
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  createFacility
);

//update one facility
router.post(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  updateFacility
);

//delete facility
router.delete(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  deleteFacility
);

export default router;
