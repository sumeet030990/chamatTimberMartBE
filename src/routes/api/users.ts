import { Router } from 'express';
import UserController from '../../app/Controllers/UserController';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes], UserController.index);
router.get('/:id', [protectedRoutes], UserController.show);
router.post('', [], UserController.store);
router.put('/:id', [], UserController.update);
router.delete('/:id', [], UserController.destroy);

export default router;
