import { Grid, IconButton, Typography } from '@mui/material'
import { ChevronLeft, ChevronRight, Today } from '@mui/icons-material'
import { Dayjs } from 'dayjs'

interface CalendarHeaderProps {
  currentDate: Dayjs
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

const CalendarHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ p: 2 }}
    >
      <Grid item xs={6}>
        <Typography variant="h5">
          {currentDate.format('YYYY年 M月')}
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <IconButton onClick={onToday} size="large">
          <Today />
        </IconButton>
        <IconButton onClick={onPrevMonth} size="large">
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={onNextMonth} size="large">
          <ChevronRight />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default CalendarHeader 