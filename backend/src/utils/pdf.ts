import fs from 'fs';
import path from 'path';

export class PDFUtil {
  /**
   * 画像をBase64からデコードして一時ファイルとして保存します
   * @param base64Image Base64エンコードされた画像データ
   * @returns 一時ファイルのパス
   */
  static async saveTemporaryImage(base64Image: string): Promise<string> {
    const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      throw new Error('無効な画像データです。');
    }

    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    const tempFilePath = path.join(tempDir, `${Date.now()}.png`);

    await fs.promises.writeFile(tempFilePath, imageBuffer);
    return tempFilePath;
  }

  /**
   * 一時ファイルを削除します
   * @param filePath 削除する一時ファイルのパス
   */
  static async cleanupTemporaryFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error('一時ファイルの削除に失敗しました:', error);
    }
  }

  /**
   * PDFのページサイズを計算します
   * @param layout レイアウト（'portrait' または 'landscape'）
   * @returns ページサイズの設定オブジェクト
   */
  static calculatePageSize(layout: 'portrait' | 'landscape'): {
    width: number;
    height: number;
  } {
    const a4Width = 595.28;
    const a4Height = 841.89;

    return layout === 'portrait'
      ? { width: a4Width, height: a4Height }
      : { width: a4Height, height: a4Width };
  }
}

export default PDFUtil;