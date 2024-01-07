import { Router } from 'express';
import AdminController from '../../app/Controllers/AdminController';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes], AdminController.generatePublicPrivateKeys);

export default router;
