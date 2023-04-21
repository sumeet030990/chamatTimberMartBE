import { Router } from 'express';
import CompanyController from '../../app/Controllers/CompanyController';
import protectedRoutes from '../../app/Middlewares/protectedRouteMiddleware';

const router = Router();

router.get('', [protectedRoutes], CompanyController.index);
router.get('/:id', [protectedRoutes], CompanyController.show);
router.post('', [protectedRoutes], CompanyController.store);
router.put('/:id', [protectedRoutes], CompanyController.update);
router.delete('/:id', [protectedRoutes], CompanyController.destroy);

export default router;
