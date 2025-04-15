import { useState, useEffect } from 'react'
import { Box, Paper, Grid, Button, Typography, Snackbar, Alert } from '@mui/material'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import EventDialog from '@/components/EventDialog'
import dayjs from 'dayjs'
import { Event, CreateEventPayload, UpdateEventPayload } from '@/types/event'
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/api/eventApi'
import { Add as AddIcon } from '@mui/icons-material'

const Calendar = () => {
  console.log('カレンダーコンポーネントがレンダリングされました'); // デバッグログ
  
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [alertInfo, setAlertInfo] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const startOfMonth = currentDate.startOf('month')
  const endOfMonth = currentDate.endOf('month')
  const startDate = startOfMonth.startOf('week')
  const endDate = endOfMonth.endOf('week')

  const fetchEventData = async () => {
    setIsLoading(true)
    try {
      console.log('イベントデータを取得しています...'); // デバッグログ
      const data = await fetchEvents(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      )
      console.log('取得したイベントデータ:', data); // デバッグログ
      setEvents(data)
    } catch (error) {
      console.error('イベントの取得に失敗しました:', error)
      showAlert('イベントの取得に失敗しました', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('カレンダーの日付変更:', currentDate.format('YYYY-MM-DD')); // デバッグログ
    fetchEventData()
  }, [currentDate])

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  const handleToday = () => {
    setCurrentDate(dayjs())
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleAddEvent = () => {
    setSelectedEvent(undefined)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleSaveEvent = async (eventData: CreateEventPayload) => {
    try {
      console.log('イベントを保存しています:', eventData); // デバッグログ
      if (isEditMode && selectedEvent) {
        const updatedEventData: UpdateEventPayload = {
          ...eventData,
          id: selectedEvent.id,
        }
        await updateEvent(updatedEventData)
        showAlert('イベントを更新しました', 'success')
      } else {
        await createEvent(eventData)
        showAlert('イベントを作成しました', 'success')
      }
      fetchEventData()
    } catch (error) {
      console.error('イベントの保存に失敗しました:', error)
      showAlert('イベントの保存に失敗しました', 'error')
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      await deleteEvent(selectedEvent.id)
      showAlert('イベントを削除しました', 'success')
      fetchEventData()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('イベントの削除に失敗しました:', error)
      showAlert('イベントの削除に失敗しました', 'error')
    }
  }

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertInfo({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseAlert = () => {
    setAlertInfo({
      ...alertInfo,
      open: false,
    })
  }

  console.log('カレンダーのレンダリング...'); // デバッグログ

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Paper elevation={3} sx={{ minHeight: '80vh' }}>
        <Grid container direction="column">
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">カレンダー</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddEvent}
            >
              イベント追加
            </Button>
          </Box>
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            isLoading={isLoading}
            onEventClick={handleEventClick}
          />
        </Grid>
      </Paper>

      <EventDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveEvent}
        event={selectedEvent}
        isEditMode={isEditMode}
      />

      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alertInfo.severity}>
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Calendar 