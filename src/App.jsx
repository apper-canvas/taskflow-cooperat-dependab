import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TaskDashboard from './pages/TaskDashboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Routes>
        <Route path="/" element={<TaskDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="!mb-4 !mr-4"
        toastClassName="!rounded-xl !shadow-lg !text-sm"
      />
    </div>
  )
}

export default App