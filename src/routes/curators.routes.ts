import { Router } from 'express';
import CuratorsController from '../controller/curators.controller';

const router = Router();

router.get('/', CuratorsController.getCurators);
router.get('/:id', CuratorsController.getCuratorId);
router.post('/', CuratorsController.createCurator);

export default router;