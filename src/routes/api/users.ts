import { Router } from 'express';
import UserController from '../../app/Controllers/UserController';

const router = Router();

router.get('', [], UserController.index);
router.post('', [], UserController.store);
router.put('/:id', [], UserController.update);
router.delete('/:id', [], UserController.destroy);

export default router;
