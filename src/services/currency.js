// Currency conversion service
// Default exchange rate: 1 USD = 15,000 IDR (approximate rate)
const DEFAULT_EXCHANGE_RATE = 16500;

export const currencyService = {
  // Convert USD to IDR
  usdToIdr(usdAmount) {
    return usdAmount * DEFAULT_EXCHANGE_RATE;
  },

  // Convert IDR to USD
  idrToUsd(idrAmount) {
    return idrAmount / DEFAULT_EXCHANGE_RATE;
  },

  // Get exchange rate
  getExchangeRate() {
    return DEFAULT_EXCHANGE_RATE;
  },

  // Format currency with proper symbols
  formatCurrency(amount, currency) {
    if (currency === "IDR") {
      return `Rp${amount.toLocaleString("id-ID")}`;
    } else {
      return `$${amount.toLocaleString("en-US")}`;
    }
  },

  // Convert and format to USD
  convertToUsd(amount, fromCurrency) {
    if (fromCurrency === "IDR") {
      return this.idrToUsd(amount);
    }
    return amount; // Already USD
  },

  // Convert and format to IDR
  convertToIdr(amount, fromCurrency) {
    if (fromCurrency === "USD") {
      return this.usdToIdr(amount);
    }
    return amount; // Already IDR
  },

  // Get total value in USD (converts all currencies to USD)
  getTotalValueInUsd(assets) {
    return assets.reduce((total, asset) => {
      const valueInUsd = this.convertToUsd(asset.totalValue, asset.currency);
      return total + valueInUsd;
    }, 0);
  },

  // Get total value in IDR (converts all currencies to IDR)
  getTotalValueInIdr(assets) {
    return assets.reduce((total, asset) => {
      const valueInIdr = this.convertToIdr(asset.totalValue, asset.currency);
      return total + valueInIdr;
    }, 0);
  },
};
