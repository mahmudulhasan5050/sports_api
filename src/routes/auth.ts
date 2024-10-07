import express from 'express';

import {
    signUp,
    confirmEmail,
    signIn,
    forgotPassword,
    resetPassword
  
} from '../controllers/auth';

const router = express.Router();

router.post('/signup', signUp);

router.get('/confirm/:token', confirmEmail)
router.post('/signin', signIn);


router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

  

export default router;