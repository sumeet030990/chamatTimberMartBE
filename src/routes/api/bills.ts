import { Router } from 'express';
import BillsController from '../../app/Controllers/BillsController';
import companyAccessCheck from '../../app/Middlewares/companyAccessMiddleware';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes, companyAccessCheck], BillsController.index);
router.get('/:id', [protectedRoutes], BillsController.show);
router.post('', [protectedRoutes, companyAccessCheck], BillsController.store);
// router.put('/:id', [protectedRoutes], BillsController.update);
// router.delete('/:id', [protectedRoutes], BillsController.destroy);

export default router;
