import { useState } from 'react'
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
} from '@mui/material'
import EventSettings from './EventSettings'
import AccessSettings from './AccessSettings'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  }
}

const Admin = () => {
  const [value, setValue] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        管理画面
      </Typography>
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="予定設定" {...a11yProps(0)} />
            <Tab label="アクセス設定" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <EventSettings />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AccessSettings />
        </TabPanel>
      </Paper>
    </Box>
  )
}

export default Admin 