import { Router } from 'express';
import ItemController from '../../app/Controllers/ItemController';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes], ItemController.index);
router.get('/:id', [protectedRoutes], ItemController.show);
router.post('', [protectedRoutes], ItemController.store);
router.put('/:id', [protectedRoutes], ItemController.update);
router.delete('/:id', [protectedRoutes], ItemController.destroy);

export default router;
