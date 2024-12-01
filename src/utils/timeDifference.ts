import moment from 'moment-timezone';

// CHeck time difference to check cancellation time
export const calculateTimeDifference = (date: Date, time: string) =>{
      // Get the current date and time
      const currentTime = moment.tz('Europe/Helsinki');
      
      // Get the start time of the booking
      const bookingDateTime = moment.tz(
        `${date.toISOString().split('T')[0]} ${time}`,
        'YYYY-MM-DD HH:mm',
        'Europe/Helsinki'
      );

      // Calculate the time difference in milliseconds
      const timeDifference = bookingDateTime.diff(currentTime);
      // Convert milliseconds to hours
      const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

      return timeDifferenceInHours
}