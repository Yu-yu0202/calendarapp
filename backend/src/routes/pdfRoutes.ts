import { Router } from 'express';
import pdfController from '../controllers/pdfController';

const router = Router();

router.post('/generate', pdfController.generatePDF);

export default router;