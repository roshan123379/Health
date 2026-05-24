import express from 'express';
import { createManpower, getManpower } from '../Controllers/manpowerController.js';

const router = express.Router();

router.post('/', createManpower);
router.get('/', getManpower);

export default router;
