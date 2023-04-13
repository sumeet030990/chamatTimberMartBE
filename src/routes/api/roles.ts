import { Router } from 'express';
import RolesController from '../../app/Controllers/RolesController';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes], RolesController.index);

export default router;
