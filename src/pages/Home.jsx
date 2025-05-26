import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [farms, setFarms] = useState([
    { id: 1, name: "Green Valley Farm", location: "California", size: "150 acres", crops: 3, tasks: 5 },
    { id: 2, name: "Sunset Ranch", location: "Texas", size: "280 acres", crops: 5, tasks: 8 }
  ])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const stats = [
    { label: "Total Farms", value: farms.length, icon: "Home", color: "text-green-600" },
    { label: "Active Crops", value: farms.reduce((acc, farm) => acc + farm.crops, 0), icon: "Wheat", color: "text-orange-600" },
    { label: "Pending Tasks", value: farms.reduce((acc, farm) => acc + farm.tasks, 0), icon: "CheckSquare", color: "text-blue-600" },
    { label: "This Month Expenses", value: "$2,450", icon: "DollarSign", color: "text-purple-600" }
  ]

  const weatherData = {
    current: { temp: 75, condition: "Sunny", humidity: 65, precipitation: 0 },
    forecast: [
      { day: "Mon", temp: 78, icon: "Sun" },
      { day: "Tue", temp: 72, icon: "Cloud" },
      { day: "Wed", temp: 69, icon: "CloudRain" },
      { day: "Thu", temp: 74, icon: "Sun" }
    ]
  }

  const recentTasks = [
    { id: 1, title: "Water tomato plants", farm: "Green Valley Farm", due: "Today", priority: "high" },
    { id: 2, title: "Harvest wheat field A", farm: "Sunset Ranch", due: "Tomorrow", priority: "medium" },
    { id: 3, title: "Apply fertilizer", farm: "Green Valley Farm", due: "Oct 25", priority: "low" }
  ]

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    toast.success(`${darkMode ? 'Light' : 'Dark'} mode activated`)
  }

  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'farms', label: 'Farms', icon: 'Home' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { id: 'expenses', label: 'Expenses', icon: 'DollarSign' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-card">
                <ApperIcon name="Sprout" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">CropKeeper</h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">Farm Management Platform</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200 shadow-card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              <div className="hidden sm:flex items-center space-x-2 bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
                {tabItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-surface-700 text-green-600 dark:text-green-400 shadow-card'
                        : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                    }`}
                  >
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-around py-2">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-surface-600 dark:text-surface-400'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 sm:pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-surface-800 p-4 sm:p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`p-2 sm:p-3 rounded-xl bg-surface-50 dark:bg-surface-700 ${stat.color}`}>
                        <ApperIcon name={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Weather Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 sm:p-8 rounded-2xl shadow-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Current Weather</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl sm:text-4xl font-bold">{weatherData.current.temp}°F</div>
                      <div>
                        <p className="text-blue-100">{weatherData.current.condition}</p>
                        <p className="text-blue-200 text-sm">Humidity: {weatherData.current.humidity}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 overflow-x-auto">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex flex-col items-center min-w-[60px]">
                        <p className="text-blue-200 text-sm mb-1">{day.day}</p>
                        <ApperIcon name={day.icon} className="w-6 h-6 mb-1" />
                        <p className="font-semibold">{day.temp}°</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Farms and Tasks Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Farm Overview */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white dark:bg-surface-800 p-6 sm:p-8 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white mb-4 sm:mb-6">Your Farms</h3>
                  <div className="space-y-4">
                    {farms.map((farm) => (
                      <div key={farm.id} className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-surface-900 dark:text-white">{farm.name}</h4>
                          <span className="text-sm text-surface-600 dark:text-surface-400">{farm.size}</span>
                        </div>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">{farm.location}</p>
                        <div className="flex space-x-4">
                          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                            {farm.crops} crops
                          </span>
                          <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg">
                            {farm.tasks} tasks
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Tasks */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white dark:bg-surface-800 p-6 sm:p-8 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white mb-4 sm:mb-6">Upcoming Tasks</h3>
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-4 p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                        <div className={`w-3 h-3 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' : 
                          task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-surface-900 dark:text-white">{task.title}</h4>
                          <p className="text-sm text-surface-600 dark:text-surface-400">{task.farm}</p>
                        </div>
                        <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{task.due}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'farms' || activeTab === 'tasks' || activeTab === 'expenses') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MainFeature activeTab={activeTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Home