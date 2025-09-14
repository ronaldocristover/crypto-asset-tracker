// Mock API service for crypto asset data
import { ref, reactive } from "vue";

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
  },
  {
    id: 2,
    symbol: "ASSET",
    name: "Coinbase Portfolio",
    amount: 1,
    exchange: "Coinbase",
    purchasePrice: 15000,
    currentPrice: 16400,
    purchaseDate: "2024-02-01",
    totalValue: 16400,
    profitLoss: 1400,
    profitLossPercentage: 9.33,
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
        const totalValue = assets.value.reduce(
          (sum, asset) => sum + asset.totalValue,
          0
        );
        const totalProfitLoss = assets.value.reduce(
          (sum, asset) => sum + asset.profitLoss,
          0
        );
        const totalInvested = assets.value.reduce(
          (sum, asset) => sum + asset.amount * asset.purchasePrice,
          0
        );
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
};
