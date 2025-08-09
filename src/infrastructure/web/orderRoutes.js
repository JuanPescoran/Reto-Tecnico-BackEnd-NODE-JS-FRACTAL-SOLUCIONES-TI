import { Router } from 'express';
import { orderController } from '../../interfaces/controllers/orderController.js';
const router = Router();
router.get('/', orderController.getAll);
router.post('/', orderController.create);
router.get('/:id', orderController.getById);
router.delete('/:id', orderController.delete);
router.patch('/:id/status', orderController.updateStatus); // Usamos PATCH para actualizaciones parciales
export default router;