import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-glow">
                <ApperIcon name="CheckSquare" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-sm text-surface-600 dark:text-surface-400 hidden sm:block">
                Your productivity companion
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            <div className="text-right hidden md:block">
              <div className="text-lg font-semibold text-surface-800 dark:text-surface-200">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-surface-600 dark:text-surface-400">
                {formatDate(currentTime)}
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="group relative overflow-hidden bg-surface-200 dark:bg-surface-700 p-3 rounded-2xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-300 shadow-soft hover:shadow-card"
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ApperIcon name="Sun" className="w-5 h-5 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ApperIcon name="Moon" className="w-5 h-5 text-indigo-600" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-black text-surface-900 dark:text-surface-100 mb-4 sm:mb-6"
            >
              Transform Your
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Workflow Today
              </span>
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the future of task management with our intuitive, powerful platform designed to boost your productivity and streamline your daily workflow.
            </motion.p>
          </div>

          {/* Feature Highlights */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
          >
            {[
              { icon: "Zap", title: "Lightning Fast", desc: "Create and manage tasks in seconds" },
              { icon: "Target", title: "Goal Focused", desc: "Priority-based task organization" },
              { icon: "Layers", title: "Multi-Project", desc: "Handle multiple projects effortlessly" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="group bg-white dark:bg-surface-800 p-6 sm:p-8 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 border border-surface-200 dark:border-surface-700 hover:border-primary/30"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ApperIcon name={feature.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-surface-600 dark:text-surface-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Feature */}
      <MainFeature />

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-surface-900 dark:text-surface-100">TaskFlow</span>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              © 2024 TaskFlow. Empowering productivity worldwide.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

export default Home