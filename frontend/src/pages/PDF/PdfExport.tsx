import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  IconButton,
  Radio,
  RadioGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import client from '@/api/client';
import { Upload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface BackgroundImage {
  name: string;
  path: string;
  url: string;
}

const PdfExport = () => {
  // 日付範囲
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf('month'));
  
  // PDF設定
  const [title, setTitle] = useState('カレンダー');
  const [layout, setLayout] = useState<'portrait' | 'landscape'>('landscape');
  const [showDescription, setShowDescription] = useState(false);
  
  // 背景画像関連
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState<'background' | 'top' | 'left'>('background');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // 状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 初期ロード時に背景画像を取得
  useEffect(() => {
    fetchBackgroundImages();
  }, []);

  // 背景画像のリストを取得
  const fetchBackgroundImages = async () => {
    try {
      const response = await client.get('/pdf/backgrounds');
      setBackgroundImages(response.data.backgrounds || []);
    } catch (err) {
      console.error('背景画像の取得に失敗しました:', err);
    }
  };

  // 背景画像をアップロード
  const handleImageUpload = async () => {
    if (!uploadFile) return;

    setUploadLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('background', uploadFile);

      const response = await client.post('/pdf/upload-background', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('背景画像をアップロードしました');
      setUploadFile(null);
      
      // 背景画像のリストを更新
      await fetchBackgroundImages();
      
      // アップロードした画像を選択
      setSelectedImage(response.data.path);
    } catch (err) {
      console.error('画像アップロードエラー:', err);
      setError('背景画像のアップロードに失敗しました');
    } finally {
      setUploadLoading(false);
    }
  };

  // ファイル選択ハンドラ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  // PDFエクスポート処理
  const handleExport = async () => {
    if (!startDate || !endDate) {
      setError('開始日と終了日を選択してください');
      return;
    }

    if (startDate.isAfter(endDate)) {
      setError('開始日は終了日より前にしてください');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await client.post('/pdf/generate', {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        title,
        layout,
        backgroundImage: selectedImage,
        style: imageStyle,
        showDescription
      }, {
        responseType: 'blob' // レスポンスをBlobとして受け取る
      });

      // PDFダウンロード
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `calendar_${startDate.format('YYYYMMDD')}_${endDate.format('YYYYMMDD')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess('PDFエクスポートが完了しました！');
    } catch (err) {
      console.error('PDFエクスポートエラー:', err);
      setError('PDFの生成に失敗しました。しばらく経ってからもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        カレンダーPDFエクスポート
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              日付範囲
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="開始日"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              sx={{ width: '100%' }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="終了日"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              sx={{ width: '100%' }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              PDFオプション
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="PDF タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>向き</InputLabel>
              <Select
                value={layout}
                label="向き"
                onChange={(e) => setLayout(e.target.value as 'portrait' | 'landscape')}
              >
                <MenuItem value="portrait">縦向き</MenuItem>
                <MenuItem value="landscape">横向き</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={showDescription}
                  onChange={(e) => setShowDescription(e.target.checked)}
                />
              }
              label="イベントの説明文を表示"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              背景画像設定
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<UploadIcon />}
                sx={{ mr: 2 }}
                disabled={uploadLoading}
              >
                画像をアップロード
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              
              {uploadFile && (
                <>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {uploadFile.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleImageUpload}
                    disabled={uploadLoading}
                  >
                    {uploadLoading ? <CircularProgress size={24} /> : '送信'}
                  </Button>
                </>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1" gutterBottom>
                背景画像の配置スタイル
              </Typography>
              <RadioGroup
                row
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value as 'background' | 'top' | 'left')}
              >
                <FormControlLabel value="background" control={<Radio />} label="背景全体" />
                <FormControlLabel value="top" control={<Radio />} label="上部" />
                <FormControlLabel value="left" control={<Radio />} label="左部" />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              背景画像を選択
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Card 
                sx={{ 
                  width: 150, 
                  height: 150, 
                  border: selectedImage === null ? '2px solid #1976d2' : 'none'
                }}
              >
                <CardActionArea 
                  sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  onClick={() => setSelectedImage(null)}
                >
                  <Typography variant="body2" align="center">
                    背景なし
                  </Typography>
                </CardActionArea>
              </Card>
              
              {backgroundImages.map((image) => (
                <Card 
                  key={image.path} 
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    border: selectedImage === image.path ? '2px solid #1976d2' : 'none'
                  }}
                >
                  <CardActionArea onClick={() => setSelectedImage(image.path)}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={`${import.meta.env.VITE_API_BASE_URL}/..${image.url}`}
                      alt={image.name}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="body2" noWrap>
                        {image.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleExport}
                disabled={isLoading || !startDate || !endDate}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'PDFを生成中...' : 'PDFをエクスポート'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PdfExport; 