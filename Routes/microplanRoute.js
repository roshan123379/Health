import express from 'express';
import { createMicroplan, getMicroplans } from '../Controllers/microplanController.js';

const router = express.Router();

router.post('/', createMicroplan);
router.get('/', getMicroplans);

export default router;
