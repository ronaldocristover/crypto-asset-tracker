# Asset Tracker API Documentation

This document provides comprehensive API documentation for the Asset Tracker application, including all endpoints used by the frontend and their request/response formats.

## Base URL
- Frontend: `http://localhost:3000`
- API: `http://localhost:3001/api`

## Table of Contents
1. [Assets API](#assets-api)
2. [Exchanges API](#exchanges-api)  
3. [Debts API](#debts-api)
4. [Portfolio API](#portfolio-api)
5. [Frontend API Service Functions](#frontend-api-service-functions)
6. [Error Handling](#error-handling)

---

## Assets API

### Get All Assets
**Endpoint:** `GET /api/assets`
**Description:** Retrieve all assets with calculations for profit/loss

**Response:**
```json
[
  {
    "id": 1,
    "exchange": "Binance",
    "amount": 1.5,
    "purchasePrice": 25000.00,
    "currentPrice": 26000.00,
    "currency": "USD",
    "submitDate": "2024-01-15",
    "totalValue": 39000.00,
    "profitLoss": 1500.00,
    "profitLossPercentage": 4.0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Single Asset
**Endpoint:** `GET /api/assets/:id`
**Description:** Retrieve a specific asset by ID

**Response:**
```json
{
  "id": 1,
  "exchange": "Binance",
  "amount": 1.5,
  "purchasePrice": 25000.00,
  "currentPrice": 26000.00,
  "currency": "USD",
  "submitDate": "2024-01-15",
  "totalValue": 39000.00,
  "profitLoss": 1500.00,
  "profitLossPercentage": 4.0,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Create Asset
**Endpoint:** `POST /api/assets`
**Description:** Create a new asset

**Request Body:**
```json
{
  "exchangeId": 1,
  "amount": 1.5,
  "purchasePrice": 25000.00,
  "currentPrice": 26000.00,
  "currency": "USD",
  "submitDate": "2024-01-15"
}
```

**Response:** Same as Get Single Asset (201 Created)

### Update Asset
**Endpoint:** `PUT /api/assets/:id`
**Description:** Update an existing asset

**Request Body:** Same as Create Asset (all fields optional)

**Response:** Same as Get Single Asset

### Delete Asset
**Endpoint:** `DELETE /api/assets/:id`
**Description:** Delete an asset

**Response:**
```json
{
  "message": "Asset deleted successfully"
}
```

---

## Exchanges API

### Get All Exchanges
**Endpoint:** `GET /api/exchanges`
**Description:** Retrieve all exchanges ordered alphabetically

**Response:**
```json
[
  {
    "id": 1,
    "name": "Binance",
    "description": "World's largest cryptocurrency exchange",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Get Single Exchange
**Endpoint:** `GET /api/exchanges/:id`
**Description:** Retrieve a specific exchange with its assets

**Response:**
```json
{
  "id": 1,
  "name": "Binance",
  "description": "World's largest cryptocurrency exchange",
  "assets": [
    {
      "id": 1,
      "amount": 1.5,
      "purchasePrice": 25000.00,
      "currentPrice": 26000.00,
      "currency": "USD"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Create Exchange
**Endpoint:** `POST /api/exchanges`
**Description:** Create a new exchange

**Request Body:**
```json
{
  "name": "New Exchange",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "id": 7,
  "name": "New Exchange",
  "description": "Optional description",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Update Exchange
**Endpoint:** `PUT /api/exchanges/:id`
**Description:** Update an existing exchange

**Request Body:** Same as Create Exchange (all fields optional)

**Response:** Same as Create Exchange

### Delete Exchange
**Endpoint:** `DELETE /api/exchanges/:id`
**Description:** Delete an exchange (only if no assets exist)

**Response:**
```json
{
  "message": "Exchange deleted successfully"
}
```

**Error Response (when assets exist):**
```json
{
  "error": "Cannot delete exchange with existing assets",
  "assetsCount": 3
}
```

### Seed Default Exchanges
**Endpoint:** `POST /api/exchanges/seed`
**Description:** Seed database with default exchanges

**Response:**
```json
{
  "message": "Default exchanges seeded successfully",
  "created": 6,
  "exchanges": [
    {
      "id": 1,
      "name": "Binance",
      "description": "World's largest cryptocurrency exchange"
    }
  ]
}
```

---

## Debts API

### Get All Debts
**Endpoint:** `GET /api/debts`
**Description:** Retrieve all debts ordered by creation date (newest first)

**Response:**
```json
[
  {
    "id": 1,
    "description": "Credit Card",
    "amount": 5000.00,
    "currency": "USD",
    "submitDate": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Single Debt
**Endpoint:** `GET /api/debts/:id`
**Description:** Retrieve a specific debt by ID

**Response:**
```json
{
  "id": 1,
  "description": "Credit Card",
  "amount": 5000.00,
  "currency": "USD",
  "submitDate": "2024-01-15",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Create Debt
**Endpoint:** `POST /api/debts`
**Description:** Create a new debt

**Request Body:**
```json
{
  "description": "Credit Card",
  "amount": 5000.00,
  "currency": "USD",
  "submitDate": "2024-01-15"
}
```

**Response:** Same as Get Single Debt (201 Created)

### Update Debt
**Endpoint:** `PUT /api/debts/:id`
**Description:** Update an existing debt

**Request Body:** Same as Create Debt (all fields optional)

**Response:** Same as Get Single Debt

### Delete Debt
**Endpoint:** `DELETE /api/debts/:id`
**Description:** Delete a debt

**Response:**
```json
{
  "message": "Debt deleted successfully"
}
```

### Get Debt Summary
**Endpoint:** `GET /api/debts/summary/totals`
**Description:** Get debt totals and summary statistics

**Response:**
```json
{
  "totalDebtUSD": 250000.00,
  "totalDebtIDR": 4125000000.00,
  "debtCount": 3,
  "debtsByCurrency": {
    "USD": [
      {
        "id": 1,
        "description": "Credit Card",
        "amount": 5000.00,
        "currency": "USD",
        "submitDate": "2024-01-15"
      }
    ],
    "IDR": [
      {
        "id": 2,
        "description": "Personal Loan",
        "amount": 50000000.00,
        "currency": "IDR",
        "submitDate": "2024-02-01"
      }
    ]
  }
}
```

---

## Portfolio API

### Get Portfolio Summary
**Endpoint:** `GET /api/portfolio/summary`
**Description:** Get comprehensive portfolio statistics

**Response:**
```json
{
  "totalValue": 52920.00,
  "totalProfitLoss": 2920.00,
  "totalInvested": 50000.00,
  "totalProfitLossPercentage": 5.84,
  "assetCount": 3,
  "topPerformer": {
    "symbol": "Binance",
    "profitLossPercentage": 9.33
  }
}
```

### Get Daily Growth Data
**Endpoint:** `GET /api/portfolio/daily-growth`
**Description:** Get historical daily portfolio performance

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "totalValue": 48000.00,
    "profitLoss": 2000.00
  },
  {
    "date": "2024-01-02",
    "totalValue": 48200.00,
    "profitLoss": 2200.00
  }
]
```

### Create/Update Daily Growth
**Endpoint:** `POST /api/portfolio/daily-growth`
**Description:** Add or update daily growth record

**Request Body:**
```json
{
  "date": "2024-01-15",
  "totalValue": 52000.00,
  "profitLoss": 6000.00
}
```

**Response:**
```json
{
  "date": "2024-01-15",
  "totalValue": 52000.00,
  "profitLoss": 6000.00
}
```

### Get Exchange Distribution
**Endpoint:** `GET /api/portfolio/exchange-distribution`
**Description:** Get asset distribution across exchanges for pie charts

**Response:**
```json
{
  "labels": ["Binance", "Coinbase", "Kraken"],
  "datasets": [
    {
      "data": [26000.00, 16400.00, 8520.00],
      "backgroundColor": ["rgb(14, 165, 233)", "rgb(34, 197, 94)", "rgb(239, 68, 68)"],
      "borderColor": ["rgba(14, 165, 233, 0.8)", "rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
      "borderWidth": 2
    }
  ],
  "totalValue": 50920.00
}
```

### Get Total Revenue
**Endpoint:** `GET /api/portfolio/revenue`
**Description:** Get total revenue (assets - debts)

**Response:**
```json
{
  "totalAssetsUSD": 52920.00,
  "totalDebtsUSD": 250000.00,
  "totalRevenue": -197080.00,
  "currency": "USD"
}
```

---

## Frontend API Service Functions

The frontend uses a real API service (`src/services/api.js`) that connects to the backend with the following functions:

### Asset Functions
- `api.getAssets()` - Fetches from `GET /api/assets`
- `api.addAsset(assetData)` - Posts to `POST /api/assets`

### Exchange Functions  
- `api.getExchanges()` - Fetches from `GET /api/exchanges/names`
- `api.getCryptoList()` - Fetches from `GET /api/exchanges/crypto-list`

### Portfolio Functions
- `api.getPortfolioSummary()` - Fetches from `GET /api/portfolio/summary`
- `api.getDailyGrowth()` - Fetches from `GET /api/portfolio/daily-growth`
- `api.getExchangeDistribution()` - Fetches from `GET /api/portfolio/exchange-distribution`
- `api.getTotalRevenue()` - Fetches from `GET /api/portfolio/revenue`

### Debt Functions
- `api.getDebts()` - Fetches from `GET /api/debts`
- `api.addDebt(debtData)` - Posts to `POST /api/debts`
- `api.getDebtSummary()` - Fetches from `GET /api/debts/summary/totals`

### Utility Functions
- `api.healthCheck()` - Fetches from `GET /api/health`

### Frontend Data Structures

**Asset Object (Frontend & Backend Response):**
```javascript
{
  id: 1,
  symbol: "ASSET",
  name: "Binance Portfolio", 
  amount: 1,
  exchange: "Binance",
  purchasePrice: 25000,
  currentPrice: 26000,
  purchaseDate: "2024-01-15",
  submitDate: "2024-01-15T00:00:00.000Z",
  totalValue: 26000,
  profitLoss: 1000,
  profitLossPercentage: 4.0,
  currency: "USD",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

**Debt Object (Frontend & Backend Response):**
```javascript
{
  id: 1,
  description: "Credit Card",
  amount: 5000,
  currency: "USD", 
  submitDate: "2024-01-15T00:00:00.000Z",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields, validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Errors

**Missing Required Fields:**
```json
{
  "error": "Missing required fields"
}
```

**Asset Creation Validation:**
```json
{
  "error": "exchangeId, amount, purchasePrice, and currentPrice are required"
}
```

**Debt Creation Validation:**
```json
{
  "error": "Description and amount are required"
}
```

**Exchange Name Conflict:**
```json
{
  "error": "Exchange with this name already exists"
}
```

---

## Currency Support

The application supports two currencies:
- **USD** - US Dollar
- **IDR** - Indonesian Rupiah

**Exchange Rate:** 1 USD = 16,500 IDR (hardcoded)

All portfolio calculations are normalized to USD for consistent reporting while preserving original currency for display purposes.

---

## Additional Endpoints

### Exchange Names (for dropdowns)
**Endpoint:** `GET /api/exchanges/names`
**Description:** Returns array of exchange name strings for frontend dropdowns

**Response:**
```json
["Binance", "Coinbase", "Kraken", "KuCoin", "Bybit", "OKX"]
```

### Crypto List (static data)
**Endpoint:** `GET /api/exchanges/crypto-list`
**Description:** Returns static list of cryptocurrency symbols and names

**Response:**
```json
[
  { "symbol": "BTC", "name": "Bitcoin" },
  { "symbol": "ETH", "name": "Ethereum" },
  { "symbol": "ADA", "name": "Cardano" }
]
```

---

## Integration Status

✅ **COMPLETED** - Frontend-Backend Integration

- Backend API fully implemented and tested
- Frontend service layer updated to use real API calls
- All endpoints tested and working
- Database schema deployed and seeded
- Both servers running successfully

---

## Notes

1. **✅ Frontend now uses real backend API** instead of mock services
2. Real backend APIs are connected and operational
3. All monetary values are stored as floating-point numbers
4. Dates are stored as ISO 8601 strings
5. Profit/loss calculations are performed in backend API
6. Currency conversions use a fixed exchange rate (16,500 IDR = 1 USD)
7. Error handling includes fallbacks to prevent frontend crashes
8. API Base URL: `http://localhost:3001/api`