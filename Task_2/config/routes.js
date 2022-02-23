
import express from 'express';
const router = express.Router();

import spotsRoutes from '../spots/spotRoutes.js'
spotsRoutes(router);

export default router;