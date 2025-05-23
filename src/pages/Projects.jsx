import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

export default function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    dueDate: '',
    color: '#6366f1'
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const savedProjects = localStorage.getItem('taskflow-projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      const defaultProjects = [
        {
          id: 1,
          name: 'Website Redesign',
          description: 'Complete overhaul of company website',
          status: 'active',
          dueDate: '2024-02-15',
          color: '#6366f1',
          taskCount: 12,
          completedTasks: 8,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Mobile App Development',
          description: 'Build iOS and Android mobile application',
          status: 'active',
          dueDate: '2024-03-30',
          color: '#ec4899',
          taskCount: 25,
          completedTasks: 15,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Marketing Campaign',
          description: 'Q1 marketing campaign planning and execution',
          status: 'completed',
          dueDate: '2024-01-31',
          color: '#10b981',
          taskCount: 8,
          completedTasks: 8,
          createdAt: new Date().toISOString()
        }
      ]
      setProjects(defaultProjects)
      localStorage.setItem('taskflow-projects', JSON.stringify(defaultProjects))
    }
  }

  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects)
    localStorage.setItem('taskflow-projects', JSON.stringify(updatedProjects))
  }

  const handleCreateProject = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    const newProject = {
      id: Date.now(),
      ...formData,
      taskCount: 0,
      completedTasks: 0,
      createdAt: new Date().toISOString()
    }

    const updatedProjects = [...projects, newProject]
    saveProjects(updatedProjects)
    setShowCreateModal(false)
    resetForm()
    toast.success('Project created successfully!')
  }

  const handleEditProject = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    const updatedProjects = projects.map(project =>
      project.id === editingProject.id
        ? { ...project, ...formData }
        : project
    )

    saveProjects(updatedProjects)
    setShowEditModal(false)
    setEditingProject(null)
    resetForm()
    toast.success('Project updated successfully!')
  }

  const handleDeleteProject = () => {
    const updatedProjects = projects.filter(project => project.id !== projectToDelete.id)
    saveProjects(updatedProjects)
    setShowDeleteConfirm(false)
    setProjectToDelete(null)
    toast.success('Project deleted successfully!')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
      dueDate: '',
      color: '#6366f1'
    })
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      dueDate: project.dueDate,
      color: project.color
    })
    setShowEditModal(true)
  }

  const openDeleteConfirm = (project) => {
    setProjectToDelete(project)
    setShowDeleteConfirm(true)
  }

  const getProgress = (project) => {
    if (project.taskCount === 0) return 0
    return Math.round((project.completedTasks / project.taskCount) * 100)
  }

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'progress':
          return getProgress(b) - getProgress(a)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-surface-900 dark:text-surface-100">TaskFlow</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-surface-600 dark:text-surface-400 hover:text-primary transition-colors px-3 py-2 rounded-lg"
                >
                  Tasks
                </button>
                <button className="text-primary font-medium px-3 py-2 rounded-lg bg-primary/10">
                  Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">Projects</h1>
          <p className="text-surface-600 dark:text-surface-400">Organize and manage your project workflows</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-neu p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Projects</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{projects.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <ApperIcon name="FolderOpen" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="card-neu p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Active Projects</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <ApperIcon name="Play" className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="card-neu p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Completed</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="card-neu p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">On Hold</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {projects.filter(p => p.status === 'on-hold').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <ApperIcon name="Pause" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card-neu p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100"
              >
                <option value="name">Sort by Name</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="progress">Sort by Progress</option>
              </select>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card-neu p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-surface-600 dark:text-surface-400">Progress</span>
                  <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                    {getProgress(project)}%
                  </span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${getProgress(project)}%`,
                      backgroundColor: project.color
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
                  <span>{project.completedTasks}/{project.taskCount} tasks</span>
                  <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : project.status === 'completed'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {project.status === 'on-hold' ? 'On Hold' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(project)}
                  className="flex-1 px-3 py-2 text-sm bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => openDeleteConfirm(project)}
                  className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="FolderX" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">No projects found</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first project to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field h-20 resize-none"
                  placeholder="Describe your project"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-lg border border-surface-300 dark:border-surface-600"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">Edit Project</h2>
            <form onSubmit={handleEditProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field h-20 resize-none"
                  placeholder="Describe your project"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-lg border border-surface-300 dark:border-surface-600"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingProject(null)
                    resetForm()
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">Delete Project</h2>
            </div>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setProjectToDelete(null)
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}