import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#16a34a'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  table: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0'
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: '#374151'
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  tableCellAmount: {
    flex: 1,
    fontSize: 9,
    color: '#374151',
    textAlign: 'right',
    fontWeight: 'bold'
  },
  categoryBreakdown: {
    marginTop: 10
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f8fafc',
    marginBottom: 2,
    borderRadius: 4
  },
  categoryName: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold'
  },
  categoryAmount: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold'
  },
  categoryPercentage: {
    fontSize: 9,
    color: '#64748b',
    marginLeft: 8
  },
  farmBreakdown: {
    marginTop: 10
  },
  farmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#eff6ff',
    marginBottom: 2,
    borderRadius: 4
  },
  farmName: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold'
  },
  farmAmount: {
    fontSize: 10,
    color: '#0ea5e9',
    fontWeight: 'bold'
  },
  farmPercentage: {
    fontSize: 9,
    color: '#64748b',
    marginLeft: 8
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0'
  },
  footerText: {
    fontSize: 8,
    color: '#64748b'
  },
  pageNumber: {
    fontSize: 8,
    color: '#64748b'
  },
  dateRange: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  noData: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748b',
    marginTop: 40,
    fontStyle: 'italic'
  }
})

// PDF Document Component
const ExpenseReportPDF = ({ expenses, farms, dateRange }) => {
  // Calculate summary statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalTransactions = expenses.length
  const averagePerTransaction = totalTransactions ? totalExpenses / totalTransactions : 0
  
  // Calculate category breakdown
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})
  
  // Calculate farm breakdown
  const expensesByFarm = expenses.reduce((acc, expense) => {
    const farm = farms.find(f => f.id === expense.farmId)
    const farmName = farm?.name || 'Unknown Farm'
    acc[farmName] = (acc[farmName] || 0) + expense.amount
    return acc
  }, {})
  
  const categories = Object.keys(expensesByCategory).length
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CropKeeper Expense Report</Text>
          <Text style={styles.subtitle}>Farm Management Platform</Text>
        </View>
        
        {/* Date Range */}
        <Text style={styles.dateRange}>
          Report Period: {format(parseISO(dateRange.startDate), 'MMM dd, yyyy')} - {format(parseISO(dateRange.endDate), 'MMM dd, yyyy')}
        </Text>
        
        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.row}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <Text style={styles.summaryValue}>{totalTransactions}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Average/Transaction</Text>
              <Text style={styles.summaryValue}>${averagePerTransaction.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Categories</Text>
              <Text style={styles.summaryValue}>{categories}</Text>
            </View>
          </View>
        </View>
        
        {/* Category Breakdown */}
        {Object.keys(expensesByCategory).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expenses by Category</Text>
            <View style={styles.categoryBreakdown}>
              {Object.entries(expensesByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / totalExpenses) * 100
                  return (
                    <View key={category} style={styles.categoryRow}>
                      <Text style={styles.categoryName}>{category}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
                        <Text style={styles.categoryPercentage}>({percentage.toFixed(1)}%)</Text>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        )}
        
        {/* Farm Breakdown */}
        {Object.keys(expensesByFarm).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expenses by Farm</Text>
            <View style={styles.farmBreakdown}>
              {Object.entries(expensesByFarm)
                .sort(([,a], [,b]) => b - a)
                .map(([farmName, amount]) => {
                  const percentage = (amount / totalExpenses) * 100
                  return (
                    <View key={farmName} style={styles.farmRow}>
                      <Text style={styles.farmName}>{farmName}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.farmAmount}>${amount.toFixed(2)}</Text>
                        <Text style={styles.farmPercentage}>({percentage.toFixed(1)}%)</Text>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        )}
        
        {/* Detailed Transactions */}
        {expenses.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Expense List</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCellHeader}>Date</Text>
                <Text style={styles.tableCellHeader}>Farm</Text>
                <Text style={styles.tableCellHeader}>Category</Text>
                <Text style={styles.tableCellHeader}>Description</Text>
                <Text style={styles.tableCellHeader}>Payment</Text>
                <Text style={[styles.tableCellHeader, { textAlign: 'right' }]}>Amount</Text>
              </View>
              {expenses
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((expense) => {
                  const farm = farms.find(f => f.id === expense.farmId)
                  return (
                    <View key={expense.id} style={styles.tableRow}>
                      <Text style={styles.tableCell}>
                        {format(parseISO(expense.date), 'MMM dd, yyyy')}
                      </Text>
                      <Text style={styles.tableCell}>{farm?.name || 'Unknown'}</Text>
                      <Text style={styles.tableCell}>{expense.category}</Text>
                      <Text style={styles.tableCell}>{expense.description}</Text>
                      <Text style={styles.tableCell}>{expense.paymentMethod}</Text>
                      <Text style={styles.tableCellAmount}>${expense.amount.toFixed(2)}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
        ) : (
          <Text style={styles.noData}>
            No expenses found for the selected date range.
          </Text>
        )}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated on {format(new Date(), 'MMM dd, yyyy \\at h:mm a')}
          </Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </View>
      </Page>
    </Document>
  )
}

// Export function
export const generateExpenseReportPDF = async (expenses, farms, dateRange) => {
  try {
    const doc = <ExpenseReportPDF expenses={expenses} farms={farms} dateRange={dateRange} />
    const asPdf = pdf(doc)
    const blob = await asPdf.toBlob()
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `expense-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    return { success: true }
  } catch (error) {
    console.error('PDF generation error:', error)
    return { success: false, error: error.message }
  }
}
