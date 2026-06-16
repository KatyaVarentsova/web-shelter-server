import { Router } from 'express';
import PetsController from '../controller/pets.controller';
import { validateTokenMiddleware } from '../middleware/middleware';

const router = Router();

router.get('/', PetsController.getPets);
router.get('/dogs', validateTokenMiddleware, PetsController.getPetsDogs);
router.get('/cats', validateTokenMiddleware, PetsController.getPetsCats);
router.get('/:id', PetsController.getPetId);
router.post('/dogs', validateTokenMiddleware, PetsController.createPet, PetsController.getPetsDogs);
router.post('/cats', validateTokenMiddleware, PetsController.createPet, PetsController.getPetsCats);
router.put('/dogs/:id', validateTokenMiddleware, PetsController.updatePet, PetsController.getPetsDogs);
router.put('/cats/:id', validateTokenMiddleware, PetsController.updatePet, PetsController.getPetsCats);
router.delete('/dogs/:id', validateTokenMiddleware, PetsController.deletePet, PetsController.getPetsDogs);
router.delete('/cats/:id', validateTokenMiddleware, PetsController.deletePet, PetsController.getPetsCats);

export default router;