# Asset Tracker API

A RESTful API server for the Asset Tracker application built with Express.js, Prisma ORM, and MySQL.

## Features

- **Assets Management**: CRUD operations for crypto assets
- **Debt Tracking**: Manage and track debts
- **Exchange Management**: Handle different cryptocurrency exchanges
- **Portfolio Analytics**: Get portfolio summaries, daily growth, and exchange distribution
- **Currency Support**: USD and IDR with automatic conversion
- **Real-time Data**: Live portfolio calculations and analytics

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **MySQL** - Database
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v16.17.0 or higher)
- MySQL database
- npm or yarn

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/asset_tracker"
   PORT=3001
   NODE_ENV=development
   ```

3. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get single asset
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Debts
- `GET /api/debts` - Get all debts
- `GET /api/debts/:id` - Get single debt
- `POST /api/debts` - Create new debt
- `PUT /api/debts/:id` - Update debt
- `DELETE /api/debts/:id` - Delete debt
- `GET /api/debts/summary/totals` - Get debt summary

### Exchanges
- `GET /api/exchanges` - Get all exchanges
- `GET /api/exchanges/:id` - Get single exchange
- `POST /api/exchanges` - Create new exchange
- `PUT /api/exchanges/:id` - Update exchange
- `DELETE /api/exchanges/:id` - Delete exchange
- `POST /api/exchanges/seed` - Seed default exchanges

### Portfolio
- `GET /api/portfolio/summary` - Get portfolio summary
- `GET /api/portfolio/daily-growth` - Get daily growth data
- `POST /api/portfolio/daily-growth` - Create/update daily growth
- `GET /api/portfolio/exchange-distribution` - Get exchange distribution for pie chart
- `GET /api/portfolio/revenue` - Get total revenue (assets - debts)

## Database Schema

### Tables
- **exchanges** - Cryptocurrency exchanges
- **assets** - Crypto assets with purchase/current prices
- **debts** - Debt records
- **daily_growth** - Daily portfolio performance tracking

### Relationships
- Assets belong to Exchanges (many-to-one)
- Daily growth tracks overall portfolio performance

## Currency Conversion

The API supports USD and IDR currencies with automatic conversion:
- **Exchange Rate**: 1 USD = 16,500 IDR
- **All calculations** are normalized to USD for consistency
- **Display values** can be shown in original currency or converted

## Sample Data

The seed script creates:
- 6 default exchanges (Binance, Coinbase, Kraken, etc.)
- 4 sample assets with different currencies
- 2 sample debts
- 5 days of sample growth data

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "data": [...],
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## CORS Configuration

The API is configured to accept requests from any origin in development. For production, update the CORS configuration in `server.js`.

## Error Handling

- **400** - Bad Request (validation errors)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error (server errors)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
