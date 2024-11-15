import Stripe from 'stripe'
import { stripeSecretKey } from '../utils/secrets'


export const stripe = new Stripe(stripeSecretKey)