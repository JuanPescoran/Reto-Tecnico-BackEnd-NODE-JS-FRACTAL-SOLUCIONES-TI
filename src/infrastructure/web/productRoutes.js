import { Router } from 'express';
import { productController } from '../../interfaces/controllers/productController.js';
const router = Router();
router.get('/', productController.getAll);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);
export default router;