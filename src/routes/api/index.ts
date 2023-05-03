import { Router } from 'express';
import authRoutes from './auth';
import companyRoute from './company';
import languagesRoute from './languages';
import locationsRoute from './location';
import rolesRoutes from './roles';
import transactionRoutes from './transactions';
import userRoutes from './users';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', rolesRoutes);
router.use('/languages', languagesRoute);
router.use('/locations', locationsRoute);
router.use('/companies', companyRoute);
router.use('/transactions', transactionRoutes);

export default router;
