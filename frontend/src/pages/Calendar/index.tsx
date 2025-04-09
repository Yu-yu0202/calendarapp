import { useState } from 'react'
import { Box, Paper, Grid } from '@mui/material'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import dayjs from 'dayjs'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs())

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  const handleToday = () => {
    setCurrentDate(dayjs())
  }

  return (
    <Box>
      <Paper elevation={3}>
        <Grid container direction="column">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <CalendarGrid currentDate={currentDate} />
        </Grid>
      </Paper>
    </Box>
  )
}

export default Calendar 