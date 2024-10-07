import express from 'express';
import passport from 'passport';

import {
  allFacilityUnit,
  createFacilityUnit,
  updateFacilityUnit,
  deleteFacilityUnit,
} from '../controllers/facilityUnit';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware';

const router = express.Router();

//get all
router.get('/', allFacilityUnit);

//create facilityUnit
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  createFacilityUnit
);

//update one facilityUnit
router.post(
  '/:facilityUnitId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  updateFacilityUnit
);

//delete facilityUnit
router.delete(
  '/:facilityUnitId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  deleteFacilityUnit
);

export default router;
