import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { Event, CreateEventPayload } from '@/types/event'

interface EventDialogProps {
  open: boolean
  onClose: () => void
  onSave: (eventData: CreateEventPayload) => void
  event?: Event
  isEditMode: boolean
}

const colorOptions = [
  { value: '#1976d2', label: '青' },
  { value: '#dc004e', label: '赤' },
  { value: '#4caf50', label: '緑' },
  { value: '#ff9800', label: 'オレンジ' },
  { value: '#9c27b0', label: '紫' },
]

const EventDialog = ({ open, onClose, onSave, event, isEditMode }: EventDialogProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs().add(1, 'hour'))
  const [color, setColor] = useState('#1976d2')

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || '')
      setStartDate(dayjs(event.start))
      setEndDate(dayjs(event.end))
      setColor(event.color || '#1976d2')
    } else {
      // 新規作成時は初期値をリセット
      setTitle('')
      setDescription('')
      setStartDate(dayjs())
      setEndDate(dayjs().add(1, 'hour'))
      setColor('#1976d2')
    }
  }, [event, open])

  const handleSubmit = () => {
    if (title.trim() === '') return

    const eventData: CreateEventPayload = {
      title,
      description: description || undefined,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      color,
    }

    onSave(eventData)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'イベントを編集' : '新しいイベント'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="開始日時"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
            />
            <DateTimePicker
              label="終了日時"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
            />
          </LocalizationProvider>
          <FormControl fullWidth>
            <InputLabel>カラー</InputLabel>
            <Select value={color} onChange={(e) => setColor(e.target.value)}>
              {colorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: option.value,
                      }}
                    />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventDialog 