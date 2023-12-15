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
  const dateMomentObject = moment(date, DATE_FORMAT).utc(); // 1st argument - string, 2nd argument - format

  return dateMomentObject.toDate(); // convert moment.js object to Date object
};
