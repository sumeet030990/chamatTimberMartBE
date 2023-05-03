import moment from 'moment';

export const getCurrentDate = () => {
  return moment().utc().toDate();
};

/**
 *
 * @param {*} date
 * @returns string
 */
export const convertToDdMmYyString = (date: any) => {
  return moment(date).utc().format('DD/MM/YY');
};

/**
 *
 * @param {*} date
 * @returns Data
 */
export const convertToDdMmYyToDate = (date: string) => {
  const dateMomentObject = moment(date, 'DD/MM/YYYY').utc(); // 1st argument - string, 2nd argument - format

  return dateMomentObject.toDate(); // convert moment.js object to Date object
};
