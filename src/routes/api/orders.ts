import { Router } from 'express';
import OrderController from '../../app/Controllers/OrderController';
import companyAccessCheck from '../../app/Middlewares/companyAccessMiddleware';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes, companyAccessCheck], OrderController.index);
router.get('/:id', [protectedRoutes], OrderController.show);
router.post('', [protectedRoutes, companyAccessCheck], OrderController.store);
// router.put('/:id', [protectedRoutes], OrderController.update);
// router.delete('/:id', [protectedRoutes], OrderController.destroy);

export default router;
