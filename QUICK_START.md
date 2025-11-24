# Quick Start Guide

Get your full-stack application running in 5 minutes!

## Step 1: Database Setup

### Option A: Use Supabase (Easiest - Free)

1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)

### Option B: Local PostgreSQL

1. Install PostgreSQL
2. Create database: `CREATE DATABASE store_db;`
3. Connection string: `postgresql://username:password@localhost:5432/store_db?schema=public`

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
DATABASE_URL="YOUR_DATABASE_URL_HERE"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
FRONTEND_URL=http://localhost:5173
EOF

# Initialize database
npm run prisma:generate
npm run prisma:push

# Start server
npm run dev
```

Backend should now be running on http://localhost:5000

## Step 3: Frontend Setup

```bash
# From project root
cd ..

# Install dependencies (if not already done)
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start frontend
npm run dev
```

Frontend should now be running on http://localhost:5173

## Step 4: Test It!

1. Open http://localhost:5173
2. Register a new user (role: "customer")
3. Login
4. Browse products and add to cart
5. Place an order
6. Track your order

## Troubleshooting

**Database connection error?**
- Verify DATABASE_URL in backend/.env
- Check database is accessible
- For Supabase: Make sure to use the connection pooler URL if provided

**CORS errors?**
- Make sure backend is running on port 5000
- Check VITE_API_URL in frontend .env

**Products not loading?**
- Verify backend is running
- Check browser console for errors
- Test API directly: http://localhost:5000/api/products

## Next Steps

- Register as a "manager" to manage products
- Register as "delivery" to see delivery dashboard
- Check SETUP.md for detailed documentation

