import { Router } from 'express';
import pdfController, { upload } from '../controllers/pdfController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// PDF生成
router.post('/generate', authenticateToken, pdfController.generatePDF);

// 背景画像アップロード
router.post('/upload-background', authenticateToken, upload.single('background'), pdfController.uploadBackground);

// 背景画像一覧取得
router.get('/backgrounds', authenticateToken, pdfController.listBackgrounds);

export default router;