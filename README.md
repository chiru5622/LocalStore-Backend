# Backend API - Store Management System

Full-stack backend built with Node.js, Express, PostgreSQL, and Prisma.

## Features

- ✅ User Authentication (JWT)
- ✅ Product Management (CRUD)
- ✅ Order Management
- ✅ Role-based Access Control (Customer, Manager, Delivery)
- ✅ Real-time Order Tracking
- ✅ Stock Management

## Tech Stack

- **Node.js** + **Express** - Server framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
```sql
CREATE DATABASE store_db;
```

#### Option B: Use a Cloud Database (Recommended for Production)

Use services like:
- Supabase (Free tier available)
- Railway
- Render
- AWS RDS

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/store_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace the `DATABASE_URL` with your actual PostgreSQL connection string.

### 4. Initialize Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate

# Or push schema directly (for development)
npm run prisma:push
```

### 5. Seed Initial Data (Optional)

You can manually add products through the Manager Dashboard after logging in, or create a seed script.

### 6. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/users` - Get all users (Admin)

### Products

- `GET /api/products` - Get all products (Public)
- `GET /api/products/:id` - Get product by ID (Public)
- `POST /api/products` - Create product (Manager only)
- `PUT /api/products/:id` - Update product (Manager only)
- `PATCH /api/products/:id/stock` - Update stock (Manager only)
- `DELETE /api/products/:id` - Delete product (Manager only)

### Orders

- `POST /api/orders` - Create order (Customer)
- `GET /api/orders/my-orders` - Get customer orders (Customer)
- `GET /api/orders/track/:orderNumber` - Track order by number (Public)
- `GET /api/orders/manager/all` - Get all orders (Manager)
- `PATCH /api/orders/manager/:id/status` - Update order status (Manager)
- `PATCH /api/orders/manager/:id/assign-delivery` - Assign delivery partner (Manager)
- `GET /api/orders/delivery/all` - Get delivery orders (Delivery)
- `PATCH /api/orders/delivery/:id/status` - Update delivery status (Delivery)

## Database Schema

### Users
- id, name, email, password, role, address, location, phone

### Products
- id, name, description, image, category, price, stock, lowStockThreshold

### Orders
- id, orderNumber, customerId, deliveryAddress, status, total, assignedDeliveryId

### OrderItems
- id, orderId, productId, quantity, price

## Role-Based Access

- **Customer**: Can view products, create orders, track orders
- **Manager**: Can manage products, view all orders, update order status, assign delivery
- **Delivery**: Can view assigned orders, update delivery status

## Frontend Integration

Update your frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Ensure database exists
4. Check network/firewall settings

### Prisma Issues

```bash
# Reset Prisma Client
npm run prisma:generate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### CORS Issues

Update `server.js` to include your frontend URL in `allowedOrigins`.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Use a production database
4. Enable SSL for database connection
5. Set up proper CORS origins
6. Use environment variables for all secrets

## License

MIT

