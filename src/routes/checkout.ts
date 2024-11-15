import express from 'express';
import { checkoutStripe,verifyPaymentStripe } from '../controllers/checkout';

const router = express.Router();

// checkout request
router.post(
    '/',
    checkoutStripe
  );

  //verify payment
  router.post('/verify-payment', verifyPaymentStripe)


  export default router;