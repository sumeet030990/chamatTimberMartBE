import { Router } from 'express';
import AccountStatementController from '../../app/Controllers/AccountStatementController';
import companyAccessCheck from '../../app/Middlewares/companyAccessMiddleware';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes, companyAccessCheck], AccountStatementController.index);

export default router;
