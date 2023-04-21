import { Request, Response } from 'express';
import { successResponse } from '../../utils/helpers';
import LocationService from '../Services/LocationService';

const fetchAllCountries = async (req: Request, res: Response, next: any) => {
  try {
    const countries = await LocationService.fetchAllCountries();

    return res.json(successResponse(countries));
  } catch (error: any) {
    return next(error);
  }
};

const fetchCountryStates = async (req: Request, res: Response, next: any) => {
  try {
    const { iso } = req.params;
    const countries = await LocationService.fetchCountryStates(iso);

    return res.json(successResponse(countries));
  } catch (error: any) {
    return next(error);
  }
};

const fetchAllStateCities = async (req: Request, res: Response, next: any) => {
  try {
    const { countryIso, stateIso } = req.params;
    const countries = await LocationService.fetchAllStateCities(countryIso, stateIso);

    return res.json(successResponse(countries));
  } catch (error: any) {
    return next(error);
  }
};

export default {
  fetchAllCountries,
  fetchCountryStates,
  fetchAllStateCities,
};
