import { Router } from 'express';
import PetImagesController from '../controller/petImages.controller';

const router = Router();

router.get('/', PetImagesController.getPetImages);
router.post('/', PetImagesController.createPetImage);
router.put('/:id', PetImagesController.updatePetImage);
router.delete('/:id', PetImagesController.deletePetImage);

export default router;