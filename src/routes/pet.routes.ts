import { Router } from 'express';
import PetController from '../controller/pet.controller';

const router = Router();

router.get('/pets', PetController.getPets);
router.post('/pets', PetController.createPet);
router.get('/pets/:id', PetController.getPetId);
router.put('/pets/:id', PetController.updatePet);
router.delete('/pets/:id', PetController.deletePet);

export default router;