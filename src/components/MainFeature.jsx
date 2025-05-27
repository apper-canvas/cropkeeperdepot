import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import ApperIcon from './ApperIcon'



const MainFeature = ({ activeTab }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  const [farms, setFarms] = useState([
    { id: 1, name: "Green Valley Farm", location: "California", size: "150 acres", soilType: "Loamy", createdDate: "2023-01-15" },
    { id: 2, name: "Sunset Ranch", location: "Texas", size: "280 acres", soilType: "Clay", createdDate: "2023-03-20" }
  ])

  const [crops, setCrops] = useState([
    { id: 1, farmId: 1, cropType: "Tomatoes", variety: "Cherry", plantingDate: "2024-03-15", expectedHarvestDate: "2024-06-15", area: "2 acres", status: "Growing" },
    { id: 2, farmId: 1, cropType: "Corn", variety: "Sweet", plantingDate: "2024-04-01", expectedHarvestDate: "2024-07-15", area: "5 acres", status: "Growing" },
    { id: 3, farmId: 2, cropType: "Wheat", variety: "Winter", plantingDate: "2024-02-20", expectedHarvestDate: "2024-08-01", area: "20 acres", status: "Mature" }
  ])

  const [tasks, setTasks] = useState([
    { id: 1, farmId: 1, title: "Water tomato plants", description: "Regular watering for greenhouse tomatoes", taskType: "Watering", scheduledDate: "2024-10-25", completed: false, priority: "high" },
    { id: 2, farmId: 2, title: "Harvest wheat field A", description: "First harvest of winter wheat", taskType: "Harvesting", scheduledDate: "2024-10-26", completed: false, priority: "medium" },
    { id: 3, farmId: 1, title: "Apply fertilizer", description: "Nitrogen fertilizer for corn field", taskType: "Fertilizing", scheduledDate: "2024-10-28", completed: true, priority: "low" }
  ])

  const [expenses, setExpenses] = useState([
    { id: 1, farmId: 1, amount: 450.00, category: "Seeds", description: "Tomato and corn seeds", date: "2024-03-10", paymentMethod: "Credit Card" },
    { id: 2, farmId: 2, amount: 1200.00, category: "Equipment", description: "New irrigation system", date: "2024-03-15", paymentMethod: "Bank Transfer" },
    { id: 3, farmId: 1, amount: 300.00, category: "Fertilizer", description: "Organic fertilizer", date: "2024-04-05", paymentMethod: "Cash" }
  ])

  // Reports state
  const [reportDateRange, setReportDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  })
  const [reportView, setReportView] = useState('overview')



  // Form configurations for different tabs
  const getFormConfig = () => {
    switch (activeTab) {
      case 'farms':
        return {
          title: editingItem ? 'Edit Farm' : 'Add New Farm',
          fields: [
            { name: 'name', label: 'Farm Name', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'size', label: 'Size', type: 'text', placeholder: 'e.g., 150 acres', required: true },
            { name: 'soilType', label: 'Soil Type', type: 'select', options: ['Loamy', 'Clay', 'Sandy', 'Silty'], required: true }
          ]
        }
      case 'crops':
        return {
          title: editingItem ? 'Edit Crop' : 'Add New Crop',
          fields: [
            { name: 'farmId', label: 'Farm', type: 'select', options: farms.map(f => ({ value: f.id, label: f.name })), required: true },
            { name: 'cropType', label: 'Crop Type', type: 'text', required: true },
            { name: 'variety', label: 'Variety', type: 'text', required: true },
            { name: 'plantingDate', label: 'Planting Date', type: 'date', required: true },
            { name: 'expectedHarvestDate', label: 'Expected Harvest Date', type: 'date', required: true },
            { name: 'area', label: 'Area', type: 'text', placeholder: 'e.g., 2 acres', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Growing', 'Mature', 'Harvested', 'Planted'], required: true }
          ]
        }
      case 'tasks':
        return {
          title: editingItem ? 'Edit Task' : 'Add New Task',
          fields: [
            { name: 'farmId', label: 'Farm', type: 'select', options: farms.map(f => ({ value: f.id, label: f.name })), required: true },
            { name: 'title', label: 'Task Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'taskType', label: 'Task Type', type: 'select', options: ['Watering', 'Harvesting', 'Fertilizing', 'Planting', 'Weeding'], required: true },
            { name: 'scheduledDate', label: 'Scheduled Date', type: 'date', required: true },
            { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high'], required: true }
          ]
        }
      case 'expenses':
        return {
          title: editingItem ? 'Edit Expense' : 'Add New Expense',
          fields: [
            { name: 'farmId', label: 'Farm', type: 'select', options: farms.map(f => ({ value: f.id, label: f.name })), required: true },
            { name: 'amount', label: 'Amount', type: 'number', step: '0.01', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Seeds', 'Equipment', 'Fertilizer', 'Labor', 'Fuel', 'Maintenance'], required: true },
            { name: 'description', label: 'Description', type: 'text', required: true },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Cash', 'Credit Card', 'Bank Transfer', 'Check'], required: true }
          ]
        }
      default:
        return { title: '', fields: [] }

    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({})
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({ ...item })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    switch (activeTab) {
      case 'farms':
        setFarms(farms.filter(f => f.id !== id))
        toast.success('Farm deleted successfully')
        break
      case 'crops':
        setCrops(crops.filter(c => c.id !== id))
        toast.success('Crop deleted successfully')
        break
      case 'tasks':
        setTasks(tasks.filter(t => t.id !== id))
        toast.success('Task deleted successfully')
        break
      case 'expenses':
        setExpenses(expenses.filter(e => e.id !== id))
        toast.success('Expense deleted successfully')
        break
    }
  }

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
    const task = tasks.find(t => t.id === id)
    toast.success(`Task ${task?.completed ? 'marked as pending' : 'completed'}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const config = getFormConfig()
    
    // Validate required fields
    const missingFields = config.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label)
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`)
      return
    }

    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now(),
      ...(activeTab === 'farms' && !editingItem && { createdDate: format(new Date(), 'yyyy-MM-dd') }),
      ...(activeTab === 'crops' && { farmId: parseInt(formData.farmId) }),
      ...(activeTab === 'tasks' && { farmId: parseInt(formData.farmId) }),
      ...(activeTab === 'expenses' && { farmId: parseInt(formData.farmId), amount: parseFloat(formData.amount) })
    }

    switch (activeTab) {
      case 'farms':
        if (editingItem) {
          setFarms(farms.map(f => f.id === editingItem.id ? newItem : f))
          toast.success('Farm updated successfully')
        } else {
          setFarms([...farms, newItem])
          toast.success('Farm added successfully')
        }
        break
      case 'crops':
        if (editingItem) {
          setCrops(crops.map(c => c.id === editingItem.id ? newItem : c))
          toast.success('Crop updated successfully')
        } else {
          setCrops([...crops, newItem])
          toast.success('Crop added successfully')
        }
        break
      case 'tasks':
        if (editingItem) {
          setTasks(tasks.map(t => t.id === editingItem.id ? newItem : t))
          toast.success('Task updated successfully')
        } else {
          setTasks([...tasks, { ...newItem, completed: false }])
          toast.success('Task added successfully')
        }
        break
      case 'expenses':
        if (editingItem) {
          setExpenses(expenses.map(e => e.id === editingItem.id ? newItem : e))
          toast.success('Expense updated successfully')
        } else {
          setExpenses([...expenses, newItem])
          toast.success('Expense added successfully')
        }
        break
    }

    setShowForm(false)
    setFormData({})
    setEditingItem(null)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'farms':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {farms.map((farm, index) => (
              <motion.div
                key={farm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{farm.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                        <ApperIcon name="MapPin" className="w-4 h-4" />
                        <span>{farm.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                        <ApperIcon name="Maximize" className="w-4 h-4" />
                        <span>{farm.size}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                        <ApperIcon name="Layers" className="w-4 h-4" />
                        <span>{farm.soilType} soil</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(farm)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(farm.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                  <p className="text-xs text-surface-500 dark:text-surface-500">
                    Created: {format(parseISO(farm.createdDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 'crops':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {crops.map((crop, index) => {
              const farm = farms.find(f => f.id === crop.farmId)
              
              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{crop.cropType}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                          <ApperIcon name="Leaf" className="w-4 h-4" />
                          <span>{crop.variety} variety</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                          <ApperIcon name="Home" className="w-4 h-4" />
                          <span>{farm?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                          <ApperIcon name="Maximize" className="w-4 h-4" />
                          <span>{crop.area}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ApperIcon name="CircleDot" className="w-4 h-4" />
                          <span className={`px-2 py-1 text-xs rounded-lg ${
                            crop.status === 'Growing' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                            crop.status === 'Mature' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                            crop.status === 'Harvested' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                            'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
                          }`}>{crop.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(crop)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(crop.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700 space-y-2">
                    <div className="flex justify-between text-xs text-surface-500 dark:text-surface-500">
                      <span>Planted: {format(parseISO(crop.plantingDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-surface-500 dark:text-surface-500">
                      <span>Expected Harvest: {format(parseISO(crop.expectedHarvestDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )

      case 'tasks':
        return (
          <div className="space-y-4">
            {tasks.map((task, index) => {
              const farm = farms.find(f => f.id === task.farmId)
              const isOverdue = new Date(task.scheduledDate) < new Date() && !task.completed
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white dark:bg-surface-800 p-4 sm:p-6 rounded-2xl shadow-card border transition-all duration-200 ${
                    task.completed 
                      ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
                      : isOverdue 
                      ? 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10'
                      : 'border-surface-200 dark:border-surface-700 hover:shadow-soft'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start space-x-4 flex-1">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-surface-300 dark:border-surface-600 hover:border-green-500'
                        }`}
                      >
                        {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
                          <h3 className={`text-lg font-semibold ${
                            task.completed 
                              ? 'text-surface-500 dark:text-surface-500 line-through' 
                              : 'text-surface-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                            <span className={`text-xs px-2 py-1 rounded-lg ${
                              task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                              task.priority === 'medium' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                              'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            }`}>
                              {task.priority} priority
                            </span>
                            <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg">
                              {task.taskType}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-surface-600 dark:text-surface-400 mb-2">{task.description}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-surface-500 dark:text-surface-500">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Home" className="w-4 h-4" />
                            <span>{farm?.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" className="w-4 h-4" />
                            <span className={isOverdue && !task.completed ? 'text-red-600 font-medium' : ''}>
                              {format(parseISO(task.scheduledDate), 'MMM dd, yyyy')}
                              {isOverdue && !task.completed && ' (Overdue)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )

      case 'expenses':
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
        const expensesByCategory = expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount
          return acc
        }, {})

        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-card">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="DollarSign" className="w-8 h-8" />
                  <div>
                    <p className="text-green-100 text-sm">Total Expenses</p>
                    <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {Object.entries(expensesByCategory).slice(0, 3).map(([category, amount]) => (
                <div key={category} className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-surface-100 dark:bg-surface-700 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Tag" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                    </div>
                    <div>
                      <p className="text-surface-600 dark:text-surface-400 text-sm">{category}</p>
                      <p className="text-xl font-bold text-surface-900 dark:text-white">${amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expenses List */}
            <div className="space-y-4">
              {expenses.map((expense, index) => {
                const farm = farms.find(f => f.id === expense.farmId)
                
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white dark:bg-surface-800 p-4 sm:p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{expense.description}</h3>
                          <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg">
                              {expense.category}
                            </span>
                            <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg">
                              {expense.paymentMethod}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-surface-500 dark:text-surface-500">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Home" className="w-4 h-4" />
                            <span>{farm?.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" className="w-4 h-4" />
                            <span>{format(parseISO(expense.date), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-surface-900 dark:text-white">${expense.amount.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )



      case 'reports':
        
        const filteredExpenses = expenses.filter(expense => {
          const expenseDate = parseISO(expense.date)
          const start = parseISO(reportDateRange.startDate)
          const end = parseISO(reportDateRange.endDate)
          return isWithinInterval(expenseDate, { start, end })
        })

        
        
        const reportTotalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        const reportExpensesByCategory = filteredExpenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount
          return acc
        }, {})
        
        const reportExpensesByFarm = filteredExpenses.reduce((acc, expense) => {
          const farm = farms.find(f => f.id === expense.farmId)
          const farmName = farm?.name || 'Unknown Farm'
          acc[farmName] = (acc[farmName] || 0) + expense.amount
          return acc
        }, {})
        
        const monthlyExpenses = filteredExpenses.reduce((acc, expense) => {
          const month = format(parseISO(expense.date), 'MMM yyyy')
          acc[month] = (acc[month] || 0) + expense.amount
          return acc
        }, {})
        
        const chartData = Object.entries(reportExpensesByCategory).map(([category, amount]) => ({
          category,
          amount: Number(amount.toFixed(2))
        }))
        
        const pieData = Object.entries(reportExpensesByCategory).map(([category, amount]) => ({
          name: category,
          value: Number(amount.toFixed(2))
        }))
        
        const monthlyChartData = Object.entries(monthlyExpenses).map(([month, amount]) => ({
          month,
          amount: Number(amount.toFixed(2))
        }))
        
        const COLORS = ['#16a34a', '#ea580c', '#0ea5e9', '#dc2626', '#7c3aed', '#059669']
        
        const handleDateRangeChange = (field, value) => {
          setReportDateRange(prev => ({ ...prev, [field]: value }))
        }
        
        const exportToPDF = async () => {
          toast.info('PDF export feature will be available soon')
        }


        
        const exportToCSV = () => {
          const csvData = filteredExpenses.map(expense => {
            const farm = farms.find(f => f.id === expense.farmId)
            return {
              Date: expense.date,
              Farm: farm?.name || 'Unknown',
              Category: expense.category,
              Description: expense.description,
              Amount: expense.amount,
              PaymentMethod: expense.paymentMethod
            }
          })
          
          const csvContent = [
            Object.keys(csvData[0] || {}).join(','),
            ...csvData.map(row => Object.values(row).join(','))
          ].join('\n')
          
          const blob = new Blob([csvContent], { type: 'text/csv' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `expense-report-${reportDateRange.startDate}-to-${reportDateRange.endDate}.csv`
          a.click()
          window.URL.revokeObjectURL(url)
          toast.success('CSV exported successfully')
        }
        
        return (
          <div className="space-y-6">
            {/* Report Controls */}
            <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Report Settings</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-surface-700 dark:text-surface-300">From:</label>
                      <input
                        type="date"
                        value={reportDateRange.startDate}
                        onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                        className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:border-green-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-surface-700 dark:text-surface-300">To:</label>
                      <input
                        type="date"
                        value={reportDateRange.endDate}
                        onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                        className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:border-green-500 focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
                    {['overview', 'charts', 'detailed'].map((view) => (
                      <button
                        key={view}
                        onClick={() => setReportView(view)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          reportView === view
                            ? 'bg-white dark:bg-surface-600 text-green-600 dark:text-green-400 shadow-card'
                            : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                        }`}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={exportToCSV}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ApperIcon name="FileText" className="w-4 h-4" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <ApperIcon name="FileText" className="w-4 h-4" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Report Content */}
            {reportView === 'overview' && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-card">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="DollarSign" className="w-8 h-8" />
                      <div>
                        <p className="text-green-100 text-sm">Total Amount</p>
                        <p className="text-2xl font-bold">${reportTotalExpenses.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                        <ApperIcon name="Receipt" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-surface-600 dark:text-surface-400 text-sm">Total Transactions</p>
                        <p className="text-xl font-bold text-surface-900 dark:text-white">{filteredExpenses.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                        <ApperIcon name="TrendingUp" className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-surface-600 dark:text-surface-400 text-sm">Average per Transaction</p>
                        <p className="text-xl font-bold text-surface-900 dark:text-white">
                          ${filteredExpenses.length ? (reportTotalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                        <ApperIcon name="Tag" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-surface-600 dark:text-surface-400 text-sm">Categories</p>
                        <p className="text-xl font-bold text-surface-900 dark:text-white">{Object.keys(reportExpensesByCategory).length}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Expenses by Category</h3>
                    <div className="space-y-3">
                      {Object.entries(reportExpensesByCategory).map(([category, amount]) => {
                        const percentage = (amount / reportTotalExpenses) * 100
                        return (
                          <div key={category} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-surface-700 dark:text-surface-300">{category}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-surface-900 dark:text-white">${amount.toFixed(2)}</p>
                              <p className="text-sm text-surface-500">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Expenses by Farm</h3>
                    <div className="space-y-3">
                      {Object.entries(reportExpensesByFarm).map(([farmName, amount]) => {
                        const percentage = (amount / reportTotalExpenses) * 100
                        return (
                          <div key={farmName} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-surface-700 dark:text-surface-300">{farmName}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-surface-900 dark:text-white">${amount.toFixed(2)}</p>
                              <p className="text-sm text-surface-500">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {reportView === 'charts' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Expenses by Category</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="category" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            formatter={(value) => [`$${value}`, 'Amount']}
                            labelStyle={{ color: '#1e293b' }}
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                          />
                          <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Pie Chart */}
                  <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Category Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Monthly Trend */}
                <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Monthly Expense Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Amount']}
                          labelStyle={{ color: '#1e293b' }}
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        />
                        <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            
            {reportView === 'detailed' && (
              <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
                <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Detailed Expense List</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-50 dark:bg-surface-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Farm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Payment Method</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                      {filteredExpenses.map((expense) => {
                        const farm = farms.find(f => f.id === expense.farmId)
                        return (
                          <tr key={expense.id} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                              {format(parseISO(expense.date), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                              {farm?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
                                {expense.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-surface-900 dark:text-white">
                              {expense.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200 rounded-lg">
                                {expense.paymentMethod}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-surface-900 dark:text-white text-right">
                              ${expense.amount.toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                {filteredExpenses.length === 0 && (
                  <div className="text-center py-12">
                    <ApperIcon name="Receipt" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                    <p className="text-surface-500 dark:text-surface-400">No expenses found for the selected date range.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )

        break



      default:
        return null
    }
  }

  const config = getFormConfig()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            {activeTab === 'farms' && 'Manage your farm properties and locations'}
            {activeTab === 'crops' && 'Track your crop planting, growth, and harvest cycles'}
            {activeTab === 'tasks' && 'Track and schedule your farming activities'}
            {activeTab === 'expenses' && 'Monitor your farm-related expenses and budget'}
          </p>
        </div>
        
        <motion.button
          onClick={handleAdd}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-card hover:shadow-soft"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add {activeTab.slice(0, -1)}</span>
        </motion.button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {renderContent()}
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">{config.title}</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:border-green-500 focus:ring-0 transition-colors"
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {(Array.isArray(field.options) ? field.options : []).map((option) => (
                          <option 
                            key={typeof option === 'object' ? option.value : option} 
                            value={typeof option === 'object' ? option.value : option}
                          >
                            {typeof option === 'object' ? option.label : option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:border-green-500 focus:ring-0 transition-colors resize-none"
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        step={field.step}
                        className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:border-green-500 focus:ring-0 transition-colors"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-card"
                  >
                    {editingItem ? 'Update' : 'Add'} {activeTab.slice(0, -1)}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature