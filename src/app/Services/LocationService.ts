import axios from 'axios';
import config from 'config';
import createHttpError from 'http-errors';

/**
 * Fetch all Countries
 *
 * @returns Collection
 */
const fetchAllCountries = async () => {
  const data = await axios
    .get(`${config.get('LOCATION_API_URL')}/countries`, {
      headers: {
        'X-CSCAPI-KEY': config.get('LOCATION_API_KEY'),
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new createHttpError.UnprocessableEntity(error);
    });

  return data;
};

/**
 * Fetch all Countries States
 *
 * @returns Collection
 */
const fetchCountryStates = async (iso: String) => {
  const data = await axios
    .get(`${config.get('LOCATION_API_URL')}/countries/${iso}/states`, {
      headers: {
        'X-CSCAPI-KEY': config.get('LOCATION_API_KEY'),
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new createHttpError.UnprocessableEntity(error);
    });

  return data;
};

/**
 * Fetch all State City
 *
 * @returns Collection
 */
const fetchAllStateCities = async (countryIso: String, stateIso: String) => {
  const data = await axios
    .get(`${config.get('LOCATION_API_URL')}/countries/${countryIso}/states/${stateIso}/cities`, {
      headers: {
        'X-CSCAPI-KEY': config.get('LOCATION_API_KEY'),
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new createHttpError.UnprocessableEntity(error);
    });

  return data;
};

export default {
  fetchAllCountries,
  fetchCountryStates,
  fetchAllStateCities,
};
