import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ activeTab }) => {
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

  const [formData, setFormData] = useState({})

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