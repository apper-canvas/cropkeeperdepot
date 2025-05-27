import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#16a34a'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10
  },
  reportInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  infoItem: {
    flexDirection: 'column'
  },
  infoLabel: {
    fontSize: 10,
    color: '#666666',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  infoValue: {
    fontSize: 12,
    color: '#000000',
    marginTop: 2
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 10,
    marginBottom: 10,
    marginRight: '2%',
    borderRadius: 4
  },
  summaryCardFull: {
    width: '100%',
    backgroundColor: '#f0fdf4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#16a34a'
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a'
  },
  summaryValueLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a'
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    padding: 8
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8
  },
  tableColWide: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase'
  },
  tableCell: {
    fontSize: 10,
    color: '#000000'
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  categoryName: {
    fontSize: 12,
    color: '#374151'
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16a34a'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    right: 30,
    color: '#666666'
  }
})

// PDF Document Component
const ExpenseReportPDF = ({ expenses, farms, dateRange, reportData }) => {
  const {
    totalExpenses,
    expensesByCategory,
    expensesByFarm,
    transactionCount,
    averageTransaction,
    categoryCount
  } = reportData

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CropKeeper Expense Report</Text>
          <Text style={styles.subtitle}>Farm Management Platform</Text>
        </View>

        {/* Report Information */}
        <View style={styles.reportInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Report Period</Text>
            <Text style={styles.infoValue}>
              {format(parseISO(dateRange.startDate), 'MMM dd, yyyy')} - {format(parseISO(dateRange.endDate), 'MMM dd, yyyy')}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Generated On</Text>
            <Text style={styles.infoValue}>{format(new Date(), 'MMM dd, yyyy')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Transactions</Text>
            <Text style={styles.infoValue}>{transactionCount}</Text>
          </View>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCardFull}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValueLarge}>${totalExpenses.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Transactions</Text>
              <Text style={styles.summaryValue}>{transactionCount}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Average Transaction</Text>
              <Text style={styles.summaryValue}>${averageTransaction.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Active Categories</Text>
              <Text style={styles.summaryValue}>{categoryCount}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Active Farms</Text>
              <Text style={styles.summaryValue}>{Object.keys(expensesByFarm).length}</Text>
            </View>
          </View>
        </View>

        {/* Expenses by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses by Category</Text>
          {Object.entries(expensesByCategory).map(([category, amount]) => {
            const percentage = (amount / totalExpenses) * 100
            return (
              <View key={category} style={styles.categoryRow}>
                <Text style={styles.categoryName}>{category}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
                  <Text style={[styles.categoryName, { marginLeft: 10 }]}>({percentage.toFixed(1)}%)</Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Expenses by Farm */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses by Farm</Text>
          {Object.entries(expensesByFarm).map(([farmName, amount]) => {
            const percentage = (amount / totalExpenses) * 100
            return (
              <View key={farmName} style={styles.categoryRow}>
                <Text style={styles.categoryName}>{farmName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
                  <Text style={[styles.categoryName, { marginLeft: 10 }]}>({percentage.toFixed(1)}%)</Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          CropKeeper Farm Management Platform | Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}
        </Text>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* Detailed Expense List - New Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Detailed Expense List</Text>
          <Text style={styles.subtitle}>
            {format(parseISO(dateRange.startDate), 'MMM dd, yyyy')} - {format(parseISO(dateRange.endDate), 'MMM dd, yyyy')}
          </Text>
        </View>

        {/* Expense Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Farm</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Category</Text>
            </View>
            <View style={styles.tableColWide}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Payment</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Amount</Text>
            </View>
          </View>

          {/* Table Rows */}
          {expenses.map((expense) => {
            const farm = farms.find(f => f.id === expense.farmId)
            return (
              <View key={expense.id} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {format(parseISO(expense.date), 'MM/dd/yyyy')}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{farm?.name || 'Unknown'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{expense.category}</Text>
                </View>
                <View style={styles.tableColWide}>
                  <Text style={styles.tableCell}>{expense.description}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{expense.paymentMethod}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>
                    ${expense.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Summary at bottom of table */}
        <View style={{ marginTop: 20, borderTopWidth: 2, borderTopColor: '#16a34a', paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Total Expenses:</Text>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>${totalExpenses.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          CropKeeper Farm Management Platform | Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}
        </Text>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>
    </Document>
  )
}

// Function to generate and download PDF
export const generateExpenseReportPDF = async (expenses, farms, dateRange) => {
  try {
    // Calculate report data
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const transactionCount = expenses.length
    const averageTransaction = transactionCount > 0 ? totalExpenses / transactionCount : 0
    
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})
    
    const expensesByFarm = expenses.reduce((acc, expense) => {
      const farm = farms.find(f => f.id === expense.farmId)
      const farmName = farm?.name || 'Unknown Farm'
      acc[farmName] = (acc[farmName] || 0) + expense.amount
      return acc
    }, {})
    
    const categoryCount = Object.keys(expensesByCategory).length
    
    const reportData = {
      totalExpenses,
      expensesByCategory,
      expensesByFarm,
      transactionCount,
      averageTransaction,
      categoryCount
    }

    // Generate PDF
    const doc = <ExpenseReportPDF 
      expenses={expenses} 
      farms={farms} 
      dateRange={dateRange} 
      reportData={reportData} 
    />
    
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
    
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

export default generateExpenseReportPDF
