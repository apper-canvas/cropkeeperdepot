import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { isWithinInterval, addDays, parseISO } from 'date-fns'

const NotificationCenter = () => {
  const [tasks, setTasks] = useState([])
  const [farms, setFarms] = useState([])

  useEffect(() => {
    // Listen for task updates from other components
    const handleTaskUpdate = (event) => {
      const { task, action } = event.detail
      
      if (action === 'created' || action === 'updated') {
        setTasks(prev => {
          const existing = prev.find(t => t.id === task.id)
          if (existing) {
            return prev.map(t => t.id === task.id ? task : t)
          } else {
            return [...prev, task]
          }
        })
      } else if (action === 'completed') {
        // Remove notifications for completed tasks
        setTasks(prev => prev.filter(t => t.id !== task.id))
      }
    }

    window.addEventListener('taskUpdated', handleTaskUpdate)
    return () => window.removeEventListener('taskUpdated', handleTaskUpdate)
  }, [])

  useEffect(() => {
    // Check for upcoming tasks and create notifications
    const checkNotifications = () => {
      const now = new Date()
      const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}') 
      
      if (!settings.enableBrowser) return

      tasks.forEach(task => {
        if (task.completed) return

        const taskDate = parseISO(task.scheduledDate)
        const reminderDays = task.priority === 'high' ? (settings.criticalReminderDays || 3) : (settings.reminderDays || 1)
        const reminderDate = addDays(now, reminderDays)

        // Check if task should trigger notification
        if (isWithinInterval(taskDate, { start: now, end: reminderDate })) {
          if ('Notification' in window && Notification.permission === 'granted') {
            const daysUntil = Math.ceil((taskDate - now) / (1000 * 60 * 60 * 24))
            
            new Notification(`Upcoming Task: ${task.title}`, {
              body: `${task.taskType} - Due in ${daysUntil} day(s)`,
              icon: '/favicon.ico',
              tag: `task-${task.id}`
            })
          }
        }
      })
    }

    const interval = setInterval(checkNotifications, 300000) // Check every 5 minutes
    return () => clearInterval(interval)
  }, [tasks])

  return null // This component doesn't render anything
}

export default NotificationCenter