import express from 'express';

import {
    signUp,
    confirmEmail,
    signIn,
    forgotPassword,
    resetPassword,
    googleRedirect
  
} from '../controllers/auth';
import passport from 'passport';

const router = express.Router();

router.post('/signup', signUp);

router.get('/confirm/:token', confirmEmail)
router.post('/signin', signIn);


router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

//google
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/google/redirect', passport.authenticate('google', {session: false}), googleRedirect)

  

export default router;