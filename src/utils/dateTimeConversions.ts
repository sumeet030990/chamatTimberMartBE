import moment from 'moment';
import { DATE_FORMAT } from './constant';

export const getCurrentDate = () => {
  return moment(new Date(), DATE_FORMAT).utc().toDate();
};

/**
 *
 * @param {*} date
 * @returns string
 */
export const convertToDdMmYyString = (date: any) => {
  return moment(date).utc().format(DATE_FORMAT);
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
  const dateObject = moment(dateWithTime, `${inputFormat} HH:mm:ss`, true).utc();

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
