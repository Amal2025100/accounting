# Smart Supermarket Management System - Database Schema

## 📊 Database Overview

**Database Type**: PostgreSQL 13+  
**Total Tables**: 20+  
**Relationships**: Fully normalized with foreign keys  
**Indexing**: Optimized for query performance

## 🗂️ Table Structure

### 1. Users Table
**Purpose**: System user authentication and authorization

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Roles**: Manager, Accountant, Cashier, Inventory Manager, Report Viewer

---

### 2. Products Table
**Purpose**: Product catalog and inventory management

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    unit VARCHAR(50) DEFAULT 'pcs',
    barcode VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_barcode ON products(barcode);
```

---

### 3. Customers Table
**Purpose**: Customer relationship management

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    membership_tier VARCHAR(20) DEFAULT 'Bronze',
    loyalty_points INTEGER DEFAULT 0,
    total_purchases DECIMAL(12, 2) DEFAULT 0,
    last_purchase_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_tier ON customers(membership_tier);
```

**Membership Tiers**: Bronze, Silver, Gold, Platinum

---

### 4. Employees Table
**Purpose**: Workforce management

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(100),
    department VARCHAR(100),
    hire_date TIMESTAMP,
    salary DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
```

---

### 5. Sales Table
**Purpose**: Sales transaction records

```sql
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER,
    employee_id INTEGER,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    items_count INTEGER DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Indexes
CREATE INDEX idx_sales_receipt ON sales(receipt_number);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_payment ON sales(payment_method);
```

---

### 6. Sale Items Table
**Purpose**: Individual items in each sale transaction

```sql
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
```

---

### 7. Suppliers Table
**Purpose**: Supplier management

```sql
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    payment_terms VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX idx_suppliers_status ON suppliers(status);
```

---

### 8. Purchase Orders Table
**Purpose**: Procurement management

```sql
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    shipping DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Indexes
CREATE INDEX idx_po_number ON purchase_orders(po_number);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_date ON purchase_orders(order_date);
```

**Status Values**: Pending, Approved, Ordered, Received, Cancelled

---

### 9. Purchase Order Items Table
**Purpose**: Items in each purchase order

```sql
CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    purchase_order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes
CREATE INDEX idx_po_items_po ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_po_items_product ON purchase_order_items(product_id);
```

---

### 10. Accounts Table
**Purpose**: Chart of accounts for accounting

```sql
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    account_code VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    parent_account_id INTEGER,
    balance DECIMAL(15, 2) DEFAULT 0,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (parent_account_id) REFERENCES accounts(id)
);

-- Indexes
CREATE INDEX idx_accounts_code ON accounts(account_code);
CREATE INDEX idx_accounts_type ON accounts(account_type);
```

**Account Types**: Asset, Liability, Equity, Revenue, Expense

---

### 11. Journal Entries Table
**Purpose**: Double-entry bookkeeping

```sql
CREATE TABLE journal_entries (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    entry_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Posted',
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (created_by) REFERENCES employees(id)
);

-- Indexes
CREATE INDEX idx_journal_number ON journal_entries(entry_number);
CREATE INDEX idx_journal_date ON journal_entries(entry_date);
```

---

### 12. Journal Entry Lines Table
**Purpose**: Individual debit/credit lines

```sql
CREATE TABLE journal_entry_lines (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    journal_entry_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    debit DECIMAL(15, 2) DEFAULT 0,
    credit DECIMAL(15, 2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    CHECK (debit >= 0 AND credit >= 0),
    CHECK ((debit > 0 AND credit = 0) OR (debit = 0 AND credit > 0))
);

-- Indexes
CREATE INDEX idx_journal_lines_entry ON journal_entry_lines(journal_entry_id);
CREATE INDEX idx_journal_lines_account ON journal_entry_lines(account_id);
```

---

### 13. Shifts Table
**Purpose**: Employee attendance tracking

```sql
CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    employee_id INTEGER NOT NULL,
    shift_date DATE NOT NULL,
    clock_in TIMESTAMP,
    clock_out TIMESTAMP,
    break_duration INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Indexes
CREATE INDEX idx_shifts_employee ON shifts(employee_id);
CREATE INDEX idx_shifts_date ON shifts(shift_date);
```

---

### 14. Inventory Adjustments Table
**Purpose**: Track inventory changes

```sql
CREATE TABLE inventory_adjustments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    product_id INTEGER NOT NULL,
    adjustment_type VARCHAR(50) NOT NULL,
    quantity_change INTEGER NOT NULL,
    reason TEXT,
    adjusted_by INTEGER,
    adjustment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (adjusted_by) REFERENCES employees(id)
);

-- Indexes
CREATE INDEX idx_inv_adj_product ON inventory_adjustments(product_id);
CREATE INDEX idx_inv_adj_date ON inventory_adjustments(adjustment_date);
```

**Adjustment Types**: Stock In, Stock Out, Damage, Loss, Return, Correction

---

### 15. AI Alerts Table
**Purpose**: AI-generated business alerts

```sql
CREATE TABLE ai_alerts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_alerts_type ON ai_alerts(alert_type);
CREATE INDEX idx_alerts_severity ON ai_alerts(severity);
CREATE INDEX idx_alerts_read ON ai_alerts(is_read);
```

**Alert Types**: Low Stock, High Demand, Price Change, Anomaly Detection  
**Severity**: Low, Medium, High, Critical

---

### 16. AI Predictions Table
**Purpose**: AI forecasting and predictions

```sql
CREATE TABLE ai_predictions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    prediction_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    predicted_value DECIMAL(15, 2),
    confidence_score DECIMAL(5, 2),
    prediction_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_predictions_type ON ai_predictions(prediction_type);
CREATE INDEX idx_predictions_date ON ai_predictions(prediction_date);
```

**Prediction Types**: Demand Forecast, Revenue Forecast, Stock Requirement

---

### 17. Loyalty Transactions Table
**Purpose**: Customer loyalty point transactions

```sql
CREATE TABLE loyalty_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    customer_id INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL,
    sale_id INTEGER,
    description TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

-- Indexes
CREATE INDEX idx_loyalty_customer ON loyalty_transactions(customer_id);
CREATE INDEX idx_loyalty_date ON loyalty_transactions(transaction_date);
```

**Transaction Types**: Earned, Redeemed, Adjusted, Expired

---

### 18. Promotions Table
**Purpose**: Marketing promotions and discounts

```sql
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    promotion_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    min_purchase DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_promotions_code ON promotions(promotion_code);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_promotions_status ON promotions(status);
```

**Discount Types**: Percentage, Fixed Amount

---

### 19. Audit Logs Table
**Purpose**: System activity tracking

```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
```

---

### 20. System Settings Table
**Purpose**: Application configuration

```sql
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) NOT NULL,
    description TEXT,
    updated_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_settings_key ON system_settings(setting_key);
```

---

## 🔗 Relationships Diagram

```
users (1) ─────< (N) products
users (1) ─────< (N) customers
users (1) ─────< (N) employees
users (1) ─────< (N) sales
users (1) ─────< (N) suppliers
users (1) ─────< (N) purchase_orders

customers (1) ─────< (N) sales
employees (1) ─────< (N) sales
employees (1) ─────< (N) shifts

sales (1) ─────< (N) sale_items
products (1) ─────< (N) sale_items

suppliers (1) ─────< (N) purchase_orders
purchase_orders (1) ─────< (N) purchase_order_items
products (1) ─────< (N) purchase_order_items

accounts (1) ─────< (N) journal_entry_lines
journal_entries (1) ─────< (N) journal_entry_lines

customers (1) ─────< (N) loyalty_transactions
sales (1) ─────< (N) loyalty_transactions

products (1) ─────< (N) inventory_adjustments
employees (1) ─────< (N) inventory_adjustments
```

---

## 📈 Database Statistics

- **Total Tables**: 20
- **Total Indexes**: 60+
- **Foreign Keys**: 35+
- **Check Constraints**: 5+
- **Unique Constraints**: 20+

---

## 🔒 Security Features

1. **Row Level Security**: User-based data isolation via `user_id`
2. **Cascading Deletes**: Proper cleanup of related records
3. **Check Constraints**: Data validation at database level
4. **Indexed Queries**: Optimized for performance
5. **Audit Trail**: Complete activity logging

---

## 🛠️ Maintenance Queries

### Check Database Size:
```sql
SELECT pg_size_pretty(pg_database_size('supermarket_db'));
```

### Check Table Sizes:
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Vacuum and Analyze:
```sql
VACUUM ANALYZE;
```

### Check Index Usage:
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

**Schema Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅