import { Router } from 'express';
import RequestsController from '../controller/requests.controller';
import { validateTokenMiddleware } from "../middleware/middleware";

const router = Router();

router.get('/', validateTokenMiddleware, RequestsController.getRequests);
router.post('/', RequestsController.createRequest);
router.delete('/:id', validateTokenMiddleware, RequestsController.deleteRequest, RequestsController.getRequests);

export default router;