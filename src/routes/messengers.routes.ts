import { Router } from 'express';
import MessengersController from '../controller/messengers.controller';

const router = Router();

router.post('/', MessengersController.createMessenger);
router.delete('/:id', MessengersController.deleteMessenger);

export default router;