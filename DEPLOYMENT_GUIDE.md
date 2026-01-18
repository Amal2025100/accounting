# Smart Supermarket Management System - Deployment Guide

## 🎯 Project Overview

A comprehensive, enterprise-grade supermarket management system with AI-powered analytics, built with React (TypeScript), FastAPI (Python), and PostgreSQL.

## 📋 System Requirements

### Minimum Requirements:
- **Node.js**: v18.0.0 or higher
- **Python**: 3.9 or higher
- **PostgreSQL**: 13.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)

### Development Tools:
- **Package Manager**: pnpm (recommended) or npm
- **Code Editor**: VS Code, WebStorm, or similar
- **Terminal**: bash, zsh, or PowerShell

## 🏗️ Project Structure

```
app/
├── frontend/                 # React + TypeScript + Shadcn-UI
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API client
│   │   ├── pages/           # Page components (13 modules)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite configuration
│
├── backend/                 # FastAPI + SQLAlchemy
│   ├── core/                # Core configurations (DO NOT MODIFY)
│   │   ├── config.py        # Environment configuration
│   │   ├── database.py      # Database connection
│   │   └── security.py      # Authentication utilities
│   ├── models/              # SQLAlchemy ORM models (20+ tables)
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic layer
│   ├── schemas/             # Pydantic schemas
│   ├── dependencies/        # Dependency injection
│   ├── main.py              # FastAPI application entry
│   └── requirements.txt     # Backend dependencies
│
└── database/
    └── schema.sql           # Database initialization script
```

## 🚀 Quick Start Guide

### Step 1: Clone or Extract Project

```bash
# If from Git
git clone <repository-url>
cd smart-supermarket

# If from ZIP
unzip smart-supermarket.zip
cd smart-supermarket
```

### Step 2: Database Setup

#### Option A: PostgreSQL (Recommended for Production)

1. **Install PostgreSQL**:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql@15`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Create Database**:
```bash
# Start PostgreSQL service
# Windows: Start from Services
# macOS: brew services start postgresql@15
# Linux: sudo systemctl start postgresql

# Create database
psql -U postgres
CREATE DATABASE supermarket_db;
CREATE USER supermarket_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE supermarket_db TO supermarket_user;
\q
```

3. **Initialize Schema**:
```bash
psql -U supermarket_user -d supermarket_db -f app/database/schema.sql
```

#### Option B: SQLite (Development/Testing Only)

The system will automatically use SQLite if PostgreSQL is not configured. No setup required.

### Step 3: Backend Setup

```bash
cd app/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create .env file in backend directory
cat > .env << EOF
DATABASE_URL=postgresql://supermarket_user:your_secure_password@localhost:5432/supermarket_db
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
EOF

# Run database migrations (if using Atoms Backend)
# This is handled automatically on first run

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Step 4: Frontend Setup

```bash
# Open new terminal
cd app/frontend

# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Configure environment (optional)
# Create .env file in frontend directory
cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF

# Start development server
pnpm run dev
```

Frontend will be available at: `http://localhost:5173`

### Step 5: Access the System

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Login**: Use one of the demo credentials (provided separately)
3. **Explore**: All 13 modules are now accessible based on your role

## 👥 User Roles & Access

### Manager (Full Access)
- Username: `admin`
- Access: All 13 modules including user management

### Accountant
- Username: `accountant1`
- Access: Financial, reports, analytics, customers

### Cashier
- Username: `cashier1`
- Access: POS, sales, inventory (read-only)

### Inventory Manager
- Username: `inventory1`
- Access: Inventory, suppliers, purchase orders

### Report Viewer
- Username: `viewer1`
- Access: Dashboard and reports (read-only)

**Note**: Passwords are provided separately for security reasons.

## 📦 Production Deployment

### Option 1: Docker Deployment (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: supermarket_db
      POSTGRES_USER: supermarket_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./app/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U supermarket_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./app/backend
    environment:
      DATABASE_URL: postgresql://supermarket_user:${DB_PASSWORD}@postgres:5432/supermarket_db
      SECRET_KEY: ${SECRET_KEY}
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
    command: uvicorn main:app --host 0.0.0.0 --port 8000

  frontend:
    build: ./app/frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://backend:8000

volumes:
  postgres_data:
```

Deploy:
```bash
# Set environment variables
export DB_PASSWORD=your_secure_password
export SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")

# Build and start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 2: Traditional Server Deployment

#### Backend Deployment (Ubuntu/Debian):

```bash
# Install system dependencies
sudo apt-get update
sudo apt-get install python3-pip python3-venv nginx postgresql

# Setup application
cd /var/www/supermarket
python3 -m venv venv
source venv/bin/activate
pip install -r app/backend/requirements.txt

# Install Gunicorn
pip install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/supermarket-backend.service
```

Service file content:
```ini
[Unit]
Description=Supermarket Backend API
After=network.target postgresql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/supermarket/app/backend
Environment="PATH=/var/www/supermarket/venv/bin"
ExecStart=/var/www/supermarket/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable supermarket-backend
sudo systemctl start supermarket-backend
```

#### Frontend Deployment:

```bash
cd app/frontend

# Build for production
pnpm run build

# Copy to web server
sudo cp -r dist/* /var/www/html/supermarket/

# Configure Nginx
sudo nano /etc/nginx/sites-available/supermarket
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/supermarket;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/supermarket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Cloud Platform Deployment

#### Vercel (Frontend):
```bash
cd app/frontend
vercel --prod
```

#### Railway/Render (Backend):
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### AWS/Azure/GCP:
- Use EC2/VM instances
- Configure load balancers
- Setup RDS/Cloud SQL for database
- Use CloudFront/CDN for static assets

## 🔧 Configuration

### Environment Variables

#### Backend (.env):
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=production
DEBUG=False

# CORS (if frontend on different domain)
ALLOWED_ORIGINS=https://your-frontend-domain.com

# Optional: External Services
STRIPE_SECRET_KEY=sk_live_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend (.env):
```env
VITE_API_URL=https://api.your-domain.com
VITE_APP_NAME=Smart Supermarket
VITE_ENVIRONMENT=production
```

## 🧪 Testing

### Backend Tests:
```bash
cd app/backend
pytest tests/ -v --cov=.
```

### Frontend Tests:
```bash
cd app/frontend
pnpm test
pnpm test:coverage
```

### E2E Tests:
```bash
cd app/frontend
pnpm playwright test
```

## 📊 Database Management

### Backup Database:
```bash
pg_dump -U supermarket_user supermarket_db > backup_$(date +%Y%m%d).sql
```

### Restore Database:
```bash
psql -U supermarket_user supermarket_db < backup_20260116.sql
```

### Database Migrations:
```bash
cd app/backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## 🔍 Monitoring & Maintenance

### Health Checks:
- Backend: `http://localhost:8000/health`
- Database: `pg_isready -U supermarket_user`

### Log Files:
- Backend: `/var/log/supermarket/backend.log`
- Nginx: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- PostgreSQL: `/var/log/postgresql/postgresql-15-main.log`

### Performance Monitoring:
```bash
# Backend performance
htop
# Database queries
psql -U supermarket_user -d supermarket_db -c "SELECT * FROM pg_stat_activity;"
```

## 🛠️ Troubleshooting

### Common Issues:

#### 1. Database Connection Failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U supermarket_user -d supermarket_db

# Verify DATABASE_URL in .env
```

#### 2. Frontend Can't Connect to Backend
```bash
# Check backend is running
curl http://localhost:8000/health

# Verify VITE_API_URL in frontend .env
# Check CORS settings in backend
```

#### 3. Port Already in Use
```bash
# Find process using port
lsof -i :8000  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

#### 4. Permission Denied
```bash
# Fix file permissions
sudo chown -R $USER:$USER app/
chmod -R 755 app/
```

## 📚 Additional Resources

### API Documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Database Schema:
- See `app/database/schema.sql` for complete schema
- 20+ tables with relationships documented

### Code Documentation:
- TypeScript types: `app/frontend/src/types/index.ts`
- API client: `app/frontend/src/lib/api.ts`
- Backend models: `app/backend/models/`

## 🔐 Security Best Practices

1. **Change Default Credentials**: Update all demo passwords immediately
2. **Use HTTPS**: Always use SSL/TLS in production
3. **Environment Variables**: Never commit .env files to version control
4. **Database Backups**: Schedule regular automated backups
5. **Update Dependencies**: Regularly update packages for security patches
6. **Access Control**: Review and restrict user permissions
7. **Firewall**: Configure firewall rules to restrict access
8. **Monitoring**: Set up logging and monitoring for suspicious activities

## 📞 Support

For issues or questions:
1. Check this deployment guide
2. Review API documentation at `/docs`
3. Check application logs
4. Contact system administrator

## 📝 License

This is a proprietary enterprise application. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Deployment Status**: Production Ready ✅