import { Router } from "express";
import authRoutes from './authRoutes';
import varifyRoutes from './varifyRoutes';
import passwordRoutes from './passwordRoutes';
import fightRoutes from './fightRoutes';


const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/auth/verify', varifyRoutes);
router.use('/api/auth', passwordRoutes);
router.use('/api/fight', fightRoutes);

export default router;
