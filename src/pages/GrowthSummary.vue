<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Growth Summary</h1>
      <p class="text-gray-600 mt-2">
        Track your crypto portfolio performance over time
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Revenue (USD)"
          :value="totalRevenue.usd"
          :icon="TrendingUpIcon"
          icon-class="text-success-600"
          icon-bg-class="bg-success-100"
        />
        <StatCard
          label="Total Portfolio Value"
          :value="summary.totalValue"
          :change="summary.totalProfitLoss"
          :change-percentage="summary.totalProfitLossPercentage"
          :icon="TrendingUpIcon"
          icon-class="text-primary-600"
          icon-bg-class="bg-primary-100"
        />
        <StatCard
          label="Total Profit/Loss"
          :value="summary.totalProfitLoss"
          :change-percentage="summary.totalProfitLossPercentage"
          :icon="
            summary.totalProfitLoss >= 0 ? TrendingUpIcon : TrendingDownIcon
          "
          :icon-class="
            summary.totalProfitLoss >= 0
              ? 'text-success-600'
              : 'text-danger-600'
          "
          :icon-bg-class="
            summary.totalProfitLoss >= 0 ? 'bg-success-100' : 'bg-danger-100'
          "
        />
        <StatCard
          label="Total Debt (USD)"
          :value="debtSummary.totalDebtUSD"
          :icon="DollarSignIcon"
          icon-class="text-danger-600"
          icon-bg-class="bg-danger-100"
        />
      </div>

      <!-- Currency Rate Info -->
      <div class="mb-6">
        <Card
          title="Currency Information"
          subtitle="Current exchange rates and conversions"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Current Rate -->
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-blue-900">
                    Current Exchange Rate
                  </h4>
                  <p class="text-2xl font-bold text-blue-600 mt-1">
                    1 USD =
                    {{ currencyDisplay.exchangeRate.toLocaleString("id-ID") }}
                    IDR
                  </p>
                </div>
                <div class="text-blue-500">
                  <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Conversion Example -->
            <div class="bg-green-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-green-900">
                    Conversion Example
                  </h4>
                  <p class="text-lg font-semibold text-green-600 mt-1">
                    $1,000 USD =
                    {{
                      currencyService.formatCurrency(
                        currencyDisplay.usd1000InIdr,
                        "IDR"
                      )
                    }}
                  </p>
                  <p class="text-sm text-green-700 mt-1">
                    $10,000 USD =
                    {{
                      currencyService.formatCurrency(
                        currencyDisplay.usd10000InIdr,
                        "IDR"
                      )
                    }}
                  </p>
                </div>
                <div class="text-green-500">
                  <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Portfolio Value Chart -->
        <Chart
          title="Portfolio Value Over Time"
          subtitle="Daily portfolio value tracking"
          :data="portfolioChartData"
          :options="portfolioChartOptions"
        />

        <!-- Profit/Loss Chart -->
        <Chart
          title="Profit/Loss Over Time"
          subtitle="Daily profit and loss tracking"
          :data="profitLossChartData"
          :options="profitLossChartOptions"
        />

        <!-- Asset Distribution by Exchange -->
        <Chart
          title="Asset Distribution by Exchange"
          subtitle="Portfolio allocation across exchanges"
          :data="exchangeDistributionData"
          :options="exchangeDistributionOptions"
          type="pie"
        />
      </div>

      <!-- Assets Table -->
      <Card
        title="Your Assets"
        subtitle="Detailed view of all your crypto holdings"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Asset
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Exchange
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Current Price
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Currency
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="asset in assets"
                :key="asset.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-primary-600">{{
                          asset.symbol
                        }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ asset.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ asset.symbol }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <span class="text-lg mr-2">{{
                      getExchangeIcon(asset.exchange)
                    }}</span>
                    {{ asset.exchange }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ asset.currency === "IDR" ? "Rp" : "$"
                  }}{{ (asset.currentPrice || 0).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ asset.currency || "USD" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ asset.currency === "IDR" ? "Rp" : "$"
                  }}{{
                    (
                      asset.totalValue ||
                      asset.currentPrice ||
                      0
                    ).toLocaleString()
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Top Performer Card -->
      <div
        v-if="summary.topPerformer && summary.topPerformer.symbol !== 'N/A'"
        class="mt-6"
      >
        <Card title="Top Performer" subtitle="Your best performing asset">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-semibold text-gray-900">
                {{ summary.topPerformer.name }}
              </h4>
              <p class="text-sm text-gray-500">
                {{ summary.topPerformer.symbol }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-success-600">
                +{{ summary.topPerformer.profitLossPercentage.toFixed(2) }}%
              </p>
              <p class="text-sm text-gray-500">Return</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { api } from "../services/api";
import { currencyService } from "../services/currency";
import Card from "../components/Card.vue";
import StatCard from "../components/StatCard.vue";
import Chart from "../components/Chart.vue";

// Icons (using simple SVG components)
const TrendingUpIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  `,
};

const TrendingDownIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  `,
};

const DollarSignIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  `,
};

const WalletIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  `,
};

export default {
  name: "GrowthSummary",
  components: {
    Card,
    StatCard,
    Chart,
  },
  setup() {
    const loading = ref(true);
    const assets = ref([]);
    const portfolioValueOverTime = ref([]);
    const debts = ref([]);
    const summary = ref({
      totalValue: 0,
      totalProfitLoss: 0,
      totalInvested: 0,
      totalProfitLossPercentage: 0,
      assetCount: 0,
      topPerformer: null,
    });
    const debtSummary = ref({
      totalDebtUSD: 0,
      totalDebtIDR: 0,
      debtCount: 0,
    });
    const totalRevenue = ref({
      usd: 0,
    });

    // Currency display data
    const currencyDisplay = ref({
      exchangeRate: 16500,
      usd1000InIdr: 0,
      usd10000InIdr: 0,
    });

    const loadCurrencyData = async () => {
      try {
        const exchangeRate = await currencyService.getExchangeRate();
        const usd1000InIdr = await currencyService.usdToIdr(1000);
        const usd10000InIdr = await currencyService.usdToIdr(10000);

        currencyDisplay.value = {
          exchangeRate,
          usd1000InIdr,
          usd10000InIdr,
        };
      } catch (error) {
        console.error("Error loading currency data:", error);
        // Use default values
        currencyDisplay.value = {
          exchangeRate: 16500,
          usd1000InIdr: 16500000,
          usd10000InIdr: 165000000,
        };
      }
    };

    // Exchange icons mapping
    const getExchangeIcon = (exchangeName) => {
      const icons = {
        Binance: "🟡",
        Coinbase: "🔵",
        Kraken: "🟣",
        KuCoin: "🟢",
        Bybit: "🟠",
        OKX: "🔴",
        "Gate.io": "⚫",
        Huobi: "🟤",
      };
      return icons[exchangeName] || "💎";
    };

    const loadData = async () => {
      try {
        loading.value = true;
        const [
          assetsData,
          portfolioValueData,
          summaryData,
          debtsData,
          debtSummaryData,
          revenueData,
        ] = await Promise.all([
          api.getAssets(),
          api.getPortfolioValueOverTime(),
          api.getPortfolioSummary(),
          api.getDebts(),
          api.getDebtSummary(),
          api.getTotalRevenue(),
        ]);

        assets.value = assetsData;
        portfolioValueOverTime.value = portfolioValueData;
        summary.value = summaryData;
        debts.value = debtsData;
        debtSummary.value = debtSummaryData;

        // Use revenue data from API
        totalRevenue.value = {
          usd: revenueData.totalRevenue,
        };
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        loading.value = false;
      }
    };

    const portfolioChartData = computed(() => ({
      labels: portfolioValueOverTime.value.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      datasets: [
        {
          label: "Portfolio Value (USD)",
          data: portfolioValueOverTime.value.map((item) => item.totalValue),
          borderColor: "rgb(14, 165, 233)",
          backgroundColor: "rgba(14, 165, 233, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    }));

    const portfolioChartOptions = computed(() => ({
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function (value) {
              return "$" + value.toLocaleString();
            },
          },
        },
      },
    }));

    const profitLossChartData = computed(() => ({
      labels: portfolioValueOverTime.value.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      datasets: [
        {
          label: "Profit/Loss",
          data: portfolioValueOverTime.value.map((item) => item.profitLoss),
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    }));

    const profitLossChartOptions = computed(() => ({
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return "$" + value.toLocaleString();
            },
          },
        },
      },
    }));

    const exchangeDistributionData = ref({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2,
        },
      ],
    });

    const loadExchangeDistribution = async () => {
      try {
        const data = await api.getExchangeDistribution();
        exchangeDistributionData.value = data;
      } catch (error) {
        console.error("Error loading exchange distribution:", error);
      }
    };

    const exchangeDistributionOptions = computed(() => ({
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${
                context.label
              }: $${value.toLocaleString()} (${percentage}%)`;
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }));

    onMounted(() => {
      loadData();
      loadExchangeDistribution();
      loadCurrencyData();
    });

    return {
      loading,
      assets,
      summary,
      debtSummary,
      totalRevenue,
      portfolioValueOverTime,
      currencyDisplay,
      getExchangeIcon,
      loadExchangeDistribution,
      portfolioChartData,
      portfolioChartOptions,
      profitLossChartData,
      profitLossChartOptions,
      exchangeDistributionData,
      exchangeDistributionOptions,
      currencyService,
      TrendingUpIcon,
      TrendingDownIcon,
      DollarSignIcon,
      WalletIcon,
    };
  },
};
</script>
