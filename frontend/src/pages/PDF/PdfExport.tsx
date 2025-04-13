import { useState } from 'react';
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
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import client from '@/api/client';

const PdfExport = () => {
  // 日付範囲
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf('month'));
  
  // PDF設定
  const [title, setTitle] = useState('カレンダー');
  const [layout, setLayout] = useState<'portrait' | 'landscape'>('landscape');
  const [format, setFormat] = useState<'A4' | 'A3'>('A4');
  const [showDescription, setShowDescription] = useState(false);
  const [showTime, setShowTime] = useState(true);
  
  // 状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        format,
        showDescription,
        showTime
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
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
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
              <InputLabel>用紙サイズ</InputLabel>
              <Select
                value={format}
                label="用紙サイズ"
                onChange={(e) => setFormat(e.target.value as 'A4' | 'A3')}
              >
                <MenuItem value="A4">A4</MenuItem>
                <MenuItem value="A3">A3</MenuItem>
              </Select>
            </FormControl>
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
              label="説明文を表示"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={showTime}
                  onChange={(e) => setShowTime(e.target.checked)}
                />
              }
              label="時間を表示"
            />
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