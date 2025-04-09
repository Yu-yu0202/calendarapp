import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface Event {
  id: string
  title: string
  date: string
  description: string
}

const EventSettings = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [open, setOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
  })

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingEvent(null)
    setFormData({ title: '', date: '', description: '' })
  }

  const handleSubmit = () => {
    if (editingEvent) {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id
            ? { ...event, ...formData }
            : event
        )
      )
    } else {
      setEvents([
        ...events,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
        },
      ])
    }
    handleClose()
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
    })
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        予定を追加
      </Button>

      <List>
        {events.map((event) => (
          <ListItem key={event.id}>
            <ListItemText
              primary={event.title}
              secondary={`${event.date} - ${event.description}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(event)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(event.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingEvent ? '予定を編集' : '予定を追加'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="タイトル"
            type="text"
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="日付"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="説明"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEvent ? '更新' : '追加'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EventSettings 