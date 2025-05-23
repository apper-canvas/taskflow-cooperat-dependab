import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isYesterday } from 'date-fns'
import ApperIcon from '../components/ApperIcon'

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: '',
    tags: ''
  })
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error("Task title is required!")
      return
    }

    const task = {
      id: editingTask ? editingTask.id : generateId(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      status: editingTask ? editingTask.status : 'todo',
      dueDate: newTask.dueDate,
      category: newTask.category.trim(),
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? task : t))
      toast.success("Task updated successfully!")
      setEditingTask(null)
    } else {
      setTasks(prev => [...prev, task])
      toast.success("Task created successfully!")
    }

    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: '', tags: '' })
    setShowForm(false)
  }

  const handleEdit = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category,
      tags: task.tags.join(', ')
    })
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id))
      toast.success("Task deleted successfully!")
    }
  }

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed'
        toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened!')
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMM dd, yyyy')
  }

  const getDueDateColor = (dateString) => {
    if (!dateString) return 'text-surface-500'
    const date = new Date(dateString)
    const today = new Date()
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-red-500'
    if (diffDays === 0) return 'text-orange-500'
    if (diffDays === 1) return 'text-yellow-500'
    return 'text-green-500'
  }

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.status === 'completed'
      if (filter === 'pending') return task.status !== 'completed'
      if (filter === 'high') return task.priority === 'high'
      if (filter === 'overdue') {
        const dueDate = new Date(task.dueDate)
        return task.dueDate && dueDate < new Date() && task.status !== 'completed'
      }
      return true
    })
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle'
      case 'medium': return 'Circle'
      case 'low': return 'Minus'
      default: return 'Circle'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      default: return 'text-surface-500 bg-surface-50 dark:bg-surface-800'
    }
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status !== 'completed').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <div className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">
                TaskFlow
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: taskStats.total, icon: 'List', color: 'from-blue-500 to-blue-600' },
            { label: 'Completed', value: taskStats.completed, icon: 'CheckCircle2', color: 'from-green-500 to-green-600' },
            { label: 'Pending', value: taskStats.pending, icon: 'Clock', color: 'from-yellow-500 to-yellow-600' },
            { label: 'Overdue', value: taskStats.overdue, icon: 'AlertTriangle', color: 'from-red-500 to-red-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-surface-800 p-4 rounded-xl border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Info" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Filter & Sort Options</h3>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Use the filters below to view specific task categories (All, Pending, Completed, High Priority, Overdue) and sort them by due date, priority level, or creation date. The search bar allows you to find tasks by title, description, category, or tags.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-surface-800 p-4 rounded-xl border border-surface-200 dark:border-surface-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters & Sort */}
            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="high">High Priority</option>
                <option value="overdue">Overdue</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="created">Created</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowForm(false)
                setEditingTask(null)
                setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: '', tags: '' })
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-surface-800 p-6 rounded-xl border border-surface-200 dark:border-surface-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingTask(null)
                      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: '', tags: '' })
                    }}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="Enter task title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                      rows="3"
                      placeholder="Add task description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="Work, Personal, Project..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newTask.tags}
                      onChange={(e) => setNewTask(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="urgent, meeting, review..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ApperIcon name={editingTask ? "Save" : "Plus"} className="w-4 h-4" />
                      <span>{editingTask ? 'Update Task' : 'Create Task'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingTask(null)
                        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: '', tags: '' })
                      }}
                      className="flex-1 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-900 dark:text-surface-100 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAndSortedTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="ListTodo" className="w-8 h-8 text-surface-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {searchQuery || filter !== 'all' ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6">
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Create your first task to get started'
                  }
                </p>
                {!searchQuery && filter === 'all' && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Create First Task</span>
                  </button>
                )}
              </motion.div>
            ) : (
              filteredAndSortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white dark:bg-surface-800 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    task.status === 'completed' 
                      ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
                      : 'border-surface-200 dark:border-surface-700 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleStatus(task.id)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                        task.status === 'completed'
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                      }`}
                    >
                      {task.status === 'completed' && (
                        <ApperIcon name="Check" className="w-3 h-3" />
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className={`text-lg font-semibold ${
                          task.status === 'completed' 
                            ? 'text-surface-500 dark:text-surface-400 line-through' 
                            : 'text-surface-900 dark:text-surface-100'
                        }`}>
                          {task.title}
                        </h4>
                        
                        {/* Priority Badge */}
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)} flex-shrink-0`}>
                          <ApperIcon name={getPriorityIcon(task.priority)} className="w-3 h-3 mr-1" />
                          {task.priority}
                        </div>
                      </div>

                      {task.description && (
                        <p className={`text-sm mb-3 ${
                          task.status === 'completed' 
                            ? 'text-surface-400 dark:text-surface-500' 
                            : 'text-surface-600 dark:text-surface-400'
                        }`}>
                          {task.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-surface-500 dark:text-surface-400 mb-3">
                        {task.dueDate && (
                          <div className={`flex items-center space-x-1 ${getDueDateColor(task.dueDate)}`}>
                            <ApperIcon name="Calendar" className="w-3 h-3" />
                            <span>{formatDueDate(task.dueDate)}</span>
                          </div>
                        )}
                        {task.category && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Folder" className="w-3 h-3" />
                            <span>{task.category}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Clock" className="w-3 h-3" />
                          <span>Created {format(new Date(task.createdAt), 'MMM dd')}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4 text-surface-500 hover:text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4 text-surface-500 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default TaskDashboard