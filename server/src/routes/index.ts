import { Router } from "express";
import authRoutes from './authRoutes';
import varifyRoutes from './varifyRoutes';
import passwordRoutes from './passwordRoutes';
const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/auth/verify', varifyRoutes);
router.use('/api/auth', passwordRoutes);

export default router;
