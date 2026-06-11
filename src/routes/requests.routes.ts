import { Router } from 'express';
import RequestsController from '../controller/requests.controller';
import { validateTokenMiddleware } from "../middleware/middleware";

const router = Router();

router.get('/', validateTokenMiddleware, RequestsController.getRequests);
router.post('/', RequestsController.createRequest);

export default router;