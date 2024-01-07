import { Router } from 'express';
import AdminController from '../../app/Controllers/AdminController';

const router = Router();

router.get('', [], AdminController.generatePublicPrivateKeys);

export default router;
