import { Grid, Paper, Typography, Box, Chip, CircularProgress } from '@mui/material'
import { Dayjs } from 'dayjs'
import { styled } from '@mui/material/styles'
import { Event } from '@/types/event'

interface CalendarGridProps {
  currentDate: Dayjs
  events?: Event[]
  isLoading?: boolean
  onEventClick?: (event: Event) => void
}

const DayCell = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))

const EventChip = styled(Chip)(({ theme }) => ({
  margin: '2px 0',
  width: '100%',
  justifyContent: 'flex-start',
  fontSize: '0.75rem',
}))

const weekDays = ['日', '月', '火', '水', '木', '金', '土']

const CalendarGrid = ({ 
  currentDate, 
  events = [], 
  isLoading = false,
  onEventClick 
}: CalendarGridProps) => {
  const startOfMonth = currentDate.startOf('month')
  const endOfMonth = currentDate.endOf('month')
  const startDate = startOfMonth.startOf('week')
  const endDate = endOfMonth.endOf('week')

  const getEventsForDate = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD')
    return events.filter(
      (event) =>
        new Date(event.start).toISOString().split('T')[0] <= dateStr &&
        new Date(event.end).toISOString().split('T')[0] >= dateStr
    )
  }

  const days: Dayjs[] = []
  let day = startDate
  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    days.push(day)
    day = day.add(1, 'day')
  }

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEventClick) {
      onEventClick(event)
    }
  }

  return (
    <Grid container spacing={1} sx={{ p: 2, position: 'relative' }}>
      {isLoading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}>
          <CircularProgress />
        </Box>
      )}
      {weekDays.map((weekDay) => (
        <Grid key={weekDay} item xs={12 / 7}>
          <Typography align="center" sx={{ fontWeight: 'bold' }}>
            {weekDay}
          </Typography>
        </Grid>
      ))}
      {days.map((date) => {
        const dateEvents = getEventsForDate(date)
        return (
          <Grid key={date.format('YYYY-MM-DD')} item xs={12 / 7}>
            <DayCell elevation={1}>
              <Typography
                sx={{
                  color:
                    date.month() !== currentDate.month()
                      ? 'text.disabled'
                      : date.day() === 0
                      ? 'error.main'
                      : date.day() === 6
                      ? 'primary.main'
                      : 'text.primary',
                  fontWeight: date.isSame(new Date(), 'day') ? 'bold' : 'normal',
                }}
              >
                {date.format('D')}
              </Typography>
              <Box sx={{ mt: 1, overflow: 'auto', flex: 1 }}>
                {dateEvents.slice(0, 3).map((event) => (
                  <EventChip
                    key={event.id}
                    label={event.title}
                    size="small"
                    onClick={(e) => handleEventClick(event, e)}
                    sx={{
                      backgroundColor: event.color || '#1976d2',
                      color: 'white',
                    }}
                  />
                ))}
                {dateEvents.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    他 {dateEvents.length - 3} 件
                  </Typography>
                )}
              </Box>
            </DayCell>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default CalendarGrid 