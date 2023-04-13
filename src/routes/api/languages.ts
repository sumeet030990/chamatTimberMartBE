import { Router } from 'express';
import LanguageController from '../../app/Controllers/LanguageController';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes], LanguageController.index);

export default router;
