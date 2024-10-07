import express from 'express';
import passport from 'passport';

import {
  allUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware';

const router = express.Router();

//get all
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  allUsers
);
//get by id
router.get('/:userId', getUserById); // Check auth related fact

//create
//this api is available in auth
//------ router.post('/', createUser)

//update
router.post('/:userId', updateUser); // check if it is needed

//delete
router.delete(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  deleteUser
);

export default router;
