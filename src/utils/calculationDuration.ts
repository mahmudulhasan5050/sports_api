import moment from "moment-timezone";

export const calculateDuration = (startTime: string, endTime: string) => {
    const format = "HHmm"; 
    const start = moment(startTime, format);
    const end = moment(endTime, format);

    const durationInMinutes = moment.duration(end.diff(start)).asMinutes();

    return durationInMinutes; 
};