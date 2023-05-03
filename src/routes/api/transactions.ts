import { Router } from 'express';
import TransactionController from '../../app/Controllers/TransactionController';
import companyAccessCheck from '../../app/Middlewares/companyAccessMiddleware';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes, companyAccessCheck], TransactionController.index);
router.post('', [protectedRoutes, companyAccessCheck], TransactionController.store);
router.delete('/:id', [protectedRoutes, companyAccessCheck], TransactionController.destroy);

export default router;
