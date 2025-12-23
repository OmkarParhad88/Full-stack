import { Router } from "express";
import authRoutes from './authRoutes';
import varifyRoutes from './varifyRoutes';
const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/auth/verify', varifyRoutes);

export default router;
