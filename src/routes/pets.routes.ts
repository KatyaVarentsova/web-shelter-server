import { Router } from 'express';
import PetsController from '../controller/pets.controller';
import { validateTokenMiddleware } from '../middleware/middleware';

const router = Router();

router.get('/', PetsController.getPets);
router.get('/dogs', validateTokenMiddleware, PetsController.getPetsDogs);
router.get('/cats', validateTokenMiddleware, PetsController.getPetsCats);
router.get('/:id', PetsController.getPetId);
router.post('/', PetsController.createPet);
router.delete('/dogs/:id', validateTokenMiddleware, PetsController.deletePet, PetsController.getPetsDogs);
router.delete('/cats/:id', validateTokenMiddleware, PetsController.deletePet, PetsController.getPetsCats);
// router.put('/:id', PetsController.updatePet);



export default router;