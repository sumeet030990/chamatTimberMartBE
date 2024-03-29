import config from 'config';
import { Request, Response, Router } from 'express';
import moment from 'moment';
import accountStatementRoutes from './accountStatement';
import adminRoutes from './admin';
import authRoutes from './auth';
import billsRoutes from './bills';
import companyRoute from './company';
import itemsRoutes from './items';
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
router.use('/items', itemsRoutes);
router.use('/bills', billsRoutes);
router.use('/account-statement', accountStatementRoutes);
router.use('/admin', adminRoutes);

// get server info
router.use('/server-info', (req: Request, res: Response) => {
  return res.json({
    APP_URL: config.get('APP_URL'),
    FE_URL: config.get('FE_URL'),
    PORT: config.get('PORT'),
    APP_ENV: config.get('APP_ENV'),
    TimeZone: `${moment().format('Z')}-${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  });
});

export default router;
