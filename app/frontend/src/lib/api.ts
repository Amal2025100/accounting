import { createClient } from '@metagptx/web-sdk';
import type {
  Product,
  Customer,
  Employee,
  Shift,
  Supplier,
  PurchaseOrder,
  PurchaseOrderItem,
  Sale,
  SaleItem,
  Receipt,
  Return,
  ReturnItem,
  Account,
  JournalEntry,
  JournalDetail,
  AIAlert,
  SalesForecast,
  ProfitPrediction,
  CashFlowPrediction,
  DailySummary,
  Notification,
  AuditLog,
  TaxRate,
  Location,
  PaymentMethod,
  StockAdjustment,
} from '@/types';

// Create client instance
export const client = createClient();

// Mock data for development
const mockEmployees: Employee[] = [
  {
    id: 1,
    user_id: '1',
    employee_code: 'EMP-001',
    name: 'John Smith',
    email: 'john.smith@supermarket.com',
    phone: '+1-555-0101',
    role: 'Store Manager',
    department: 'Management',
    hire_date: '2022-01-15 00:00:00',
    salary: 5500,
    status: 'Active',
    created_at: '2022-01-15T00:00:00Z',
  },
  {
    id: 2,
    user_id: '1',
    employee_code: 'EMP-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@supermarket.com',
    phone: '+1-555-0102',
    role: 'Cashier',
    department: 'Sales',
    hire_date: '2023-03-20 00:00:00',
    salary: 2800,
    status: 'Active',
    created_at: '2023-03-20T00:00:00Z',
  },
  {
    id: 3,
    user_id: '1',
    employee_code: 'EMP-003',
    name: 'Michael Chen',
    email: 'michael.c@supermarket.com',
    phone: '+1-555-0103',
    role: 'Inventory Manager',
    department: 'Operations',
    hire_date: '2022-06-10 00:00:00',
    salary: 4200,
    status: 'Active',
    created_at: '2022-06-10T00:00:00Z',
  },
  {
    id: 4,
    user_id: '1',
    employee_code: 'EMP-004',
    name: 'Emily Davis',
    email: 'emily.d@supermarket.com',
    phone: '+1-555-0104',
    role: 'Accountant',
    department: 'Finance',
    hire_date: '2021-11-05 00:00:00',
    salary: 4800,
    status: 'On Leave',
    created_at: '2021-11-05T00:00:00Z',
  },
];

const mockShifts: Shift[] = [
  {
    id: 1,
    user_id: '1',
    employee_id: 1,
    employee_name: 'John Smith',
    shift_date: '2024-01-15',
    start_time: '09:00:00',
    end_time: '17:00:00',
    clock_in: '2024-01-15 09:00:00',
    clock_out: '2024-01-15 17:15:00',
    status: 'Completed',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    user_id: '1',
    employee_id: 2,
    employee_name: 'Sarah Johnson',
    shift_date: '2024-01-15',
    start_time: '08:00:00',
    end_time: '16:00:00',
    clock_in: '2024-01-15 08:05:00',
    clock_out: '2024-01-15 16:30:00',
    status: 'Completed',
    created_at: '2024-01-15T00:00:00Z',
  },
];

const mockSales: Sale[] = [
  {
    id: 1,
    user_id: '1',
    sale_date: '2024-01-15',
    total_amount: 125.50,
    cashier_name: 'Sarah Johnson',
    customer_id: 1,
    payment_method: 'Credit Card',
    discount: 5,
    tax_amount: 10.50,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    user_id: '1',
    sale_date: '2024-01-14',
    total_amount: 89.99,
    cashier_name: 'Sarah Johnson',
    payment_method: 'Cash',
    created_at: '2024-01-14T00:00:00Z',
  },
  {
    id: 3,
    user_id: '1',
    sale_date: '2024-01-13',
    total_amount: 256.75,
    cashier_name: 'John Smith',
    customer_id: 2,
    payment_method: 'Mobile',
    discount: 10,
    tax_amount: 21.25,
    created_at: '2024-01-13T00:00:00Z',
  },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Apples',
    category: 'Fruits',
    quantity: 45,
    cost_price: 2.50,
    sell_price: 4.99,
    low_stock_threshold: 20,
    barcode: '1234567890',
    sku: 'ORG-APP-001',
  },
  {
    id: 2,
    name: 'Whole Milk',
    category: 'Dairy',
    quantity: 8,
    cost_price: 2.00,
    sell_price: 3.99,
    low_stock_threshold: 15,
    barcode: '1234567891',
    sku: 'DAI-MILK-001',
  },
  {
    id: 3,
    name: 'Bread',
    category: 'Bakery',
    quantity: 0,
    cost_price: 1.50,
    sell_price: 2.99,
    low_stock_threshold: 10,
    barcode: '1234567892',
    sku: 'BAK-BRD-001',
  },
];

const mockCustomers: Customer[] = [
  {
    id: 1,
    user_id: '1',
    customer_code: 'CUST-001',
    name: 'Alice Johnson',
    email: 'alice@email.com',
    phone: '+1-555-0201',
    address: '123 Main St, City',
    loyalty_points: 250,
    total_purchases: 1250.50,
    last_purchase_date: '2024-01-15',
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 2,
    user_id: '1',
    customer_code: 'CUST-002',
    name: 'Bob Smith',
    email: 'bob@email.com',
    phone: '+1-555-0202',
    loyalty_points: 150,
    total_purchases: 890.75,
    last_purchase_date: '2024-01-13',
    created_at: '2023-08-20T00:00:00Z',
  },
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    user_id: '1',
    po_number: 'PO-2024-001',
    supplier_id: 1,
    supplier_name: 'Fresh Produce Co.',
    order_date: '2024-01-10',
    expected_delivery: '2024-01-15',
    total_amount: 2500.00,
    status: 'Received',
    created_by: 'John Smith',
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 2,
    user_id: '1',
    po_number: 'PO-2024-002',
    supplier_id: 2,
    supplier_name: 'Dairy Suppliers Inc.',
    order_date: '2024-01-12',
    expected_delivery: '2024-01-18',
    total_amount: 1800.00,
    status: 'Pending',
    created_by: 'Michael Chen',
    created_at: '2024-01-12T00:00:00Z',
  },
];

// API helper functions
export const api = {
  // Products
  products: {
    getAll: async (): Promise<Product[]> => {
      try {
        const response = await client.entities.products.query({
          query: {},
          limit: 1000,
        });
        return response.data.items as Product[];
      } catch {
        // Return mock data if API fails
        return mockProducts;
      }
    },
    getLowStock: async (): Promise<Product[]> => {
      try {
        const response = await client.entities.products.query({
          query: {},
          limit: 1000,
        });
        return (response.data.items as Product[]).filter((p) => p.quantity <= p.low_stock_threshold);
      } catch {
        // Return mock data if API fails
        return mockProducts.filter(p => p.quantity <= p.low_stock_threshold);
      }
    },
    getById: async (id: number): Promise<Product> => {
      try {
        const response = await client.entities.products.get({
          id: id.toString(),
        });
        return response.data as Product;
      } catch {
        // Return mock data if API fails
        const product = mockProducts.find(p => p.id === id);
        if (!product) throw new Error('Product not found');
        return product;
      }
    },
    create: async (data: Omit<Product, 'id'>): Promise<Product> => {
      try {
        const response = await client.entities.products.create({
          data,
        });
        return response.data as Product;
      } catch {
        // Return mock data if API fails
        const newProduct: Product = {
          ...data,
          id: Math.max(...mockProducts.map(p => p.id)) + 1,
        };
        mockProducts.push(newProduct);
        return newProduct;
      }
    },
    update: async (id: number, data: Partial<Product>): Promise<Product> => {
      try {
        const response = await client.entities.products.update({
          id: id.toString(),
          data,
        });
        return response.data as Product;
      } catch {
        // Return mock data if API fails
        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');
        mockProducts[index] = { ...mockProducts[index], ...data };
        return mockProducts[index];
      }
    },
    delete: async (id: number): Promise<void> => {
      try {
        await client.entities.products.delete({ id: id.toString() });
      } catch {
        // Remove from mock data if API fails
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) mockProducts.splice(index, 1);
      }
    },
  },

  // Customers
  customers: {
    getAll: async (): Promise<Customer[]> => {
      try {
        const response = await client.entities.customers.query({
          query: {},
          limit: 1000,
        });
        return response.data.items as Customer[];
      } catch {
        // Return mock data if API fails
        return mockCustomers;
      }
    },
    getById: async (id: number): Promise<Customer> => {
      try {
        const response = await client.entities.customers.get({
          id: id.toString(),
        });
        return response.data as Customer;
      } catch {
        // Return mock data if API fails
        const customer = mockCustomers.find(c => c.id === id);
        if (!customer) throw new Error('Customer not found');
        return customer;
      }
    },
    create: async (data: Omit<Customer, 'id'>): Promise<Customer> => {
      try {
        const response = await client.entities.customers.create({
          data,
        });
        return response.data as Customer;
      } catch {
        // Return mock data if API fails
        const newCustomer: Customer = {
          ...data,
          id: Math.max(...mockCustomers.map(c => c.id)) + 1,
        };
        mockCustomers.push(newCustomer);
        return newCustomer;
      }
    },
    update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
      try {
        const response = await client.entities.customers.update({
          id: id.toString(),
          data,
        });
        return response.data as Customer;
      } catch {
        // Return mock data if API fails
        const index = mockCustomers.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Customer not found');
        mockCustomers[index] = { ...mockCustomers[index], ...data };
        return mockCustomers[index];
      }
    },
  },

  // Sales
  sales: {
    getAll: async (): Promise<Sale[]> => {
      try {
        const response = await client.entities.sales.query({
          query: {},
          sort: '-sale_date',
          limit: 1000,
        });
        return response.data.items as Sale[];
      } catch {
        // Return mock data if API fails
        return mockSales;
      }
    },
    getRecent: async (limit = 10): Promise<Sale[]> => {
      try {
        const response = await client.entities.sales.query({
          query: {},
          sort: '-sale_date',
          limit,
        });
        return response.data.items as Sale[];
      } catch {
        // Return mock data if API fails
        return mockSales.slice(0, limit);
      }
    },
    create: async (data: Omit<Sale, 'id'>): Promise<Sale> => {
      try {
        const response = await client.entities.sales.create({
          data,
        });
        return response.data as Sale;
      } catch {
        // Return mock data if API fails
        const newSale: Sale = {
          ...data,
          id: Math.max(...mockSales.map(s => s.id)) + 1,
        };
        mockSales.push(newSale);
        return newSale;
      }
    },
  },

  // Purchase Orders
  purchaseOrders: {
    getAll: async (): Promise<PurchaseOrder[]> => {
      try {
        const response = await client.entities.purchase_orders.query({
          query: {},
          sort: '-order_date',
          limit: 1000,
        });
        return response.data.items as PurchaseOrder[];
      } catch {
        // Return mock data if API fails
        return mockPurchaseOrders;
      }
    },
    getById: async (id: number): Promise<PurchaseOrder> => {
      try {
        const response = await client.entities.purchase_orders.get({
          id: id.toString(),
        });
        return response.data as PurchaseOrder;
      } catch {
        // Return mock data if API fails
        const po = mockPurchaseOrders.find(p => p.id === id);
        if (!po) throw new Error('Purchase Order not found');
        return po;
      }
    },
    create: async (data: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
      try {
        const response = await client.entities.purchase_orders.create({
          data,
        });
        return response.data as PurchaseOrder;
      } catch {
        // Return mock data if API fails
        const newPO: PurchaseOrder = {
          ...data,
          id: Math.max(...mockPurchaseOrders.map(po => po.id)) + 1,
        };
        mockPurchaseOrders.push(newPO);
        return newPO;
      }
    },
    update: async (id: number, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
      try {
        const response = await client.entities.purchase_orders.update({
          id: id.toString(),
          data,
        });
        return response.data as PurchaseOrder;
      } catch {
        // Return mock data if API fails
        const index = mockPurchaseOrders.findIndex(po => po.id === id);
        if (index === -1) throw new Error('Purchase Order not found');
        mockPurchaseOrders[index] = { ...mockPurchaseOrders[index], ...data };
        return mockPurchaseOrders[index];
      }
    },
  },

  // Employees
  employees: {
    getAll: async (): Promise<Employee[]> => {
      try {
        const response = await client.entities.employees.query({
          query: {},
          limit: 1000,
        });
        return response.data.items as Employee[];
      } catch {
        // Return mock data if API fails
        return mockEmployees;
      }
    },
    getById: async (id: number): Promise<Employee> => {
      try {
        const response = await client.entities.employees.get({
          id: id.toString(),
        });
        return response.data as Employee;
      } catch {
        // Return mock data if API fails
        const employee = mockEmployees.find(e => e.id === id);
        if (!employee) throw new Error('Employee not found');
        return employee;
      }
    },
    create: async (data: Omit<Employee, 'id'>): Promise<Employee> => {
      try {
        const response = await client.entities.employees.create({
          data,
        });
        return response.data as Employee;
      } catch {
        // Return mock data if API fails
        const newEmployee: Employee = {
          ...data,
          id: Math.max(...mockEmployees.map(e => e.id)) + 1,
        };
        mockEmployees.push(newEmployee);
        return newEmployee;
      }
    },
    update: async (id: number, data: Partial<Employee>): Promise<Employee> => {
      try {
        const response = await client.entities.employees.update({
          id: id.toString(),
          data,
        });
        return response.data as Employee;
      } catch {
        // Return mock data if API fails
        const index = mockEmployees.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Employee not found');
        mockEmployees[index] = { ...mockEmployees[index], ...data };
        return mockEmployees[index];
      }
    },
  },

  // Shifts
  shifts: {
    getAll: async (): Promise<Shift[]> => {
      try {
        const response = await client.entities.shifts.query({
          query: {},
          sort: '-shift_date',
          limit: 1000,
        });
        return response.data.items as Shift[];
      } catch {
        // Return mock data if API fails
        return mockShifts;
      }
    },
    create: async (data: Omit<Shift, 'id'>): Promise<Shift> => {
      try {
        const response = await client.entities.shifts.create({
          data,
        });
        return response.data as Shift;
      } catch {
        // Return mock data if API fails
        const newShift: Shift = {
          ...data,
          id: Math.max(...mockShifts.map(s => s.id)) + 1,
        };
        mockShifts.push(newShift);
        return newShift;
      }
    },
    update: async (id: number, data: Partial<Shift>): Promise<Shift> => {
      try {
        const response = await client.entities.shifts.update({
          id: id.toString(),
          data,
        });
        return response.data as Shift;
      } catch {
        // Return mock data if API fails
        const index = mockShifts.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Shift not found');
        mockShifts[index] = { ...mockShifts[index], ...data };
        return mockShifts[index];
      }
    },
  },

  // Suppliers
  suppliers: {
    getAll: async (): Promise<Supplier[]> => {
      const response = await client.entities.suppliers.query({
        query: {},
        limit: 1000,
      });
      return response.data.items as Supplier[];
    },
    getById: async (id: number): Promise<Supplier> => {
      const response = await client.entities.suppliers.get({
        id: id.toString(),
      });
      return response.data as Supplier;
    },
    create: async (data: Omit<Supplier, 'id'>): Promise<Supplier> => {
      const response = await client.entities.suppliers.create({
        data,
      });
      return response.data as Supplier;
    },
    update: async (id: number, data: Partial<Supplier>): Promise<Supplier> => {
      const response = await client.entities.suppliers.update({
        id: id.toString(),
        data,
      });
      return response.data as Supplier;
    },
  },

  // Purchase Order Items
  purchaseOrderItems: {
    getByPOId: async (poId: number): Promise<PurchaseOrderItem[]> => {
      try {
        const response = await client.entities.purchase_order_items.query({
          query: { po_id: poId },
          limit: 1000,
        });
        return response.data.items as PurchaseOrderItem[];
      } catch {
        // Return empty array if API fails
        return [];
      }
    },
    create: async (data: Omit<PurchaseOrderItem, 'id'>): Promise<PurchaseOrderItem> => {
      try {
        const response = await client.entities.purchase_order_items.create({
          data,
        });
        return response.data as PurchaseOrderItem;
      } catch {
        // Return mock data if API fails
        const newItem: PurchaseOrderItem = {
          ...data,
          id: Date.now(),
        };
        return newItem;
      }
    },
  },

  // Stock Adjustments
  stockAdjustments: {
    getAll: async (): Promise<StockAdjustment[]> => {
      try {
        const response = await client.entities.stock_adjustments.query({
          query: {},
          sort: '-adjustment_date',
          limit: 1000,
        });
        return response.data.items as StockAdjustment[];
      } catch {
        // Return empty array if API fails
        return [];
      }
    },
    create: async (data: Omit<StockAdjustment, 'id'>): Promise<StockAdjustment> => {
      try {
        const response = await client.entities.stock_adjustments.create({
          data,
        });
        return response.data as StockAdjustment;
      } catch {
        // Return mock data if API fails
        const newItem: StockAdjustment = {
          ...data,
          id: Date.now(),
        };
        return newItem;
      }
    },
  },

  // Sale Items
  saleItems: {
    getBySaleId: async (saleId: number): Promise<SaleItem[]> => {
      try {
        const response = await client.entities.sale_items.query({
          query: { sale_id: saleId },
          limit: 1000,
        });
        return response.data.items as SaleItem[];
      } catch {
        // Return empty array if API fails
        return [];
      }
    },
    create: async (data: Omit<SaleItem, 'id'>): Promise<SaleItem> => {
      try {
        const response = await client.entities.sale_items.create({
          data,
        });
        return response.data as SaleItem;
      } catch {
        // Return mock data if API fails
        const newItem: SaleItem = {
          ...data,
          id: Date.now(),
        };
        return newItem;
      }
    },
  },

  // Receipts
  receipts: {
    getAll: async (): Promise<Receipt[]> => {
      const response = await client.entities.receipts.query({
        query: {},
        sort: '-receipt_date',
        limit: 1000,
      });
      return response.data.items as Receipt[];
    },
    create: async (data: Omit<Receipt, 'id'>): Promise<Receipt> => {
      const response = await client.entities.receipts.create({
        data,
      });
      return response.data as Receipt;
    },
  },

  // Returns
  returns: {
    getAll: async (): Promise<Return[]> => {
      const response = await client.entities.returns.query({
        query: {},
        sort: '-return_date',
        limit: 1000,
      });
      return response.data.items as Return[];
    },
    create: async (data: Omit<Return, 'id'>): Promise<Return> => {
      const response = await client.entities.returns.create({
        data,
      });
      return response.data as Return;
    },
    update: async (id: number, data: Partial<Return>): Promise<Return> => {
      const response = await client.entities.returns.update({
        id: id.toString(),
        data,
      });
      return response.data as Return;
    },
  },

  // Return Items
  returnItems: {
    getByReturnId: async (returnId: number): Promise<ReturnItem[]> => {
      const response = await client.entities.return_items.query({
        query: { return_id: returnId },
        limit: 1000,
      });
      return response.data.items as ReturnItem[];
    },
    create: async (data: Omit<ReturnItem, 'id'>): Promise<ReturnItem> => {
      const response = await client.entities.return_items.create({
        data,
      });
      return response.data as ReturnItem;
    },
  },

  // Accounts
  accounts: {
    getAll: async (): Promise<Account[]> => {
      const response = await client.entities.accounts.query({
        query: {},
        limit: 1000,
      });
      return response.data.items as Account[];
    },
    getByType: async (type: string): Promise<Account[]> => {
      const response = await client.entities.accounts.query({
        query: { account_type: type },
        limit: 1000,
      });
      return response.data.items as Account[];
    },
  },

  // Journal Entries
  journalEntries: {
    getAll: async (): Promise<JournalEntry[]> => {
      const response = await client.entities.journal_entries.query({
        query: {},
        sort: '-entry_date',
        limit: 1000,
      });
      return response.data.items as JournalEntry[];
    },
    create: async (data: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
      const response = await client.entities.journal_entries.create({
        data,
      });
      return response.data as JournalEntry;
    },
  },

  // Journal Details
  journalDetails: {
    getByEntryId: async (entryId: number): Promise<JournalDetail[]> => {
      const response = await client.entities.journal_details.query({
        query: { entry_id: entryId },
        limit: 1000,
      });
      return response.data.items as JournalDetail[];
    },
    create: async (data: Omit<JournalDetail, 'id'>): Promise<JournalDetail> => {
      const response = await client.entities.journal_details.create({
        data,
      });
      return response.data as JournalDetail;
    },
  },

  // AI Alerts
  aiAlerts: {
    getRecent: async (limit = 10): Promise<AIAlert[]> => {
      const response = await client.entities.ai_alerts.query({
        query: {},
        sort: '-alert_date',
        limit,
      });
      return response.data.items as AIAlert[];
    },
  },

  // Sales Forecasts
  salesForecasts: {
    getAll: async (): Promise<SalesForecast[]> => {
      const response = await client.entities.sales_forecasts.query({
        query: {},
        sort: 'forecast_date',
        limit: 1000,
      });
      return response.data.items as SalesForecast[];
    },
  },

  // Profit Predictions
  profitPredictions: {
    getAll: async (): Promise<ProfitPrediction[]> => {
      const response = await client.entities.profit_predictions.query({
        query: {},
        sort: 'prediction_date',
        limit: 1000,
      });
      return response.data.items as ProfitPrediction[];
    },
  },

  // Cash Flow Predictions
  cashFlowPredictions: {
    getAll: async (): Promise<CashFlowPrediction[]> => {
      const response = await client.entities.cash_flow_predictions.query({
        query: {},
        sort: 'prediction_date',
        limit: 1000,
      });
      return response.data.items as CashFlowPrediction[];
    },
  },

  // Daily Summaries
  dailySummaries: {
    getRecent: async (limit = 7): Promise<DailySummary[]> => {
      const response = await client.entities.daily_summaries.query({
        query: {},
        sort: '-summary_date',
        limit,
      });
      return response.data.items as DailySummary[];
    },
  },

  // Notifications
  notifications: {
    getAll: async (): Promise<Notification[]> => {
      const response = await client.entities.notifications.query({
        query: {},
        sort: '-created_at',
        limit: 100,
      });
      return response.data.items as Notification[];
    },
    markAsRead: async (id: number): Promise<Notification> => {
      const response = await client.entities.notifications.update({
        id: id.toString(),
        data: { is_read: true },
      });
      return response.data as Notification;
    },
  },

  // Audit Logs
  auditLogs: {
    getRecent: async (limit = 50): Promise<AuditLog[]> => {
      const response = await client.entities.audit_logs.query({
        query: {},
        sort: '-created_at',
        limit,
      });
      return response.data.items as AuditLog[];
    },
    create: async (data: Omit<AuditLog, 'id'>): Promise<AuditLog> => {
      const response = await client.entities.audit_logs.create({
        data,
      });
      return response.data as AuditLog;
    },
  },

  // Tax Rates
  taxRates: {
    getAll: async (): Promise<TaxRate[]> => {
      const response = await client.entities.tax_rates.query({
        query: {},
        limit: 100,
      });
      return response.data.items as TaxRate[];
    },
    getActive: async (): Promise<TaxRate[]> => {
      const response = await client.entities.tax_rates.query({
        query: { is_active: true },
        limit: 100,
      });
      return response.data.items as TaxRate[];
    },
  },

  // Locations
  locations: {
    getAll: async (): Promise<Location[]> => {
      const response = await client.entities.locations.query({
        query: {},
        limit: 100,
      });
      return response.data.items as Location[];
    },
    getActive: async (): Promise<Location[]> => {
      const response = await client.entities.locations.query({
        query: { is_active: true },
        limit: 100,
      });
      return response.data.items as Location[];
    },
  },

  // Payment Methods
  paymentMethods: {
    getAll: async (): Promise<PaymentMethod[]> => {
      const response = await client.entities.payment_methods.query({
        query: {},
        limit: 100,
      });
      return response.data.items as PaymentMethod[];
    },
    getActive: async (): Promise<PaymentMethod[]> => {
      const response = await client.entities.payment_methods.query({
        query: { is_active: true },
        limit: 100,
      });
      return response.data.items as PaymentMethod[];
    },
  },
};
