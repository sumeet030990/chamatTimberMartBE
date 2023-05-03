import { Router } from 'express';
import AuthController from '../../app/Controllers/AuthController';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.post('/login', [], AuthController.login);
router.patch('/change-password/:id', [protectedRoutes], AuthController.changePassword);
// router.post('/logout', [], UserController.store);

export default router;
