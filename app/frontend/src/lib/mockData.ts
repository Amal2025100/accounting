import { User, Product, Sale, Account, JournalEntry, AIAlert, Prediction, DailySummary } from '@/types';

export const users: User[] = [
  { id: 1, username: 'admin', role: 'Manager', createdAt: '2024-01-01' },
  { id: 2, username: 'accountant1', role: 'Accountant', createdAt: '2024-01-15' },
  { id: 3, username: 'cashier1', role: 'Cashier', createdAt: '2024-02-01' },
  { id: 4, username: 'cashier2', role: 'Cashier', createdAt: '2024-02-15' },
];

export const products: Product[] = [
  { id: 1, name: 'Fresh Milk 1L', category: 'Dairy', quantity: 45, costPrice: 2.50, sellPrice: 3.99, lowStockThreshold: 20 },
  { id: 2, name: 'Whole Wheat Bread', category: 'Bakery', quantity: 12, costPrice: 1.20, sellPrice: 2.49, lowStockThreshold: 15 },
  { id: 3, name: 'Organic Eggs (12 pack)', category: 'Dairy', quantity: 8, costPrice: 3.00, sellPrice: 4.99, lowStockThreshold: 10 },
  { id: 4, name: 'Orange Juice 2L', category: 'Beverages', quantity: 67, costPrice: 3.50, sellPrice: 5.99, lowStockThreshold: 25 },
  { id: 5, name: 'Potato Chips 200g', category: 'Snacks', quantity: 89, costPrice: 1.50, sellPrice: 2.99, lowStockThreshold: 30 },
  { id: 6, name: 'Greek Yogurt 500g', category: 'Dairy', quantity: 34, costPrice: 2.80, sellPrice: 4.49, lowStockThreshold: 20 },
  { id: 7, name: 'Cheddar Cheese 250g', category: 'Dairy', quantity: 5, costPrice: 4.00, sellPrice: 6.99, lowStockThreshold: 10 },
  { id: 8, name: 'Coca Cola 2L', category: 'Beverages', quantity: 120, costPrice: 1.80, sellPrice: 3.49, lowStockThreshold: 40 },
  { id: 9, name: 'Tomatoes (1kg)', category: 'Produce', quantity: 56, costPrice: 2.00, sellPrice: 3.99, lowStockThreshold: 25 },
  { id: 10, name: 'Bananas (1kg)', category: 'Produce', quantity: 78, costPrice: 1.20, sellPrice: 2.49, lowStockThreshold: 30 },
  { id: 11, name: 'Chicken Breast (1kg)', category: 'Meat', quantity: 23, costPrice: 6.50, sellPrice: 9.99, lowStockThreshold: 15 },
  { id: 12, name: 'Ground Beef (500g)', category: 'Meat', quantity: 18, costPrice: 5.00, sellPrice: 7.99, lowStockThreshold: 12 },
  { id: 13, name: 'Pasta 500g', category: 'Groceries', quantity: 95, costPrice: 0.80, sellPrice: 1.99, lowStockThreshold: 35 },
  { id: 14, name: 'Rice 2kg', category: 'Groceries', quantity: 42, costPrice: 3.50, sellPrice: 5.99, lowStockThreshold: 20 },
  { id: 15, name: 'Olive Oil 1L', category: 'Groceries', quantity: 28, costPrice: 7.00, sellPrice: 11.99, lowStockThreshold: 15 },
];

export const recentSales: Sale[] = [
  {
    id: 1,
    date: '2026-01-14T09:23:00',
    totalAmount: 24.95,
    cashierId: 3,
    cashierName: 'cashier1',
    items: [
      { productId: 1, productName: 'Fresh Milk 1L', quantity: 2, price: 3.99 },
      { productId: 4, productName: 'Orange Juice 2L', quantity: 1, price: 5.99 },
      { productId: 5, productName: 'Potato Chips 200g', quantity: 3, price: 2.99 },
    ],
  },
  {
    id: 2,
    date: '2026-01-14T10:45:00',
    totalAmount: 45.92,
    cashierId: 4,
    cashierName: 'cashier2',
    items: [
      { productId: 11, productName: 'Chicken Breast (1kg)', quantity: 2, price: 9.99 },
      { productId: 9, productName: 'Tomatoes (1kg)', quantity: 3, price: 3.99 },
      { productId: 14, productName: 'Rice 2kg', quantity: 2, price: 5.99 },
    ],
  },
  {
    id: 3,
    date: '2026-01-14T11:12:00',
    totalAmount: 18.47,
    cashierId: 3,
    cashierName: 'cashier1',
    items: [
      { productId: 2, productName: 'Whole Wheat Bread', quantity: 3, price: 2.49 },
      { productId: 6, productName: 'Greek Yogurt 500g', quantity: 2, price: 4.49 },
    ],
  },
];

export const accounts: Account[] = [
  { id: 1, name: 'Cash', type: 'Asset', balance: 125000.00 },
  { id: 2, name: 'Inventory', type: 'Asset', balance: 45000.00 },
  { id: 3, name: 'Accounts Receivable', type: 'Asset', balance: 8500.00 },
  { id: 4, name: 'Equipment', type: 'Asset', balance: 35000.00 },
  { id: 5, name: 'Accounts Payable', type: 'Liability', balance: 12000.00 },
  { id: 6, name: 'Loans Payable', type: 'Liability', balance: 50000.00 },
  { id: 7, name: 'Owner Equity', type: 'Equity', balance: 100000.00 },
  { id: 8, name: 'Sales Revenue', type: 'Revenue', balance: 85000.00 },
  { id: 9, name: 'Cost of Goods Sold', type: 'Expense', balance: 52000.00 },
  { id: 10, name: 'Rent Expense', type: 'Expense', balance: 12000.00 },
  { id: 11, name: 'Utilities Expense', type: 'Expense', balance: 3500.00 },
  { id: 12, name: 'Salaries Expense', type: 'Expense', balance: 28000.00 },
];

export const journalEntries: JournalEntry[] = [
  {
    id: 1,
    date: '2026-01-14',
    description: 'Daily sales revenue',
    createdBy: 'admin',
    details: [
      { accountId: 1, accountName: 'Cash', debit: 2450.00, credit: 0 },
      { accountId: 8, accountName: 'Sales Revenue', debit: 0, credit: 2450.00 },
    ],
  },
  {
    id: 2,
    date: '2026-01-13',
    description: 'Inventory purchase',
    createdBy: 'accountant1',
    details: [
      { accountId: 2, accountName: 'Inventory', debit: 5000.00, credit: 0 },
      { accountId: 1, accountName: 'Cash', debit: 0, credit: 5000.00 },
    ],
  },
  {
    id: 3,
    date: '2026-01-12',
    description: 'Monthly rent payment',
    createdBy: 'accountant1',
    details: [
      { accountId: 10, accountName: 'Rent Expense', debit: 3000.00, credit: 0 },
      { accountId: 1, accountName: 'Cash', debit: 0, credit: 3000.00 },
    ],
  },
];

export const aiAlerts: AIAlert[] = [
  {
    id: 1,
    date: '2026-01-14T08:00:00',
    type: 'Stock',
    message: 'Cheddar Cheese 250g is critically low (5 units remaining)',
    riskScore: 8,
  },
  {
    id: 2,
    date: '2026-01-14T07:30:00',
    type: 'Stock',
    message: 'Organic Eggs (12 pack) approaching low stock threshold',
    riskScore: 6,
  },
  {
    id: 3,
    date: '2026-01-13T16:45:00',
    type: 'Sales',
    message: 'Unusual sales spike detected for Potato Chips (+45% vs average)',
    riskScore: 4,
  },
  {
    id: 4,
    date: '2026-01-13T14:20:00',
    type: 'Anomaly',
    message: 'Transaction amount significantly higher than average detected',
    riskScore: 7,
  },
  {
    id: 5,
    date: '2026-01-12T09:15:00',
    type: 'Financial',
    message: 'Cash flow projection shows potential shortage in 15 days',
    riskScore: 9,
  },
];

export const salesForecast: Prediction[] = [
  { date: '2026-01-15', value: 2850, confidence: 0.92 },
  { date: '2026-01-16', value: 2920, confidence: 0.89 },
  { date: '2026-01-17', value: 3100, confidence: 0.87 },
  { date: '2026-01-18', value: 3350, confidence: 0.85 },
  { date: '2026-01-19', value: 3200, confidence: 0.83 },
  { date: '2026-01-20', value: 2950, confidence: 0.81 },
  { date: '2026-01-21', value: 2800, confidence: 0.79 },
];

export const profitPrediction: Prediction[] = [
  { date: '2026-01-15', value: 850, confidence: 0.88 },
  { date: '2026-01-16', value: 920, confidence: 0.86 },
  { date: '2026-01-17', value: 1050, confidence: 0.84 },
  { date: '2026-01-18', value: 1150, confidence: 0.82 },
  { date: '2026-01-19', value: 1020, confidence: 0.80 },
  { date: '2026-01-20', value: 890, confidence: 0.78 },
  { date: '2026-01-21', value: 820, confidence: 0.76 },
];

export const cashFlowPrediction: Prediction[] = [
  { date: '2026-01-15', value: 126500 },
  { date: '2026-01-16', value: 128200 },
  { date: '2026-01-17', value: 129800 },
  { date: '2026-01-18', value: 131500 },
  { date: '2026-01-19', value: 130200 },
  { date: '2026-01-20', value: 128900 },
  { date: '2026-01-21', value: 127600 },
];

export const dailySummaries: DailySummary[] = [
  { date: '2026-01-08', totalSales: 2450.00, totalExpenses: 1200.00, profit: 1250.00, cashBalance: 120000.00 },
  { date: '2026-01-09', totalSales: 2680.00, totalExpenses: 1350.00, profit: 1330.00, cashBalance: 121330.00 },
  { date: '2026-01-10', totalSales: 2890.00, totalExpenses: 1400.00, profit: 1490.00, cashBalance: 122820.00 },
  { date: '2026-01-11', totalSales: 2720.00, totalExpenses: 1280.00, profit: 1440.00, cashBalance: 124260.00 },
  { date: '2026-01-12', totalSales: 2550.00, totalExpenses: 1320.00, profit: 1230.00, cashBalance: 125490.00 },
  { date: '2026-01-13', totalSales: 2980.00, totalExpenses: 1450.00, profit: 1530.00, cashBalance: 127020.00 },
  { date: '2026-01-14', totalSales: 2450.00, totalExpenses: 1180.00, profit: 1270.00, cashBalance: 125000.00 },
];