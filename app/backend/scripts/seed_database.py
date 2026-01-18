"""
Database Seeding Script
Automatically populates the database with sample data for testing and demo purposes.
"""
import asyncio
import logging
from datetime import datetime, timedelta
import random
from pathlib import Path
import sys

# Add parent directory to path to import from core
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def clear_all_data(db: AsyncSession):
    """Clear all existing data from tables"""
    logger.info("Clearing existing data...")
    
    tables = [
        'sale_items', 'sales', 'receipts', 'return_items', 'returns',
        'purchase_order_items', 'purchase_orders', 'stock_adjustments',
        'journal_details', 'journal_entries', 'shifts',
        'ai_alerts', 'sales_forecasts', 'profit_predictions', 'cash_flow_predictions',
        'daily_summaries', 'notifications', 'audit_logs',
        'products', 'customers', 'employees', 'suppliers',
        'accounts', 'tax_rates', 'locations', 'payment_methods'
    ]
    
    for table in tables:
        try:
            await db.execute(text(f"DELETE FROM {table}"))
        except Exception as e:
            logger.warning(f"Could not clear table {table}: {e}")
    
    await db.commit()
    logger.info("Data cleared successfully")


async def seed_payment_methods(db: AsyncSession, user_id: str):
    """Seed payment methods"""
    logger.info("Seeding payment methods...")
    
    payment_methods = [
        {'name': 'Cash', 'type': 'Cash', 'is_active': True},
        {'name': 'Credit Card', 'type': 'Card', 'is_active': True},
        {'name': 'Debit Card', 'type': 'Card', 'is_active': True},
        {'name': 'Mobile Payment', 'type': 'Mobile', 'is_active': True},
    ]
    
    for pm in payment_methods:
        await db.execute(text("""
            INSERT INTO payment_methods (user_id, name, type, is_active, created_at)
            VALUES (:user_id, :name, :type, :is_active, :created_at)
        """), {
            'user_id': user_id,
            'name': pm['name'],
            'type': pm['type'],
            'is_active': pm['is_active'],
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    
    await db.commit()
    logger.info(f"Seeded {len(payment_methods)} payment methods")


async def seed_products(db: AsyncSession, user_id: str):
    """Seed products"""
    logger.info("Seeding products...")
    
    products = [
        {'sku': 'PROD-001', 'name': 'Fresh Milk 1L', 'category': 'Dairy', 'cost_price': 1.50, 'sell_price': 2.99, 'quantity': 150, 'low_stock_threshold': 20},
        {'sku': 'PROD-002', 'name': 'Whole Wheat Bread', 'category': 'Bakery', 'cost_price': 1.20, 'sell_price': 2.49, 'quantity': 80, 'low_stock_threshold': 15},
        {'sku': 'PROD-003', 'name': 'Organic Eggs (12)', 'category': 'Dairy', 'cost_price': 3.00, 'sell_price': 5.99, 'quantity': 60, 'low_stock_threshold': 10},
        {'sku': 'PROD-004', 'name': 'Bananas (1kg)', 'category': 'Fruits', 'cost_price': 1.00, 'sell_price': 1.99, 'quantity': 200, 'low_stock_threshold': 30},
        {'sku': 'PROD-005', 'name': 'Tomatoes (1kg)', 'category': 'Vegetables', 'cost_price': 1.50, 'sell_price': 2.99, 'quantity': 120, 'low_stock_threshold': 20},
        {'sku': 'PROD-006', 'name': 'Chicken Breast (1kg)', 'category': 'Meat', 'cost_price': 5.00, 'sell_price': 9.99, 'quantity': 45, 'low_stock_threshold': 10},
        {'sku': 'PROD-007', 'name': 'Rice (5kg)', 'category': 'Grains', 'cost_price': 8.00, 'sell_price': 14.99, 'quantity': 90, 'low_stock_threshold': 15},
        {'sku': 'PROD-008', 'name': 'Olive Oil (1L)', 'category': 'Cooking', 'cost_price': 6.00, 'sell_price': 11.99, 'quantity': 70, 'low_stock_threshold': 10},
        {'sku': 'PROD-009', 'name': 'Orange Juice (1L)', 'category': 'Beverages', 'cost_price': 2.00, 'sell_price': 3.99, 'quantity': 100, 'low_stock_threshold': 20},
        {'sku': 'PROD-010', 'name': 'Coffee Beans (500g)', 'category': 'Beverages', 'cost_price': 7.00, 'sell_price': 12.99, 'quantity': 55, 'low_stock_threshold': 10},
        {'sku': 'PROD-011', 'name': 'Pasta (500g)', 'category': 'Grains', 'cost_price': 1.50, 'sell_price': 2.99, 'quantity': 130, 'low_stock_threshold': 25},
        {'sku': 'PROD-012', 'name': 'Cheddar Cheese (200g)', 'category': 'Dairy', 'cost_price': 3.00, 'sell_price': 5.99, 'quantity': 65, 'low_stock_threshold': 15},
        {'sku': 'PROD-013', 'name': 'Apples (1kg)', 'category': 'Fruits', 'cost_price': 1.80, 'sell_price': 3.49, 'quantity': 180, 'low_stock_threshold': 30},
        {'sku': 'PROD-014', 'name': 'Potatoes (2kg)', 'category': 'Vegetables', 'cost_price': 2.00, 'sell_price': 3.99, 'quantity': 150, 'low_stock_threshold': 25},
        {'sku': 'PROD-015', 'name': 'Salmon Fillet (500g)', 'category': 'Seafood', 'cost_price': 8.00, 'sell_price': 15.99, 'quantity': 30, 'low_stock_threshold': 8},
        {'sku': 'PROD-016', 'name': 'Yogurt (500g)', 'category': 'Dairy', 'cost_price': 2.00, 'sell_price': 3.99, 'quantity': 95, 'low_stock_threshold': 20},
        {'sku': 'PROD-017', 'name': 'Carrots (1kg)', 'category': 'Vegetables', 'cost_price': 1.20, 'sell_price': 2.49, 'quantity': 140, 'low_stock_threshold': 25},
        {'sku': 'PROD-018', 'name': 'Honey (500g)', 'category': 'Condiments', 'cost_price': 5.00, 'sell_price': 9.99, 'quantity': 50, 'low_stock_threshold': 10},
        {'sku': 'PROD-019', 'name': 'Green Tea (100 bags)', 'category': 'Beverages', 'cost_price': 4.00, 'sell_price': 7.99, 'quantity': 75, 'low_stock_threshold': 15},
        {'sku': 'PROD-020', 'name': 'Chocolate Bar', 'category': 'Snacks', 'cost_price': 1.00, 'sell_price': 1.99, 'quantity': 200, 'low_stock_threshold': 40},
        {'sku': 'PROD-021', 'name': 'Mineral Water (1.5L)', 'category': 'Beverages', 'cost_price': 0.50, 'sell_price': 1.29, 'quantity': 250, 'low_stock_threshold': 50},
        {'sku': 'PROD-022', 'name': 'Butter (250g)', 'category': 'Dairy', 'cost_price': 2.50, 'sell_price': 4.99, 'quantity': 70, 'low_stock_threshold': 15},
        {'sku': 'PROD-023', 'name': 'Onions (1kg)', 'category': 'Vegetables', 'cost_price': 1.00, 'sell_price': 1.99, 'quantity': 160, 'low_stock_threshold': 30},
        {'sku': 'PROD-024', 'name': 'Beef Steak (500g)', 'category': 'Meat', 'cost_price': 7.00, 'sell_price': 13.99, 'quantity': 40, 'low_stock_threshold': 10},
        {'sku': 'PROD-025', 'name': 'Soy Sauce (500ml)', 'category': 'Condiments', 'cost_price': 2.00, 'sell_price': 3.99, 'quantity': 85, 'low_stock_threshold': 15},
        {'sku': 'PROD-026', 'name': 'Cereal (500g)', 'category': 'Breakfast', 'cost_price': 3.00, 'sell_price': 5.99, 'quantity': 90, 'low_stock_threshold': 20},
        {'sku': 'PROD-027', 'name': 'Peanut Butter (400g)', 'category': 'Spreads', 'cost_price': 3.50, 'sell_price': 6.99, 'quantity': 60, 'low_stock_threshold': 12},
        {'sku': 'PROD-028', 'name': 'Strawberries (500g)', 'category': 'Fruits', 'cost_price': 3.00, 'sell_price': 5.99, 'quantity': 45, 'low_stock_threshold': 10},
        {'sku': 'PROD-029', 'name': 'Ice Cream (1L)', 'category': 'Frozen', 'cost_price': 4.00, 'sell_price': 7.99, 'quantity': 55, 'low_stock_threshold': 12},
        {'sku': 'PROD-030', 'name': 'Frozen Pizza', 'category': 'Frozen', 'cost_price': 3.50, 'sell_price': 6.99, 'quantity': 65, 'low_stock_threshold': 15},
    ]
    
    for product in products:
        await db.execute(text("""
            INSERT INTO products (user_id, sku, name, category, cost_price, sell_price, quantity, low_stock_threshold, created_at)
            VALUES (:user_id, :sku, :name, :category, :cost_price, :sell_price, :quantity, :low_stock_threshold, :created_at)
        """), {
            'user_id': user_id,
            **product,
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    
    await db.commit()
    logger.info(f"Seeded {len(products)} products")


async def seed_customers(db: AsyncSession, user_id: str):
    """Seed customers"""
    logger.info("Seeding customers...")
    
    customers = [
        {'customer_code': 'CUST-001', 'name': 'John Smith', 'email': 'john.smith@email.com', 'phone': '+1-555-0101', 'address': '123 Main St, City', 'membership_tier': 'Gold', 'loyalty_points': 850, 'total_purchases': 2500.00, 'status': 'Active'},
        {'customer_code': 'CUST-002', 'name': 'Sarah Johnson', 'email': 'sarah.j@email.com', 'phone': '+1-555-0102', 'address': '456 Oak Ave, Town', 'membership_tier': 'Platinum', 'loyalty_points': 1200, 'total_purchases': 4200.00, 'status': 'Active'},
        {'customer_code': 'CUST-003', 'name': 'Michael Brown', 'email': 'mbrown@email.com', 'phone': '+1-555-0103', 'address': '789 Pine Rd, Village', 'membership_tier': 'Silver', 'loyalty_points': 450, 'total_purchases': 1200.00, 'status': 'Active'},
        {'customer_code': 'CUST-004', 'name': 'Emily Davis', 'email': 'emily.d@email.com', 'phone': '+1-555-0104', 'address': '321 Elm St, City', 'membership_tier': 'Bronze', 'loyalty_points': 180, 'total_purchases': 550.00, 'status': 'Active'},
        {'customer_code': 'CUST-005', 'name': 'David Wilson', 'email': 'dwilson@email.com', 'phone': '+1-555-0105', 'address': '654 Maple Dr, Town', 'membership_tier': 'Gold', 'loyalty_points': 720, 'total_purchases': 2100.00, 'status': 'Active'},
        {'customer_code': 'CUST-006', 'name': 'Lisa Anderson', 'email': 'lisa.a@email.com', 'phone': '+1-555-0106', 'address': '987 Cedar Ln, Village', 'membership_tier': 'Silver', 'loyalty_points': 380, 'total_purchases': 980.00, 'status': 'Active'},
        {'customer_code': 'CUST-007', 'name': 'Robert Taylor', 'email': 'rtaylor@email.com', 'phone': '+1-555-0107', 'address': '147 Birch St, City', 'membership_tier': 'Bronze', 'loyalty_points': 120, 'total_purchases': 350.00, 'status': 'Active'},
        {'customer_code': 'CUST-008', 'name': 'Jennifer Martinez', 'email': 'jmartinez@email.com', 'phone': '+1-555-0108', 'address': '258 Spruce Ave, Town', 'membership_tier': 'Platinum', 'loyalty_points': 1500, 'total_purchases': 5200.00, 'status': 'Active'},
        {'customer_code': 'CUST-009', 'name': 'William Garcia', 'email': 'wgarcia@email.com', 'phone': '+1-555-0109', 'address': '369 Willow Rd, Village', 'membership_tier': 'Gold', 'loyalty_points': 650, 'total_purchases': 1900.00, 'status': 'Active'},
        {'customer_code': 'CUST-010', 'name': 'Mary Rodriguez', 'email': 'mrodriguez@email.com', 'phone': '+1-555-0110', 'address': '741 Ash Dr, City', 'membership_tier': 'Silver', 'loyalty_points': 420, 'total_purchases': 1150.00, 'status': 'Active'},
        {'customer_code': 'CUST-011', 'name': 'James Lee', 'email': 'jlee@email.com', 'phone': '+1-555-0111', 'address': '852 Poplar Ln, Town', 'membership_tier': 'Bronze', 'loyalty_points': 95, 'total_purchases': 280.00, 'status': 'Active'},
        {'customer_code': 'CUST-012', 'name': 'Patricia White', 'email': 'pwhite@email.com', 'phone': '+1-555-0112', 'address': '963 Hickory St, Village', 'membership_tier': 'Gold', 'loyalty_points': 890, 'total_purchases': 2800.00, 'status': 'Active'},
        {'customer_code': 'CUST-013', 'name': 'Christopher Harris', 'email': 'charris@email.com', 'phone': '+1-555-0113', 'address': '159 Walnut Ave, City', 'membership_tier': 'Silver', 'loyalty_points': 340, 'total_purchases': 890.00, 'status': 'Active'},
        {'customer_code': 'CUST-014', 'name': 'Linda Clark', 'email': 'lclark@email.com', 'phone': '+1-555-0114', 'address': '357 Chestnut Rd, Town', 'membership_tier': 'Bronze', 'loyalty_points': 150, 'total_purchases': 420.00, 'status': 'Active'},
        {'customer_code': 'CUST-015', 'name': 'Daniel Lewis', 'email': 'dlewis@email.com', 'phone': '+1-555-0115', 'address': '486 Sycamore Dr, Village', 'membership_tier': 'Platinum', 'loyalty_points': 1350, 'total_purchases': 4800.00, 'status': 'Active'},
    ]
    
    for customer in customers:
        await db.execute(text("""
            INSERT INTO customers (user_id, customer_code, name, email, phone, address, membership_tier, loyalty_points, total_purchases, status, created_at)
            VALUES (:user_id, :customer_code, :name, :email, :phone, :address, :membership_tier, :loyalty_points, :total_purchases, :status, :created_at)
        """), {
            'user_id': user_id,
            **customer,
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    
    await db.commit()
    logger.info(f"Seeded {len(customers)} customers")


async def seed_employees(db: AsyncSession, user_id: str):
    """Seed employees"""
    logger.info("Seeding employees...")
    
    employees = [
        {'employee_code': 'EMP-001', 'name': 'Alice Cooper', 'email': 'alice.c@company.com', 'phone': '+1-555-0201', 'position': 'Store Manager', 'department': 'Management', 'hire_date': '2020-01-15 00:00:00', 'salary': 55000, 'status': 'Active'},
        {'employee_code': 'EMP-002', 'name': 'Bob Turner', 'email': 'bob.t@company.com', 'phone': '+1-555-0202', 'position': 'Assistant Manager', 'department': 'Management', 'hire_date': '2020-06-01 00:00:00', 'salary': 45000, 'status': 'Active'},
        {'employee_code': 'EMP-003', 'name': 'Carol King', 'email': 'carol.k@company.com', 'phone': '+1-555-0203', 'position': 'Cashier', 'department': 'Sales', 'hire_date': '2021-03-10 00:00:00', 'salary': 28000, 'status': 'Active'},
        {'employee_code': 'EMP-004', 'name': 'David Miller', 'email': 'david.m@company.com', 'phone': '+1-555-0204', 'position': 'Cashier', 'department': 'Sales', 'hire_date': '2021-07-20 00:00:00', 'salary': 28000, 'status': 'Active'},
        {'employee_code': 'EMP-005', 'name': 'Emma Scott', 'email': 'emma.s@company.com', 'phone': '+1-555-0205', 'position': 'Stock Clerk', 'department': 'Inventory', 'hire_date': '2022-01-05 00:00:00', 'salary': 26000, 'status': 'Active'},
        {'employee_code': 'EMP-006', 'name': 'Frank Adams', 'email': 'frank.a@company.com', 'phone': '+1-555-0206', 'position': 'Stock Clerk', 'department': 'Inventory', 'hire_date': '2022-04-12 00:00:00', 'salary': 26000, 'status': 'Active'},
        {'employee_code': 'EMP-007', 'name': 'Grace Nelson', 'email': 'grace.n@company.com', 'phone': '+1-555-0207', 'position': 'Accountant', 'department': 'Finance', 'hire_date': '2020-09-01 00:00:00', 'salary': 48000, 'status': 'Active'},
        {'employee_code': 'EMP-008', 'name': 'Henry Baker', 'email': 'henry.b@company.com', 'phone': '+1-555-0208', 'position': 'Security Guard', 'department': 'Security', 'hire_date': '2021-11-15 00:00:00', 'salary': 32000, 'status': 'Active'},
        {'employee_code': 'EMP-009', 'name': 'Iris Carter', 'email': 'iris.c@company.com', 'phone': '+1-555-0209', 'position': 'Cashier', 'department': 'Sales', 'hire_date': '2023-02-01 00:00:00', 'salary': 28000, 'status': 'Active'},
        {'employee_code': 'EMP-010', 'name': 'Jack Phillips', 'email': 'jack.p@company.com', 'phone': '+1-555-0210', 'position': 'Delivery Driver', 'department': 'Logistics', 'hire_date': '2022-08-20 00:00:00', 'salary': 35000, 'status': 'Active'},
    ]
    
    for employee in employees:
        await db.execute(text("""
            INSERT INTO employees (user_id, employee_code, name, email, phone, position, department, hire_date, salary, status, created_at)
            VALUES (:user_id, :employee_code, :name, :email, :phone, :position, :department, :hire_date, :salary, :status, :created_at)
        """), {
            'user_id': user_id,
            **employee,
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    
    await db.commit()
    logger.info(f"Seeded {len(employees)} employees")


async def seed_suppliers(db: AsyncSession, user_id: str):
    """Seed suppliers"""
    logger.info("Seeding suppliers...")
    
    suppliers = [
        {'supplier_code': 'SUP-001', 'name': 'Fresh Farms Co.', 'contact_person': 'Tom Green', 'email': 'tom@freshfarms.com', 'phone': '+1-555-0301', 'address': '100 Farm Road, Countryside', 'payment_terms': 'Net 30', 'status': 'Active'},
        {'supplier_code': 'SUP-002', 'name': 'Dairy Delights Inc.', 'contact_person': 'Mary White', 'email': 'mary@dairydelights.com', 'phone': '+1-555-0302', 'address': '200 Milk Lane, Dairy Town', 'payment_terms': 'Net 30', 'status': 'Active'},
        {'supplier_code': 'SUP-003', 'name': 'Meat Masters Ltd.', 'contact_person': 'John Butcher', 'email': 'john@meatmasters.com', 'phone': '+1-555-0303', 'address': '300 Butcher Street, Meat City', 'payment_terms': 'Net 15', 'status': 'Active'},
        {'supplier_code': 'SUP-004', 'name': 'Beverage Bros.', 'contact_person': 'Sam Drinks', 'email': 'sam@beveragebros.com', 'phone': '+1-555-0304', 'address': '400 Drink Avenue, Beverage Town', 'payment_terms': 'Net 30', 'status': 'Active'},
        {'supplier_code': 'SUP-005', 'name': 'Grain Growers Co-op', 'contact_person': 'Lisa Fields', 'email': 'lisa@graingrowers.com', 'phone': '+1-555-0305', 'address': '500 Grain Road, Harvest Valley', 'payment_terms': 'Net 45', 'status': 'Active'},
        {'supplier_code': 'SUP-006', 'name': 'Seafood Specialists', 'contact_person': 'Mike Ocean', 'email': 'mike@seafoodspec.com', 'phone': '+1-555-0306', 'address': '600 Harbor Drive, Coastal City', 'payment_terms': 'Net 15', 'status': 'Active'},
        {'supplier_code': 'SUP-007', 'name': 'Bakery Supplies Inc.', 'contact_person': 'Betty Baker', 'email': 'betty@bakerysupplies.com', 'phone': '+1-555-0307', 'address': '700 Flour Street, Bakery Town', 'payment_terms': 'Net 30', 'status': 'Active'},
        {'supplier_code': 'SUP-008', 'name': 'Frozen Foods Warehouse', 'contact_person': 'Frank Freeze', 'email': 'frank@frozenfoods.com', 'phone': '+1-555-0308', 'address': '800 Cold Storage Rd, Freezer City', 'payment_terms': 'Net 30', 'status': 'Active'},
    ]
    
    for supplier in suppliers:
        await db.execute(text("""
            INSERT INTO suppliers (user_id, supplier_code, name, contact_person, email, phone, address, payment_terms, status, created_at)
            VALUES (:user_id, :supplier_code, :name, :contact_person, :email, :phone, :address, :payment_terms, :status, :created_at)
        """), {
            'user_id': user_id,
            **supplier,
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    
    await db.commit()
    logger.info(f"Seeded {len(suppliers)} suppliers")


async def seed_sales_transactions(db: AsyncSession, user_id: str):
    """Seed sample sales transactions"""
    logger.info("Seeding sales transactions...")
    
    # Get product IDs
    result = await db.execute(text("SELECT id, sell_price FROM products LIMIT 30"))
    products = result.fetchall()
    
    # Get customer IDs
    result = await db.execute(text("SELECT id FROM customers LIMIT 15"))
    customers = result.fetchall()
    
    if not products or not customers:
        logger.warning("No products or customers found, skipping sales seeding")
        return
    
    payment_methods = ['Cash', 'Credit Card', 'Debit Card', 'Mobile Payment']
    
    # Create 50 sales transactions over the last 30 days
    num_sales = 50
    for i in range(num_sales):
        # Random date in last 30 days
        days_ago = random.randint(0, 30)
        sale_date = datetime.now() - timedelta(days=days_ago)
        sale_datetime = sale_date.strftime('%Y-%m-%d %H:%M:%S')
        
        # Random customer (80% chance) or walk-in
        customer_id = random.choice(customers)[0] if random.random() < 0.8 else None
        
        # Random payment method
        payment_method = random.choice(payment_methods)
        
        # Random number of items (1-5)
        num_items = random.randint(1, 5)
        selected_products = random.sample(products, min(num_items, len(products)))
        
        # Calculate total
        subtotal = 0
        for product in selected_products:
            quantity = random.randint(1, 3)
            subtotal += product[1] * quantity
        
        tax_amount = subtotal * 0.15
        total_amount = subtotal + tax_amount
        
        # Create sale
        result = await db.execute(text("""
            INSERT INTO sales (user_id, sale_date, total_amount, cashier_name, customer_id, payment_method, tax_amount, created_at)
            VALUES (:user_id, :sale_date, :total_amount, :cashier_name, :customer_id, :payment_method, :tax_amount, :created_at)
            RETURNING id
        """), {
            'user_id': user_id,
            'sale_date': sale_datetime,
            'total_amount': total_amount,
            'cashier_name': random.choice(['Alice Cooper', 'Carol King', 'David Miller', 'Iris Carter']),
            'customer_id': customer_id,
            'payment_method': payment_method,
            'tax_amount': tax_amount,
            'created_at': sale_datetime
        })
        sale_id = result.fetchone()[0]
        
        # Create sale items
        for product in selected_products:
            quantity = random.randint(1, 3)
            price = product[1]
            total_price = price * quantity
            
            # Get product name
            prod_result = await db.execute(text("SELECT name FROM products WHERE id = :id"), {'id': product[0]})
            product_name = prod_result.fetchone()[0]
            
            await db.execute(text("""
                INSERT INTO sale_items (user_id, sale_id, product_id, product_name, quantity, price, total_price, created_at)
                VALUES (:user_id, :sale_id, :product_id, :product_name, :quantity, :price, :total_price, :created_at)
            """), {
                'user_id': user_id,
                'sale_id': sale_id,
                'product_id': product[0],
                'product_name': product_name,
                'quantity': quantity,
                'price': price,
                'total_price': total_price,
                'created_at': sale_datetime
            })
        
        # Create receipt
        receipt_number = f"RCP-{int(sale_date.timestamp())}-{i}"
        await db.execute(text("""
            INSERT INTO receipts (user_id, receipt_number, sale_id, customer_id, total_amount, payment_method, cashier_name, receipt_date, created_at)
            VALUES (:user_id, :receipt_number, :sale_id, :customer_id, :total_amount, :payment_method, :cashier_name, :receipt_date, :created_at)
        """), {
            'user_id': user_id,
            'receipt_number': receipt_number,
            'sale_id': sale_id,
            'customer_id': customer_id,
            'total_amount': total_amount,
            'payment_method': payment_method,
            'cashier_name': random.choice(['Alice Cooper', 'Carol King', 'David Miller', 'Iris Carter']),
            'receipt_date': sale_datetime,
            'created_at': sale_datetime
        })
    
    await db.commit()
    logger.info(f"Seeded {num_sales} sales transactions")


async def seed_purchase_orders(db: AsyncSession, user_id: str):
    """Seed sample purchase orders"""
    logger.info("Seeding purchase orders...")
    
    # Get supplier IDs
    result = await db.execute(text("SELECT id, name FROM suppliers LIMIT 8"))
    suppliers = result.fetchall()
    
    # Get product IDs
    result = await db.execute(text("SELECT id, name, cost_price FROM products LIMIT 30"))
    products = result.fetchall()
    
    if not suppliers or not products:
        logger.warning("No suppliers or products found, skipping purchase orders seeding")
        return
    
    # Create 15 purchase orders over the last 60 days
    num_pos = 15
    for i in range(num_pos):
        days_ago = random.randint(0, 60)
        order_date = datetime.now() - timedelta(days=days_ago)
        expected_delivery = order_date + timedelta(days=random.randint(7, 21))
        
        order_datetime = order_date.strftime('%Y-%m-%d %H:%M:%S')
        delivery_datetime = expected_delivery.strftime('%Y-%m-%d %H:%M:%S')
        
        # Random supplier
        supplier = random.choice(suppliers)
        
        # Random number of items (2-6)
        num_items = random.randint(2, 6)
        selected_products = random.sample(products, min(num_items, len(products)))
        
        # Calculate total
        total_amount = 0
        for product in selected_products:
            quantity = random.randint(20, 100)
            total_amount += product[2] * quantity
        
        # Determine status
        if days_ago > 30:
            status = 'Received'
        elif days_ago > 15:
            status = random.choice(['Received', 'Pending'])
        else:
            status = 'Pending'
        
        # Create purchase order
        po_number = f"PO-{int(order_date.timestamp())}-{i}"
        result = await db.execute(text("""
            INSERT INTO purchase_orders (user_id, po_number, supplier_id, supplier_name, order_date, expected_delivery, total_amount, status, created_by, created_at)
            VALUES (:user_id, :po_number, :supplier_id, :supplier_name, :order_date, :expected_delivery, :total_amount, :status, :created_by, :created_at)
            RETURNING id
        """), {
            'user_id': user_id,
            'po_number': po_number,
            'supplier_id': supplier[0],
            'supplier_name': supplier[1],
            'order_date': order_datetime,
            'expected_delivery': delivery_datetime,
            'total_amount': total_amount,
            'status': status,
            'created_by': 'Alice Cooper',
            'created_at': order_datetime
        })
        po_id = result.fetchone()[0]
        
        # Create purchase order items
        for product in selected_products:
            quantity = random.randint(20, 100)
            unit_price = product[2]
            total_price = unit_price * quantity
            received_quantity = quantity if status == 'Received' else 0
            
            await db.execute(text("""
                INSERT INTO purchase_order_items (user_id, po_id, product_id, product_name, quantity, unit_price, total_price, received_quantity, created_at)
                VALUES (:user_id, :po_id, :product_id, :product_name, :quantity, :unit_price, :total_price, :received_quantity, :created_at)
            """), {
                'user_id': user_id,
                'po_id': po_id,
                'product_id': product[0],
                'product_name': product[1],
                'quantity': quantity,
                'unit_price': unit_price,
                'total_price': total_price,
                'received_quantity': received_quantity,
                'created_at': order_datetime
            })
    
    await db.commit()
    logger.info(f"Seeded {num_pos} purchase orders")


async def main():
    """Main seeding function"""
    logger.info("Starting database seeding...")
    
    # Use a system user ID for seeding
    user_id = "system"
    
    async for db in get_db():
        try:
            # Clear existing data
            await clear_all_data(db)
            
            # Seed data in order
            await seed_payment_methods(db, user_id)
            await seed_products(db, user_id)
            await seed_customers(db, user_id)
            await seed_employees(db, user_id)
            await seed_suppliers(db, user_id)
            await seed_sales_transactions(db, user_id)
            await seed_purchase_orders(db, user_id)
            
            logger.info("✅ Database seeding completed successfully!")
            
        except Exception as e:
            logger.error(f"❌ Error during seeding: {e}")
            await db.rollback()
            raise
        finally:
            await db.close()


if __name__ == "__main__":
    asyncio.run(main())