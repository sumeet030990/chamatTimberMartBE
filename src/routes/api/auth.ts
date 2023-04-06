import { Router } from 'express';
import AuthController from '../../app/Controllers/AuthController';

const router = Router();

router.post('/login', [], AuthController.login);
// router.post('/logout', [], UserController.store);

export default router;
