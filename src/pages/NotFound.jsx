import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8"
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl sm:text-8xl font-black text-surface-900 dark:text-surface-100 mb-4"
        >
          404
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl sm:text-2xl font-bold text-surface-800 dark:text-surface-200 mb-4"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-surface-600 dark:text-surface-400 mb-8 text-sm sm:text-base"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-soft hover:shadow-glow transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound