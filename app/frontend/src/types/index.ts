// User and Authentication Types
export type UserRole = 'Manager' | 'Accountant' | 'Cashier' | 'Inventory Manager' | 'Report Viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
}

// Product and Inventory Types
export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  cost_price: number;
  sell_price: number;
  low_stock_threshold: number;
  barcode?: string;
  sku?: string;
  supplier_id?: number;
  location_id?: number;
}

export interface StockAdjustment {
  id: number;
  user_id: string;
  product_id: number;
  product_name: string;
  adjustment_type: 'Add' | 'Remove' | 'Damage' | 'Transfer';
  quantity: number;
  reason: string;
  adjusted_by: string;
  adjustment_date: string;
  created_at: string;
}

// Customer Types
export interface Customer {
  id: number;
  user_id: string;
  customer_code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyalty_points: number;
  total_purchases: number;
  last_purchase_date?: string;
  created_at: string;
}

// Employee Types
export interface Employee {
  id: number;
  user_id: string;
  employee_code: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  position?: string;
  department: string;
  hire_date: string;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  created_at: string;
}

export interface Shift {
  id: number;
  user_id: string;
  employee_id: number;
  employee_name: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  clock_in?: string;
  clock_out?: string;
  status: 'Scheduled' | 'Completed' | 'Absent';
  created_at: string;
}

// Supplier and Purchase Types
export interface Supplier {
  id: number;
  user_id: string;
  supplier_code: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface PurchaseOrder {
  id: number;
  user_id: string;
  po_number: string;
  supplier_id: number;
  supplier_name: string;
  order_date: string;
  expected_delivery: string;
  total_amount: number;
  status: 'Pending' | 'Received' | 'Cancelled';
  created_by: string;
  created_at: string;
}

export interface PurchaseOrderItem {
  id: number;
  user_id: string;
  po_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity: number;
  created_at: string;
}

// Sales Types
export interface Sale {
  id: number;
  user_id: string;
  sale_date: string;
  total_amount: number;
  cashier_name: string;
  customer_id?: number;
  payment_method: string;
  discount?: number;
  tax_amount?: number;
  created_at: string;
}

export interface SaleItem {
  id: number;
  user_id: string;
  sale_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  discount?: number;
  total_price: number;
  created_at: string;
}

export interface Receipt {
  id: number;
  user_id: string;
  receipt_number: string;
  sale_id: number;
  customer_id?: number;
  total_amount: number;
  payment_method: string;
  cashier_name: string;
  receipt_date: string;
  created_at: string;
}

export interface Return {
  id: number;
  user_id: string;
  return_number: string;
  sale_id: number;
  customer_id?: number;
  return_amount: number;
  reason: string;
  processed_by: string;
  return_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface ReturnItem {
  id: number;
  user_id: string;
  return_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  created_at: string;
}

// Accounting Types
export interface Account {
  id: number;
  name: string;
  account_type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
  parent_account_id?: number;
  is_active: boolean;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  user_id: string;
  entry_date: string;
  description: string;
  created_by: string;
  total_debit: number;
  total_credit: number;
  status: 'Draft' | 'Posted';
  created_at: string;
}

export interface JournalDetail {
  id: number;
  user_id: string;
  entry_id: number;
  account_id: number;
  account_name: string;
  debit: number;
  credit: number;
  created_at: string;
}

// AI and Analytics Types
export interface AIAlert {
  id: number;
  alert_date: string;
  alert_type: 'Stock' | 'Sales' | 'Financial' | 'Anomaly';
  message: string;
  risk_score: number;
  is_resolved: boolean;
  created_at: string;
}

export interface SalesForecast {
  id: number;
  forecast_date: string;
  predicted_value: number;
  confidence: number;
  created_at: string;
}

export interface ProfitPrediction {
  id: number;
  prediction_date: string;
  predicted_profit: number;
  confidence: number;
  created_at: string;
}

export interface CashFlowPrediction {
  id: number;
  prediction_date: string;
  predicted_balance: number;
  created_at: string;
}

export interface DailySummary {
  id: number;
  summary_date: string;
  total_sales: number;
  total_expenses: number;
  profit: number;
  cash_balance: number;
  transaction_count: number;
  created_at: string;
}

// System Types
export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: number;
  details: string;
  ip_address?: string;
  created_at: string;
}

export interface TaxRate {
  id: number;
  name: string;
  rate: number;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Location {
  id: number;
  location_code: string;
  name: string;
  address?: string;
  phone?: string;
  manager_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: 'Cash' | 'Card' | 'Mobile' | 'Other';
  is_active: boolean;
  created_at: string;
}

// Dashboard and Report Types
export interface DashboardMetrics {
  totalSales: number;
  totalProfit: number;
  totalTransactions: number;
  averageTransaction: number;
  lowStockItems: number;
  activeCustomers: number;
  salesGrowth: number;
  profitMargin: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Sales' | 'Inventory' | 'Financial' | 'Customer' | 'Employee';
  parameters: Record<string, unknown>;
}

// POS Types
export interface POSCart {
  items: POSCartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  customer?: Customer;
  paymentMethod?: string;
}

export interface POSCartItem {
  product: Product;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

// Permission Types
export interface Permission {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}