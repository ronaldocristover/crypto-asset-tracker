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
                  Amount
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Exchange
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Purchase Price
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
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  P&L
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
                  {{ asset.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ asset.exchange }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ asset.purchasePrice.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ asset.currency === "IDR" ? "Rp" : "$"
                  }}{{ asset.currentPrice.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ asset.currency || "USD" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ asset.currency === "IDR" ? "Rp" : "$"
                  }}{{ asset.totalValue.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="font-medium"
                    :class="
                      asset.profitLoss >= 0
                        ? 'text-success-600'
                        : 'text-danger-600'
                    "
                  >
                    {{ asset.profitLoss >= 0 ? "+" : ""
                    }}{{ asset.currency === "IDR" ? "Rp" : "$"
                    }}{{ asset.profitLoss.toLocaleString() }} ({{
                      asset.profitLossPercentage >= 0 ? "+" : ""
                    }}{{ asset.profitLossPercentage.toFixed(2) }}%)
                  </span>
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
    const dailyGrowth = ref([]);
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

    const loadData = async () => {
      try {
        loading.value = true;
        const [
          assetsData,
          growthData,
          summaryData,
          debtsData,
          debtSummaryData,
        ] = await Promise.all([
          api.getAssets(),
          api.getDailyGrowth(),
          api.getPortfolioSummary(),
          api.getDebts(),
          api.getDebtSummary(),
        ]);

        assets.value = assetsData;
        dailyGrowth.value = growthData;
        summary.value = summaryData;
        debts.value = debtsData;
        debtSummary.value = debtSummaryData;

        // Calculate total revenue (assets - debts) - USD only
        const assetsUSD = currencyService.getTotalValueInUsd(assetsData);

        totalRevenue.value = {
          usd: assetsUSD - debtSummaryData.totalDebtUSD,
        };
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        loading.value = false;
      }
    };

    const portfolioChartData = computed(() => ({
      labels: dailyGrowth.value.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      datasets: [
        {
          label: "Portfolio Value (USD)",
          data: dailyGrowth.value.map((item) => item.totalValue),
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
      labels: dailyGrowth.value.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      datasets: [
        {
          label: "Profit/Loss",
          data: dailyGrowth.value.map((item) => item.profitLoss),
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

    const exchangeDistributionData = computed(() => {
      // Group assets by exchange and calculate total value in USD
      const exchangeTotals = {};

      assets.value.forEach((asset) => {
        const valueInUsd = currencyService.convertToUsd(
          asset.totalValue,
          asset.currency
        );
        if (exchangeTotals[asset.exchange]) {
          exchangeTotals[asset.exchange] += valueInUsd;
        } else {
          exchangeTotals[asset.exchange] = valueInUsd;
        }
      });

      const exchanges = Object.keys(exchangeTotals);
      const values = Object.values(exchangeTotals);
      const totalValue = values.reduce((sum, val) => sum + val, 0);

      // Generate colors for each exchange
      const colors = [
        "rgb(14, 165, 233)", // Blue
        "rgb(34, 197, 94)", // Green
        "rgb(239, 68, 68)", // Red
        "rgb(168, 85, 247)", // Purple
        "rgb(245, 158, 11)", // Yellow
        "rgb(236, 72, 153)", // Pink
        "rgb(6, 182, 212)", // Cyan
        "rgb(34, 197, 94)", // Emerald
      ];

      return {
        labels: exchanges,
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, exchanges.length),
            borderColor: colors
              .slice(0, exchanges.length)
              .map((color) =>
                color.replace("rgb", "rgba").replace(")", ", 0.8)")
              ),
            borderWidth: 2,
          },
        ],
      };
    });

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
    });

    return {
      loading,
      assets,
      summary,
      debtSummary,
      totalRevenue,
      portfolioChartData,
      portfolioChartOptions,
      profitLossChartData,
      profitLossChartOptions,
      exchangeDistributionData,
      exchangeDistributionOptions,
      TrendingUpIcon,
      TrendingDownIcon,
      DollarSignIcon,
      WalletIcon,
    };
  },
};
</script>
