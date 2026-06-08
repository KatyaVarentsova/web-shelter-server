import { Router } from 'express';
import RequestsController from '../controller/requests.controller';

const router = Router();

router.get('/', RequestsController.getRequests);
router.post('/', RequestsController.createRequest);

export default router;