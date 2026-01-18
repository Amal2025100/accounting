# Smart Supermarket Management System - Quick Start Guide

## 🚀 Ready-to-Run Package

This package contains everything you need to run the Smart Supermarket Management System on your computer.

## 📦 Package Contents

```
smart-supermarket-complete.zip
├── app/
│   ├── frontend/          # React application (ready to run)
│   ├── backend/           # FastAPI backend (Atoms Backend integrated)
│   └── start_app_v2.sh    # Startup script
├── README.md              # Project overview
├── DEPLOYMENT_GUIDE.md    # Detailed deployment instructions
├── DATABASE_SCHEMA.md     # Database documentation
└── QUICK_START.md         # This file
```

## ⚡ Quick Start (3 Steps)

### Step 1: Extract the Package

```bash
# Extract the zip file
unzip smart-supermarket-complete.zip
cd app
```

### Step 2: Start the Application

The system uses Atoms Backend which is already configured and running. You only need to start the frontend:

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
pnpm install

# Start the application
pnpm run dev
```

**That's it!** The application will open automatically in your browser at `http://localhost:5173`

### Step 3: Login

Use one of these demo accounts:

**Manager (Full Access):**
- Username: `admin`
- Password: `demo123`

**Accountant:**
- Username: `accountant1`
- Password: `demo123`

**Cashier:**
- Username: `cashier1`
- Password: `demo123`

**Inventory Manager:**
- Username: `inventory1`
- Password: `demo123`

## 🎯 What You Get

### Immediate Access to 13 Modules:

1. **Dashboard** - Real-time business metrics
2. **POS** - Point of sale terminal
3. **Sales** - Transaction management
4. **Inventory** - Stock control
5. **Suppliers** - Vendor management
6. **Purchase Orders** - Procurement
7. **Customers** - CRM system
8. **Employees** - HR management
9. **Accounting** - Financial records
10. **AI Analytics** - Business insights
11. **Reports** - Standard reporting
12. **Advanced Reports** - Comprehensive analytics
13. **Users** - System administration

### Pre-configured Features:

✅ **Database**: Atoms Backend with 20+ tables and sample data
✅ **Authentication**: Secure login system ready to use
✅ **Sample Data**: Pre-loaded products, customers, sales
✅ **All Permissions**: Role-based access control configured
✅ **No Setup Required**: Everything works out of the box

## 💻 System Requirements

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **pnpm**: Latest version (install with `npm install -g pnpm`)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge
- **RAM**: 4GB minimum
- **Storage**: 2GB free space

## 🔧 Installation Check

Before starting, verify your system has the required software:

```bash
# Check Node.js version (should be 18+)
node --version

# Check pnpm (install if needed)
pnpm --version

# If pnpm is not installed:
npm install -g pnpm
```

## 📱 Accessing the System

Once started, the application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: Already running on Atoms Backend
- **API Docs**: Available through the application

## 🎨 What You Can Do Immediately

### As Manager (admin/demo123):
- View real-time dashboard with business metrics
- Process sales through POS terminal
- Manage inventory and stock levels
- Create purchase orders
- View comprehensive reports
- Manage customers and employees
- Access all system features

### As Accountant (accountant1/demo123):
- View financial reports
- Access accounting module
- Analyze customer data
- Generate advanced reports

### As Cashier (cashier1/demo123):
- Use POS system
- Process sales transactions
- View inventory
- Look up customer information

### As Inventory Manager (inventory1/demo123):
- Manage stock levels
- Create purchase orders
- Manage suppliers
- Track inventory movements

## 🛠️ Troubleshooting

### Issue: "pnpm: command not found"
**Solution**: Install pnpm globally
```bash
npm install -g pnpm
```

### Issue: "Port 5173 is already in use"
**Solution**: Kill the process using that port
```bash
# Find process
lsof -i :5173

# Kill it
kill -9 <PID>
```

### Issue: Application won't start
**Solution**: Clear cache and reinstall
```bash
cd app/frontend
rm -rf node_modules
pnpm install
pnpm run dev
```

### Issue: Login not working
**Solution**: 
1. Verify you're using the correct credentials
2. Check that Atoms Backend is active
3. Clear browser cache and try again

## 📚 Additional Documentation

For more detailed information, see:
- **README.md** - Complete project overview
- **DEPLOYMENT_GUIDE.md** - Advanced deployment options
- **DATABASE_SCHEMA.md** - Database structure details

## 🔐 Security Notes

**Important**: The demo credentials are for testing only. In a production environment:
1. Change all default passwords immediately
2. Use strong, unique passwords
3. Enable HTTPS
4. Configure proper firewall rules
5. Regular security audits

## 🎓 Learning the System

### Recommended Exploration Order:

1. **Start with Dashboard** - Get overview of the system
2. **Try POS** - Process a sample sale
3. **Check Inventory** - See stock levels
4. **View Reports** - Explore analytics
5. **Manage Customers** - Add a new customer
6. **Create Purchase Order** - Practice procurement workflow

## 💡 Tips for Best Experience

1. **Use Chrome or Firefox** for best compatibility
2. **Keep the terminal open** while using the application
3. **Don't close the browser tab** that opens automatically
4. **Explore all modules** to see full capabilities
5. **Check Advanced Reports** for comprehensive analytics

## 🆘 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review DEPLOYMENT_GUIDE.md for detailed instructions
3. Ensure all system requirements are met
4. Verify Node.js and pnpm are properly installed

## 📊 System Status Check

To verify everything is working:

1. ✅ Frontend loads at http://localhost:5173
2. ✅ Login page appears
3. ✅ Can login with demo credentials
4. ✅ Dashboard displays metrics
5. ✅ All modules are accessible based on role

## 🎉 You're Ready!

The Smart Supermarket Management System is now ready to use. Enjoy exploring all the features!

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: January 2026

**For immediate support or questions, refer to the documentation files included in this package.**