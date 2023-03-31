import { Request, Response, Router } from 'express';

const router = Router();

router.use('/home', (req: Request, res: Response) => {
  res.send('Website Initial page');
});

export default router;
