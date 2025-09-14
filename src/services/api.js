// Mock API service for crypto asset data
import { ref, reactive } from "vue";
import { currencyService } from "./currency";

// Mock data storage
const assets = ref([
  {
    id: 1,
    symbol: "ASSET",
    name: "Binance Portfolio",
    amount: 1,
    exchange: "Binance",
    purchasePrice: 25000,
    currentPrice: 26000,
    purchaseDate: "2024-01-15",
    totalValue: 26000,
    profitLoss: 1000,
    profitLossPercentage: 4.0,
    currency: "USD",
  },
  {
    id: 2,
    symbol: "ASSET",
    name: "Coinbase Portfolio",
    amount: 1,
    exchange: "Coinbase",
    purchasePrice: 15000000,
    currentPrice: 16400000,
    purchaseDate: "2024-02-01",
    totalValue: 16400000,
    profitLoss: 1400000,
    profitLossPercentage: 9.33,
    currency: "IDR",
  },
  {
    id: 3,
    symbol: "ASSET",
    name: "Kraken Portfolio",
    amount: 1,
    exchange: "Kraken",
    purchasePrice: 8000,
    currentPrice: 8520,
    purchaseDate: "2024-01-20",
    totalValue: 8520,
    profitLoss: 520,
    profitLossPercentage: 6.5,
    currency: "USD",
  },
]);

// Mock debt data storage
const debts = ref([
  {
    id: 1,
    description: "Credit Card",
    amount: 5000,
    currency: "USD",
    submitDate: "2024-01-15",
    picture: null,
  },
  {
    id: 2,
    description: "Personal Loan",
    amount: 50000000,
    currency: "IDR",
    submitDate: "2024-02-01",
    picture: null,
  },
  {
    id: 3,
    description: "Mortgage",
    amount: 200000,
    currency: "USD",
    submitDate: "2024-01-20",
    picture: null,
  },
]);

const dailyGrowth = ref([
  { date: "2024-01-01", totalValue: 48000, profitLoss: 2000 },
  { date: "2024-01-02", totalValue: 48200, profitLoss: 2200 },
  { date: "2024-01-03", totalValue: 47800, profitLoss: 1800 },
  { date: "2024-01-04", totalValue: 48500, profitLoss: 2500 },
  { date: "2024-01-05", totalValue: 49200, profitLoss: 3200 },
  { date: "2024-01-06", totalValue: 48800, profitLoss: 2800 },
  { date: "2024-01-07", totalValue: 49500, profitLoss: 3500 },
  { date: "2024-01-08", totalValue: 49800, profitLoss: 3800 },
  { date: "2024-01-09", totalValue: 50200, profitLoss: 4200 },
  { date: "2024-01-10", totalValue: 50500, profitLoss: 4500 },
  { date: "2024-01-11", totalValue: 50800, profitLoss: 4800 },
  { date: "2024-01-12", totalValue: 51100, profitLoss: 5100 },
  { date: "2024-01-13", totalValue: 51400, profitLoss: 5400 },
  { date: "2024-01-14", totalValue: 51700, profitLoss: 5700 },
  { date: "2024-01-15", totalValue: 52000, profitLoss: 6000 },
  { date: "2024-01-16", totalValue: 52300, profitLoss: 6300 },
  { date: "2024-01-17", totalValue: 52600, profitLoss: 6600 },
  { date: "2024-01-18", totalValue: 52900, profitLoss: 6900 },
  { date: "2024-01-19", totalValue: 53200, profitLoss: 7200 },
  { date: "2024-01-20", totalValue: 53500, profitLoss: 7500 },
  { date: "2024-01-21", totalValue: 53800, profitLoss: 7800 },
  { date: "2024-01-22", totalValue: 54100, profitLoss: 8100 },
  { date: "2024-01-23", totalValue: 54400, profitLoss: 8400 },
  { date: "2024-01-24", totalValue: 54700, profitLoss: 8700 },
  { date: "2024-01-25", totalValue: 55000, profitLoss: 9000 },
  { date: "2024-01-26", totalValue: 55300, profitLoss: 9300 },
  { date: "2024-01-27", totalValue: 55600, profitLoss: 9600 },
  { date: "2024-01-28", totalValue: 55900, profitLoss: 9900 },
  { date: "2024-01-29", totalValue: 56200, profitLoss: 10200 },
  { date: "2024-01-30", totalValue: 56500, profitLoss: 10500 },
]);

const exchanges = ref([
  "Binance",
  "Coinbase",
  "Kraken",
  "KuCoin",
  "Bybit",
  "OKX",
  "Gate.io",
  "Huobi",
]);

const cryptoList = ref([
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
]);

// API functions
export const api = {
  // Get all assets
  getAssets() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...assets.value]);
      }, 500);
    });
  },

  // Add new asset
  addAsset(assetData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAsset = {
          id: Date.now(),
          ...assetData,
          totalValue: assetData.amount * assetData.currentPrice,
          profitLoss:
            assetData.amount *
            (assetData.currentPrice - assetData.purchasePrice),
          profitLossPercentage:
            ((assetData.currentPrice - assetData.purchasePrice) /
              assetData.purchasePrice) *
            100,
        };
        assets.value.push(newAsset);
        resolve(newAsset);
      }, 500);
    });
  },

  // Get daily growth data
  getDailyGrowth() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...dailyGrowth.value]);
      }, 300);
    });
  },

  // Get exchanges list
  getExchanges() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...exchanges.value]);
      }, 200);
    });
  },

  // Get crypto list
  getCryptoList() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...cryptoList.value]);
      }, 200);
    });
  },

  // Get portfolio summary
  getPortfolioSummary() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Convert all values to USD for consistent calculation
        const totalValue = assets.value.reduce((sum, asset) => {
          return (
            sum + currencyService.convertToUsd(asset.totalValue, asset.currency)
          );
        }, 0);

        const totalProfitLoss = assets.value.reduce((sum, asset) => {
          return (
            sum + currencyService.convertToUsd(asset.profitLoss, asset.currency)
          );
        }, 0);

        const totalInvested = assets.value.reduce((sum, asset) => {
          const investedValue = asset.amount * asset.purchasePrice;
          return (
            sum + currencyService.convertToUsd(investedValue, asset.currency)
          );
        }, 0);

        const totalProfitLossPercentage =
          totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

        resolve({
          totalValue,
          totalProfitLoss,
          totalInvested,
          totalProfitLossPercentage,
          assetCount: assets.value.length,
          topPerformer: assets.value.reduce(
            (top, asset) =>
              asset.profitLossPercentage > top.profitLossPercentage
                ? asset
                : top,
            assets.value[0] || { symbol: "N/A", profitLossPercentage: 0 }
          ),
        });
      }, 400);
    });
  },

  // Get all debts
  getDebts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...debts.value]);
      }, 300);
    });
  },

  // Add new debt
  addDebt(debtData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDebt = {
          id: Date.now(),
          ...debtData,
        };
        debts.value.push(newDebt);
        resolve(newDebt);
      }, 500);
    });
  },

  // Get debt summary
  getDebtSummary() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Convert all debts to USD for consistent calculation
        const totalDebtUSD = debts.value.reduce((sum, debt) => {
          return sum + currencyService.convertToUsd(debt.amount, debt.currency);
        }, 0);

        const totalDebtIDR = debts.value.reduce((sum, debt) => {
          return sum + currencyService.convertToIdr(debt.amount, debt.currency);
        }, 0);

        resolve({
          totalDebtUSD,
          totalDebtIDR,
          debtCount: debts.value.length,
          debtsByCurrency: {
            USD: debts.value.filter((debt) => debt.currency === "USD"),
            IDR: debts.value.filter((debt) => debt.currency === "IDR"),
          },
        });
      }, 300);
    });
  },
};
