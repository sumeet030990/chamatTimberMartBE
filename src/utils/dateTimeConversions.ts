import moment from 'moment-timezone';
import { DATE_FORMAT } from './constant';

moment.tz.setDefault(process.env.TZ || 'Asia/Calcutta');

export const getCurrentDate = () => {
  const currentDate = new Date();

  // Set the timezone to Indian Standard Time (IST)
  const momentObj = moment(currentDate);

  // Get the date as a JavaScript Date object
  const dateObject = momentObj.toDate();

  return dateObject;
};

export const convertDateToISOString = (inputDate: any, endDay: boolean = false) => {
  if (endDay) return moment(inputDate, 'DD/MM/YY').endOf('day').toISOString(); // op='2024-01-23T18:29:59.999Z'

  return moment(inputDate, 'DD/MM/YY').startOf('day').toISOString(); // op='2024-01-22T18:30:00.000Z';
};
/**
 *
 * @param {*} date
 * @returns string
 */
export const convertToDdMmYyString = (date: any) => {
  return moment(date).format(DATE_FORMAT);
};

/**
 *
 * @param {*} date
 * @returns Data
 */
export const convertDateStringToDate = (date: string) => {
  const dateString = date;
  const inputFormat = 'DD/MM/YY';
  const specificTime = '12:00:00'; // You can adjust this to the time you prefer

  // Concatenate the date string and time
  const dateWithTime = `${dateString} ${specificTime}`;

  // Parse the date string with the specified format and strict parsing
  const dateObject = moment(dateWithTime, `${inputFormat} HH:mm:ss`, true);

  return dateObject;
};

export const subtractDateByDays = (date: string, numberOfDays: number) => {
  const dateObject = convertDateStringToDate(date);
  // Subtract one day
  const result = moment(dateObject).subtract(numberOfDays, 'days').toDate();

  return result;
};

export const addDateByDays = (date: string, numberOfDays: number) => {
  const dateObject = convertDateStringToDate(date);
  // Subtract one day
  const result = moment(dateObject).add(numberOfDays, 'days').toDate();

  return result;
};
