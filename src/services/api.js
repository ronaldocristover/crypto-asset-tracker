// Real API service for crypto asset data
import { ref, reactive } from "vue";
import { currencyService } from "./currency";

const API_BASE_URL = "http://localhost:3001/api";

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// API functions
export const api = {
  // Get all assets
  async getAssets() {
    try {
      return await apiRequest("/assets");
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      // Fallback to empty array
      return [];
    }
  },

  // Add new asset
  async addAsset(assetData) {
    try {
      return await apiRequest("/assets", {
        method: "POST",
        body: JSON.stringify(assetData),
      });
    } catch (error) {
      console.error("Failed to add asset:", error);
      throw error;
    }
  },

  // Get daily growth data
  async getDailyGrowth() {
    try {
      return await apiRequest("/portfolio/daily-growth");
    } catch (error) {
      console.error("Failed to fetch daily growth:", error);
      // Fallback to empty array
      return [];
    }
  },

  // Get portfolio value over time calculated from assets
  async getPortfolioValueOverTime() {
    try {
      return await apiRequest("/portfolio/portfolio-value-over-time");
    } catch (error) {
      console.error("Failed to fetch portfolio value over time:", error);
      // Fallback to empty array
      return [];
    }
  },

  // Get exchanges list (returns array of strings)
  async getExchanges() {
    try {
      return await apiRequest("/exchanges/names");
    } catch (error) {
      console.error("Failed to fetch exchanges:", error);
      // Fallback to default exchanges
      return [
        "Binance",
        "Coinbase",
        "Kraken",
        "KuCoin",
        "Bybit",
        "OKX",
        "Gate.io",
        "Huobi",
      ];
    }
  },

  // Get crypto list
  async getCryptoList() {
    try {
      return await apiRequest("/exchanges/crypto-list");
    } catch (error) {
      console.error("Failed to fetch crypto list:", error);
      // Fallback to default crypto list
      return [
        { symbol: "BTC", name: "Bitcoin" },
        { symbol: "ETH", name: "Ethereum" },
        { symbol: "ADA", name: "Cardano" },
        { symbol: "DOT", name: "Polkadot" },
        { symbol: "LINK", name: "Chainlink" },
        { symbol: "UNI", name: "Uniswap" },
        { symbol: "LTC", name: "Litecoin" },
        { symbol: "BCH", name: "Bitcoin Cash" },
        { symbol: "XRP", name: "Ripple" },
        { symbol: "SOL", name: "Solana" },
      ];
    }
  },

  // Get portfolio summary
  async getPortfolioSummary() {
    try {
      return await apiRequest("/portfolio/summary");
    } catch (error) {
      console.error("Failed to fetch portfolio summary:", error);
      // Fallback to default summary
      return {
        totalValue: 0,
        totalProfitLoss: 0,
        totalInvested: 0,
        totalProfitLossPercentage: 0,
        assetCount: 0,
        topPerformer: { symbol: "N/A", name: "N/A", profitLossPercentage: 0 },
      };
    }
  },

  // Get all debts
  async getDebts() {
    try {
      return await apiRequest("/debts");
    } catch (error) {
      console.error("Failed to fetch debts:", error);
      // Fallback to empty array
      return [];
    }
  },

  // Add new debt
  async addDebt(debtData) {
    try {
      return await apiRequest("/debts", {
        method: "POST",
        body: JSON.stringify(debtData),
      });
    } catch (error) {
      console.error("Failed to add debt:", error);
      throw error;
    }
  },

  // Get debt summary
  async getDebtSummary() {
    try {
      return await apiRequest("/debts/summary/totals");
    } catch (error) {
      console.error("Failed to fetch debt summary:", error);
      // Fallback to default summary
      return {
        totalDebtUSD: 0,
        totalDebtIDR: 0,
        debtCount: 0,
        debtsByCurrency: {
          USD: [],
          IDR: [],
        },
      };
    }
  },

  // Get exchange distribution (for charts)
  async getExchangeDistribution() {
    try {
      return await apiRequest("/portfolio/exchange-distribution");
    } catch (error) {
      console.error("Failed to fetch exchange distribution:", error);
      // Fallback to empty chart data
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 2,
          },
        ],
        totalValue: 0,
      };
    }
  },

  // Get total debt sum
  async getTotalDebt() {
    try {
      return await apiRequest("/portfolio/total-debt");
    } catch (error) {
      console.error("Failed to fetch total debt:", error);
      // Fallback to default debt
      return {
        totalDebtUSD: 0,
        totalDebtIDR: 0,
        debtCount: 0,
        currency: "USD",
      };
    }
  },

  // Get total revenue
  async getTotalRevenue() {
    try {
      return await apiRequest("/portfolio/revenue");
    } catch (error) {
      console.error("Failed to fetch total revenue:", error);
      // Fallback to default revenue
      return {
        totalAssetsUSD: 0,
        totalDebtsUSD: 0,
        totalRevenue: 0,
        currency: "USD",
      };
    }
  },

  // Get configuration
  async getConfig() {
    try {
      return await apiRequest("/config");
    } catch (error) {
      console.error("Failed to fetch config:", error);
      // Fallback to default config
      return {
        success: false,
        data: {
          USD_TO_IDR_RATE: { value: "16500" },
          CURRENCY_DEFAULT: { value: "USD" },
          CURRENCY_SUPPORTED: { value: "USD,IDR" },
        },
      };
    }
  },

  // Health check
  async healthCheck() {
    try {
      return await apiRequest("/health");
    } catch (error) {
      console.error("API health check failed:", error);
      return { status: "ERROR", message: "API is not responding" };
    }
  },
};
