// Currency conversion service
import { ref } from "vue";
import { api } from "./api";

// Default exchange rate (fallback)
const DEFAULT_EXCHANGE_RATE = 16500;

// Cache for configuration data
const configCache = ref({
  data: null,
  lastUpdated: null,
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
});

export const currencyService = {
  // Get configuration from API with caching
  async getConfig() {
    const now = new Date().getTime();

    // Check if cache is valid
    if (
      configCache.value.data &&
      configCache.value.lastUpdated &&
      now - configCache.value.lastUpdated < configCache.value.cacheDuration
    ) {
      return configCache.value.data;
    }

    try {
      const response = await api.getConfig();
      if (response.success) {
        configCache.value.data = response.data;
        configCache.value.lastUpdated = now;
        return response.data;
      }
    } catch (error) {
      console.error("Failed to fetch config, using default values:", error);
    }

    // Return default config if API fails
    return {
      USD_TO_IDR_RATE: { value: DEFAULT_EXCHANGE_RATE.toString() },
      CURRENCY_DEFAULT: { value: "USD" },
      CURRENCY_SUPPORTED: { value: "USD,IDR" },
    };
  },

  // Get current exchange rate from config
  async getExchangeRate() {
    const config = await currencyService.getConfig();
    return parseFloat(config.USD_TO_IDR_RATE?.value || DEFAULT_EXCHANGE_RATE);
  },

  // Convert USD to IDR using config
  async usdToIdr(usdAmount) {
    const rate = await currencyService.getExchangeRate();
    return usdAmount * rate;
  },

  // Convert IDR to USD using config
  async idrToUsd(idrAmount) {
    const rate = await currencyService.getExchangeRate();
    return idrAmount / rate;
  },

  // Format currency with proper symbols
  formatCurrency(amount, currency) {
    if (currency === "IDR") {
      return `Rp${amount.toLocaleString("id-ID")}`;
    } else {
      return `$${amount.toLocaleString("en-US")}`;
    }
  },

  // Convert and format to USD using config
  async convertToUsd(amount, fromCurrency) {
    if (fromCurrency === "IDR") {
      return await this.idrToUsd(amount);
    }
    return amount; // Already USD
  },

  // Convert and format to IDR using config
  async convertToIdr(amount, fromCurrency) {
    if (fromCurrency === "USD") {
      return await this.usdToIdr(amount);
    }
    return amount; // Already IDR
  },

  // Get total value in USD (converts all currencies to USD)
  async getTotalValueInUsd(assets) {
    let total = 0;
    for (const asset of assets) {
      const valueInUsd = await this.convertToUsd(
        asset.totalValue,
        asset.currency
      );
      total += valueInUsd;
    }
    return total;
  },

  // Get total value in IDR (converts all currencies to IDR)
  async getTotalValueInIdr(assets) {
    let total = 0;
    for (const asset of assets) {
      const valueInIdr = await this.convertToIdr(
        asset.totalValue,
        asset.currency
      );
      total += valueInIdr;
    }
    return total;
  },

  // Clear cache (useful for testing or when config changes)
  clearCache() {
    configCache.value.data = null;
    configCache.value.lastUpdated = null;
  },
};
