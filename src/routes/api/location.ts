import { Router } from 'express';
import LocationController from '../../app/Controllers/LocationController';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('/countries', [protectedRoutes], LocationController.fetchAllCountries);
router.get('/countries/:iso/states', [protectedRoutes], LocationController.fetchCountryStates);
router.get('/countries/:countryIso/states/:stateIso/cities', [protectedRoutes], LocationController.fetchAllStateCities);

export default router;
