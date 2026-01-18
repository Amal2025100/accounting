# Smart Supermarket - AI-Powered Management System

A professional, enterprise-grade supermarket management system built with modern web technologies, featuring AI-powered analytics, multi-user role management, and comprehensive business intelligence tools.

![Smart Supermarket Dashboard](https://mgx-backend-cdn.metadl.com/generate/images/904185/2026-01-14/04d93b05-abd0-4df5-ba4e-979f66c3f2c5.png)

## 🌟 Features

### Core Modules

1. **Dashboard**
   - Real-time business metrics and KPIs
   - Sales and profit trend visualization
   - Recent transactions overview
   - AI-generated alerts and notifications
   - Top-performing products analysis

2. **Sales Management**
   - Transaction history with detailed breakdowns
   - Daily, weekly, and monthly sales trends
   - Average transaction value tracking
   - Revenue growth analytics
   - Export capabilities for reports

3. **Inventory Management**
   - Complete product catalog with search and filtering
   - Real-time stock level monitoring
   - Low-stock alerts with risk indicators
   - Category-based organization
   - Inventory value calculations
   - Cost and sell price tracking

4. **Accounting Module**
   - Balance sheet with asset, liability, and equity tracking
   - Income statement with revenue and expense breakdown
   - Journal entries with double-entry bookkeeping
   - Account balances and financial ratios
   - Visual financial data representation

5. **AI Analytics** 🤖
   - Sales forecasting with confidence intervals
   - Profit predictions using machine learning
   - Cash flow projections
   - Anomaly detection for unusual transactions
   - Smart recommendations for business optimization
   - Risk scoring for critical alerts

6. **Reports Center**
   - Customizable report generation
   - Multiple report types (daily summary, sales, inventory, financial)
   - Date range selection
   - Visual data presentation with charts
   - Export functionality (PDF/Excel ready)

7. **User Management** (Manager Only)
   - User list with role assignments
   - Permission management
   - Activity tracking
   - Role-based access control

### Multi-User Role System

#### 👨‍💼 Manager
- **Full System Access**
- User management and permissions
- All financial reports and analytics
- AI analytics and predictions
- System configuration

#### 👨‍💻 Accountant
- Accounting module access
- Financial reports and statements
- AI analytics viewing
- Sales and inventory viewing (read-only)
- Report generation

#### 👨‍💼 Cashier
- Sales processing
- Inventory viewing (read-only)
- Basic reports
- Limited dashboard access

## 🎨 Design Features

- **Modern Dark Theme** - Professional dark mode interface with vibrant accent colors
- **Responsive Design** - Fully responsive across desktop, tablet, and mobile devices
- **Smooth Animations** - Polished transitions and micro-interactions
- **Data Visualization** - Interactive charts using Recharts library
- **Premium UI Components** - Built with shadcn-ui component library
- **Accessible** - WCAG compliant with proper contrast and semantic markup

## 🚀 Technology Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn-ui components
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd /workspace/app/frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

4. **Build for production**
   ```bash
   pnpm run build
   ```

5. **Preview production build**
   ```bash
   pnpm run preview
   ```

## 🔐 Demo Credentials

The system includes three demo accounts for testing different user roles:

| Role | Username | Password |
|------|----------|----------|
| Manager | `admin` | `demo123` |
| Accountant | `accountant1` | `demo123` |
| Cashier | `cashier1` | `demo123` |

## 📊 Sample Data

The system includes comprehensive sample data:
- **15 Products** across multiple categories (Dairy, Bakery, Beverages, Snacks, Produce, Meat, Groceries)
- **Recent Sales Transactions** with detailed item breakdowns
- **7 Days of Daily Summaries** with sales, expenses, and profit data
- **12 Accounts** covering assets, liabilities, equity, revenue, and expenses
- **Journal Entries** demonstrating double-entry bookkeeping
- **AI Predictions** for sales, profit, and cash flow
- **AI Alerts** for stock levels, anomalies, and financial risks

## 🔮 Future Database Integration

### Connecting to SQL Server (SmartSupermarketDB)

To integrate with your existing SQL Server database:

#### Option 1: Node.js Backend (Recommended)

1. **Create a REST API backend**
   ```bash
   npm init -y
   npm install express mssql cors dotenv
   ```

2. **Database connection example**
   ```javascript
   const sql = require('mssql');
   
   const config = {
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     server: process.env.DB_SERVER,
     database: 'SmartSupermarketDB',
     options: {
       encrypt: true,
       trustServerCertificate: true
     }
   };
   
   async function getProducts() {
     const pool = await sql.connect(config);
     const result = await pool.request()
       .query('SELECT * FROM Accounting.Inventory');
     return result.recordset;
   }
   ```

3. **Create API endpoints**
   - `GET /api/products` - Fetch inventory
   - `GET /api/sales` - Fetch sales data
   - `GET /api/accounts` - Fetch account balances
   - `GET /api/ai/alerts` - Fetch AI alerts
   - `POST /api/sales` - Create new sale
   - `PUT /api/products/:id` - Update product

4. **Update frontend to use API**
   Replace mock data imports with API calls:
   ```typescript
   const response = await fetch('http://localhost:3000/api/products');
   const products = await response.json();
   ```

#### Option 2: Python Backend (Flask/FastAPI)

1. **Install dependencies**
   ```bash
   pip install flask pyodbc flask-cors
   ```

2. **Database connection**
   ```python
   import pyodbc
   
   conn = pyodbc.connect(
       'DRIVER={SQL Server};'
       'SERVER=your_server;'
       'DATABASE=SmartSupermarketDB;'
       'UID=your_user;'
       'PWD=your_password'
   )
   ```

3. **Create Flask routes**
   ```python
   @app.route('/api/products')
   def get_products():
       cursor = conn.cursor()
       cursor.execute('SELECT * FROM Accounting.Inventory')
       products = cursor.fetchall()
       return jsonify(products)
   ```

#### Required Environment Variables

Create a `.env` file:
```env
DB_SERVER=your_server_address
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=SmartSupermarketDB
API_PORT=3000
```

#### Security Considerations

- Use JWT tokens for authentication
- Implement rate limiting
- Validate all inputs
- Use prepared statements to prevent SQL injection
- Enable CORS only for trusted origins
- Store credentials in environment variables
- Use HTTPS in production

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── MetricCard.tsx  # KPI metric display
│   └── RoleGuard.tsx   # Permission checking
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state
├── lib/                # Utilities and helpers
│   ├── mockData.ts     # Sample data
│   └── utils.ts        # Helper functions
├── pages/              # Page components
│   ├── Login.tsx       # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Sales.tsx       # Sales management
│   ├── Inventory.tsx   # Inventory management
│   ├── Accounting.tsx  # Accounting module
│   ├── AIAnalytics.tsx # AI predictions
│   ├── Reports.tsx     # Report generation
│   └── Users.tsx       # User management
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Root component with routing
└── main.tsx            # Application entry point
```

## 🎯 Key Features Implementation

### Role-Based Access Control
```typescript
// Using RoleGuard component
<RoleGuard allowedRoles={['Manager', 'Accountant']}>
  <AccountingModule />
</RoleGuard>
```

### AI Predictions
- Sales forecasting using historical data trends
- Profit predictions with confidence intervals
- Cash flow projections for liquidity management
- Anomaly detection for unusual patterns

### Data Visualization
- Interactive line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Area charts for cumulative data

## 🔧 Customization

### Changing Colors
Edit `src/index.css` to modify the color scheme:
```css
:root {
  --primary: #3B82F6;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
}
```

### Adding New Modules
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/Layout.tsx`
4. Update role permissions if needed

### Modifying Sample Data
Edit `src/lib/mockData.ts` to customize:
- Products and categories
- Sales transactions
- Account structures
- AI predictions

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a demo project built for Eng. Malak. For production use:
1. Replace mock data with real database connections
2. Implement proper authentication with JWT
3. Add input validation and error handling
4. Set up proper logging and monitoring
5. Implement data backup strategies

## 📄 License

This project is created as a demonstration system. Please consult with your organization regarding licensing for production use.

## 👨‍💻 Developer

Built with ❤️ by **Alex** on the Atoms platform for **Eng. Malak**

## 🙏 Acknowledgments

- shadcn-ui for the beautiful component library
- Recharts for data visualization
- Lucide for icons
- Tailwind CSS for styling utilities

---

**Note**: This is a demonstration system with sample data. For production use, integrate with your SmartSupermarketDB database following the integration guide above.

For questions or support, please refer to the Atoms documentation at https://docs.atoms.dev