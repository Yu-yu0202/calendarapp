import { Grid, Paper, Typography } from '@mui/material'
import { Dayjs } from 'dayjs'
import { styled } from '@mui/material/styles'

interface CalendarGridProps {
  currentDate: Dayjs
}

const DayCell = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '100px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))

const weekDays = ['日', '月', '火', '水', '木', '金', '土']

const CalendarGrid = ({ currentDate }: CalendarGridProps) => {
  const startOfMonth = currentDate.startOf('month')
  const endOfMonth = currentDate.endOf('month')
  const startDate = startOfMonth.startOf('week')
  const endDate = endOfMonth.endOf('week')

  const days: Dayjs[] = []
  let day = startDate
  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    days.push(day)
    day = day.add(1, 'day')
  }

  return (
    <Grid container spacing={1} sx={{ p: 2 }}>
      {weekDays.map((weekDay) => (
        <Grid key={weekDay} item xs={12 / 7}>
          <Typography align="center" sx={{ fontWeight: 'bold' }}>
            {weekDay}
          </Typography>
        </Grid>
      ))}
      {days.map((date) => (
        <Grid key={date.format('YYYY-MM-DD')} item xs={12 / 7}>
          <DayCell elevation={1}>
            <Typography
              sx={{
                color:
                  date.month() !== currentDate.month()
                    ? 'text.disabled'
                    : 'text.primary',
              }}
            >
              {date.format('D')}
            </Typography>
          </DayCell>
        </Grid>
      ))}
    </Grid>
  )
}

export default CalendarGrid 