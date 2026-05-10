import { Router } from 'express';
import PetsController from '../controller/pets.controller';

const router = Router();

router.get('/', PetsController.getPets);
router.post('/', PetsController.createPet);
router.get('/:id', PetsController.getPetId);
router.put('/:id', PetsController.updatePet);
router.delete('/:id', PetsController.deletePet);

export default router;