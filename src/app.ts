// Import the 'express' module
import express, {
  Application,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import mongoose from 'mongoose'
import passport from 'passport'
import createHttpError from 'http-errors';
import cors from 'cors'

import { Port, MongoUri } from './utils/secrets';

import userRouter from './routes/user'
import facilityUnitRouter from './routes/facilityUnit'
import facilityRouter from './routes/facility'
import openingHourRouter from './routes/openingHour/openingHour'
import bookingRouter from './routes/booking'
import authRouter from './routes/auth'
import bookingClientRouter from './routes/bookingClient'
import bookingClientFinalRouter from './routes/bookingClientFinal';
import refundRouter from './routes/refund'
import { jwtStrategy } from './config/passport';

//Database connection
mongoose
  .connect(MongoUri)
  .then(() => {
    console.log('mongoDB connected!!');
  })
  .catch((err) => {
    console.log('Mongo Error' + err);
  });



// Create an Express application
const app: Application = express();
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json({limit: '100mb'}))
app.use(express.urlencoded({extended: true}))


app.use(passport.initialize())
passport.use(jwtStrategy)


//all routes list
//user
app.use('/api/v1/user', userRouter)
//facility
app.use('/api/v1/facilityunit', facilityUnitRouter)
// faciliy details
app.use('/api/v1/facility', facilityRouter)
//opening hour 
app.use('/api/v1/openinghour', openingHourRouter)
//app.use('/api/v1/exceptionday', exceptionDayRouter)    //to do. later
app.use('/api/v1/booking', bookingRouter)

//when client is checking schedules for booking (no auth)
app.use('/api/v1/booking-client', bookingClientRouter)
//user auth needed
app.use('/api/v1/booking-client-final', bookingClientFinalRouter)

//refund
app.use('/api/v1/refund', refundRouter)

//auth
app.use('/api/v1/auth', authRouter)

//handle error
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createHttpError.NotFound());
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    status: error.status || 500,
    message: error.message,
  });
};

app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(Port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${Port}`);
});
