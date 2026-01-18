# Smart Supermarket Management System - Installation Guide

## 📦 Complete Ready-to-Run Package

This package contains the complete Smart Supermarket Management System with everything pre-configured.

## 🚀 Quick Installation (3 Steps)

### Prerequisites

Before starting, ensure you have:
- **Node.js** v18.0.0 or higher ([Download here](https://nodejs.org/))
- **pnpm** package manager (or npm/yarn)

**Check your installation:**
```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 8.0.0 or higher
```

**Install pnpm (if not already installed):**
```bash
npm install -g pnpm
```

---

### Step 1: Extract the Package

**On Windows:**
- Right-click `smart-supermarket-complete.tar.gz`
- Extract using 7-Zip or WinRAR
- Or use PowerShell: `tar -xzf smart-supermarket-complete.tar.gz`

**On Mac/Linux:**
```bash
tar -xzf smart-supermarket-complete.tar.gz
cd app
```

---

### Step 2: Install Dependencies

```bash
# Navigate to frontend directory
cd app/frontend

# Install all dependencies (this may take 2-3 minutes)
pnpm install
```

---

### Step 3: Start the Application

```bash
# Start the development server
pnpm run dev
```

**The application will automatically open in your browser at:**
`http://localhost:5173`

If it doesn't open automatically, manually navigate to `http://localhost:5173` in your browser.

---

## 🔑 Login Credentials

Use these demo accounts to access the system:

### Manager (Full Access to All 13 Modules)
- **Username:** `admin`
- **Password:** `demo123`
- **Access:** Dashboard, POS, Sales, Inventory, Suppliers, Purchase Orders, Customers, Employees, Accounting, AI Analytics, Reports, Advanced Reports, Users

### Accountant (Financial & Analytics)
- **Username:** `accountant1`
- **Password:** `demo123`
- **Access:** Dashboard, Sales, Customers, Accounting, AI Analytics, Reports, Advanced Reports

### Cashier (Sales Operations)
- **Username:** `cashier1`
- **Password:** `demo123`
- **Access:** Dashboard, POS, Sales, Inventory (read-only)

### Inventory Manager (Stock & Procurement)
- **Username:** `inventory1`
- **Password:** `demo123`
- **Access:** Dashboard, Inventory, Suppliers, Purchase Orders

### Report Viewer (Read-Only Analytics)
- **Username:** `viewer1`
- **Password:** `demo123`
- **Access:** Dashboard, Reports (read-only)

---

## ✅ Verify Installation

After starting the application, verify these:

1. ✅ Browser opens to `http://localhost:5173`
2. ✅ Login page displays correctly
3. ✅ Can login with any demo credential above
4. ✅ Dashboard shows real-time metrics
5. ✅ All modules are accessible based on your role
6. ✅ Sample data is visible (products, customers, sales)

---

## 🎯 What's Included

### 13 Complete Modules:
1. **Dashboard** - Real-time business KPIs and metrics
2. **POS** - Point of Sale terminal with barcode scanning
3. **Sales** - Transaction history and analytics
4. **Inventory** - Stock management with low stock alerts
5. **Suppliers** - Vendor relationship management
6. **Purchase Orders** - Procurement workflow automation
7. **Customers** - CRM with 4-tier loyalty program
8. **Employees** - HR management with shift tracking
9. **Accounting** - Financial transactions and bookkeeping
10. **AI Analytics** - Business insights and predictions
11. **Reports** - Standard reporting suite
12. **Advanced Reports** - Comprehensive analytics (5 report types)
13. **Users** - System administration and access control

### Pre-loaded Sample Data:
- ✅ 50+ products with inventory levels
- ✅ 20+ customers with purchase history
- ✅ 10+ employees with shift records
- ✅ 100+ sales transactions
- ✅ 30+ purchase orders
- ✅ Complete financial records

### Database:
- ✅ Atoms Backend with 20+ tables
- ✅ All relationships configured
- ✅ Sample data pre-populated
- ✅ No manual setup required

---

## 🛠️ Troubleshooting

### Issue: "node: command not found"
**Solution:** Install Node.js from https://nodejs.org/
```bash
# Verify installation
node --version
```

### Issue: "pnpm: command not found"
**Solution:** Install pnpm globally
```bash
npm install -g pnpm
```

### Issue: "Port 5173 is already in use"
**Solution:** Kill the process using that port
```bash
# On Mac/Linux:
lsof -i :5173
kill -9 <PID>

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Dependencies installation fails
**Solution:** Clear cache and retry
```bash
cd app/frontend
rm -rf node_modules
pnpm install --force
```

### Issue: Application won't start
**Solution:** Check Node.js version and reinstall
```bash
node --version  # Must be 18.0.0 or higher
cd app/frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run dev
```

### Issue: Login doesn't work
**Solution:** 
1. Verify you're using correct credentials (see above)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try a different browser
4. Check browser console for errors (F12)

### Issue: Blank screen after login
**Solution:**
1. Check browser console for errors (F12)
2. Ensure Atoms Backend is active
3. Clear browser cache and reload
4. Try logging in again

---

## 📱 Using the System

### First-Time User Guide:

1. **Login** with manager credentials (admin/demo123)
2. **Explore Dashboard** - See real-time business metrics
3. **Try POS** - Process a sample sale transaction
4. **Check Inventory** - View stock levels and alerts
5. **View Reports** - Explore analytics and insights
6. **Manage Customers** - Add or edit customer records
7. **Create Purchase Order** - Practice procurement workflow

### Recommended Exploration Order:
1. Dashboard → Overview of the system
2. POS → Process a sale
3. Inventory → Check stock levels
4. Sales → View transaction history
5. Reports → Explore analytics
6. Customers → CRM features
7. Advanced Reports → Comprehensive analytics

---

## 🔧 Advanced Configuration (Optional)

### Custom Port
If you need to use a different port:
```bash
cd app/frontend
pnpm run dev -- --port 3000
```

### Production Build
To create an optimized production build:
```bash
cd app/frontend
pnpm run build
# Output will be in dist/ directory
```

### Environment Variables
The system works out-of-the-box with Atoms Backend. No environment configuration needed for basic usage.

---

## 📚 Documentation

Included in this package:
- **QUICK_START.md** - 3-step quick start guide
- **README.md** - Complete project overview
- **DEPLOYMENT_GUIDE.md** - Advanced deployment options
- **DATABASE_SCHEMA.md** - Database structure details
- **INSTALL.md** - This file

---

## 🔐 Security Notes

**Important for Production Use:**

The included demo credentials are for testing only. Before deploying to production:

1. ✅ Change all default passwords
2. ✅ Use strong, unique passwords (12+ characters)
3. ✅ Enable HTTPS/SSL
4. ✅ Configure firewall rules
5. ✅ Set up regular backups
6. ✅ Enable audit logging
7. ✅ Review user permissions
8. ✅ Update dependencies regularly

---

## 💡 Tips for Best Experience

1. **Use Modern Browser** - Chrome, Firefox, Safari, or Edge (latest versions)
2. **Keep Terminal Open** - Don't close the terminal while using the app
3. **Explore All Modules** - Try different user roles to see all features
4. **Check Advanced Reports** - See comprehensive business analytics
5. **Test POS System** - Process sample transactions to understand workflow

---

## 📊 System Requirements

**Minimum:**
- CPU: Dual-core processor
- RAM: 4GB
- Storage: 2GB free space
- OS: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- Browser: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

**Recommended:**
- CPU: Quad-core processor
- RAM: 8GB
- Storage: 5GB free space
- SSD for better performance

---

## 🆘 Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review **DEPLOYMENT_GUIDE.md** for detailed instructions
3. Verify all **Prerequisites** are met
4. Check **Node.js** and **pnpm** versions
5. Clear browser cache and try again

---

## 🎉 You're Ready!

The Smart Supermarket Management System is now installed and ready to use.

**Next Steps:**
1. Start the application: `pnpm run dev`
2. Open browser: `http://localhost:5173`
3. Login with demo credentials
4. Explore all 13 modules
5. Enjoy the system!

---

## 📞 Quick Reference

**Start Application:**
```bash
cd app/frontend
pnpm run dev
```

**Stop Application:**
Press `Ctrl+C` in the terminal

**Restart Application:**
Stop (Ctrl+C) then start again (`pnpm run dev`)

**Access URL:**
`http://localhost:5173`

**Default Manager Login:**
- Username: `admin`
- Password: `demo123`

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** January 2026

**Enjoy your Smart Supermarket Management System!** 🎉