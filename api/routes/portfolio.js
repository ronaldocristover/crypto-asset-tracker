const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Currency conversion service
const currencyService = {
  usdToIdr: (usdAmount) => usdAmount * 16500,
  idrToUsd: (idrAmount) => idrAmount / 16500,
  convertToUsd: (amount, fromCurrency) => {
    if (fromCurrency === "IDR") {
      return amount / 16500;
    }
    return amount; // Already USD
  },
  convertToIdr: (amount, fromCurrency) => {
    if (fromCurrency === "USD") {
      return amount * 16500;
    }
    return amount; // Already IDR
  },
};

// Get portfolio summary
router.get("/summary", async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        exchange: true,
      },
      orderBy: {
        submitDate: "desc",
      },
    });

    // Get total debt
    const debts = await prisma.debt.findMany();
    const totalDebt = debts.reduce((sum, debt) => {
      return (
        sum + currencyService.convertToUsd(Number(debt.amount), debt.currency)
      );
    }, 0);

    // Calculate portfolio totals
    const totalValue = assets.reduce((sum, asset) => {
      const value = Number(asset.amount) * Number(asset.currentPrice);
      return sum + currencyService.convertToUsd(value, asset.currency);
    }, 0);

    // Calculate profit/loss from latest submitted date minus total debt
    const latestSubmitDate = assets.length > 0 ? assets[0].submitDate : null;
    const assetsFromLatestDate = assets.filter(
      (asset) =>
        new Date(asset.submitDate).toISOString().split("T")[0] ===
        new Date(latestSubmitDate).toISOString().split("T")[0]
    );

    const totalValueFromLatestDate = assetsFromLatestDate.reduce(
      (sum, asset) => {
        const value = Number(asset.amount) * Number(asset.currentPrice);
        return sum + currencyService.convertToUsd(value, asset.currency);
      },
      0
    );

    const totalProfitLoss = totalValueFromLatestDate - totalDebt;

    const totalInvested = assets.reduce((sum, asset) => {
      const investedValue = Number(asset.amount) * Number(asset.purchasePrice);
      return sum + currencyService.convertToUsd(investedValue, asset.currency);
    }, 0);

    const totalProfitLossPercentage =
      totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    // Find top performer
    const topPerformer = assets.reduce((top, asset) => {
      const totalValue = Number(asset.amount) * Number(asset.currentPrice);
      const investedValue = Number(asset.amount) * Number(asset.purchasePrice);
      const profitLossPercentage =
        investedValue > 0
          ? ((totalValue - investedValue) / investedValue) * 100
          : 0;

      if (!top || profitLossPercentage > top.profitLossPercentage) {
        return {
          symbol: "ASSET",
          name: `${asset.exchange.name} Portfolio`,
          profitLossPercentage,
        };
      }
      return top;
    }, null);

    res.json({
      totalValue,
      totalProfitLoss,
      totalInvested,
      totalProfitLossPercentage,
      totalDebt,
      netValue: totalValue - totalDebt,
      latestSubmitDate: latestSubmitDate,
      assetCount: assets.length,
      topPerformer: topPerformer || {
        symbol: "N/A",
        name: "N/A",
        profitLossPercentage: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    res.status(500).json({ error: "Failed to fetch portfolio summary" });
  }
});

// Get daily growth data
router.get("/daily-growth", async (req, res) => {
  try {
    const dailyGrowth = await prisma.dailyGrowth.findMany({
      orderBy: {
        date: "asc",
      },
    });

    const formattedGrowth = dailyGrowth.map((growth) => ({
      date: growth.date,
      totalValue: Number(growth.totalValue),
      profitLoss: Number(growth.profitLoss),
    }));

    res.json(formattedGrowth);
  } catch (error) {
    console.error("Error fetching daily growth:", error);
    res.status(500).json({ error: "Failed to fetch daily growth" });
  }
});

// Get portfolio value over time calculated from assets
router.get("/portfolio-value-over-time", async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        exchange: true,
      },
      orderBy: {
        submitDate: "asc",
      },
    });

    // Get total debt for portfolio calculation
    const debts = await prisma.debt.findMany();
    const totalDebt = debts.reduce((sum, debt) => {
      return (
        sum + currencyService.convertToUsd(Number(debt.amount), debt.currency)
      );
    }, 0);

    if (assets.length === 0) {
      return res.json([]);
    }

    // Generate portfolio data points based on asset submit dates
    const portfolioData = [];

    // Group assets by submitDate
    const assetsByDate = {};
    assets.forEach((asset) => {
      const submitDate = new Date(asset.submitDate).toISOString().split("T")[0];
      if (!assetsByDate[submitDate]) {
        assetsByDate[submitDate] = [];
      }
      assetsByDate[submitDate].push(asset);
    });

    // Calculate cumulative portfolio value for each date
    const sortedDates = Object.keys(assetsByDate).sort();
    let cumulativeAssets = [];

    // Generate data points for each date when assets were added
    sortedDates.forEach((date) => {
      // Add new assets from this date to cumulative list
      cumulativeAssets = [...cumulativeAssets, ...assetsByDate[date]];

      // Recalculate total values with all assets up to this date
      const cumulativeTotalValue = cumulativeAssets.reduce((sum, asset) => {
        const value = Number(asset.amount) * Number(asset.currentPrice);
        return sum + currencyService.convertToUsd(value, asset.currency);
      }, 0);

      const cumulativeTotalInvested = cumulativeAssets.reduce((sum, asset) => {
        const investedValue =
          Number(asset.amount) * Number(asset.purchasePrice);
        return (
          sum + currencyService.convertToUsd(investedValue, asset.currency)
        );
      }, 0);

      const profitLoss = cumulativeTotalValue - totalDebt;
      const netPortfolioValue = cumulativeTotalValue - totalDebt;

      portfolioData.push({
        date: date,
        totalValue: cumulativeTotalValue,
        netValue: netPortfolioValue,
        profitLoss: profitLoss,
        totalDebt: totalDebt,
      });
    });

    // If there are assets but no data points, add current total
    if (portfolioData.length === 0 && assets.length > 0) {
      const totalValue = assets.reduce((sum, asset) => {
        const value = Number(asset.amount) * Number(asset.currentPrice);
        return sum + currencyService.convertToUsd(value, asset.currency);
      }, 0);

      const profitLoss = totalValue - totalDebt;
      const netPortfolioValue = totalValue - totalDebt;

      portfolioData.push({
        date: new Date().toISOString().split("T")[0],
        totalValue: totalValue,
        netValue: netPortfolioValue,
        // profitLoss: profitLoss,
        totalDebt: totalDebt,
      });
    }

    res.json(portfolioData);
  } catch (error) {
    console.error("Error calculating portfolio value over time:", error);
    res
      .status(500)
      .json({ error: "Failed to calculate portfolio value over time" });
  }
});

// Create or update daily growth record
router.post("/daily-growth", async (req, res) => {
  try {
    const { date, totalValue, profitLoss } = req.body;

    if (!date || totalValue === undefined || profitLoss === undefined) {
      return res
        .status(400)
        .json({ error: "Date, totalValue, and profitLoss are required" });
    }

    const dailyGrowth = await prisma.dailyGrowth.upsert({
      where: { date: new Date(date) },
      update: {
        totalValue: parseFloat(totalValue),
        profitLoss: parseFloat(profitLoss),
      },
      create: {
        date: new Date(date),
        totalValue: parseFloat(totalValue),
        profitLoss: parseFloat(profitLoss),
      },
    });

    res.json({
      date: dailyGrowth.date,
      totalValue: Number(dailyGrowth.totalValue),
      profitLoss: Number(dailyGrowth.profitLoss),
    });
  } catch (error) {
    console.error("Error creating/updating daily growth:", error);
    res.status(500).json({ error: "Failed to create/update daily growth" });
  }
});

// Get exchange distribution data for pie chart
router.get("/exchange-distribution", async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        exchange: true,
      },
    });

    // Group assets by exchange and calculate total value in USD
    const exchangeTotals = {};

    assets.forEach((asset) => {
      const valueInUsd = currencyService.convertToUsd(
        Number(asset.amount) * Number(asset.currentPrice),
        asset.currency
      );

      if (exchangeTotals[asset.exchange.name]) {
        exchangeTotals[asset.exchange.name] += valueInUsd;
      } else {
        exchangeTotals[asset.exchange.name] = valueInUsd;
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

    res.json({
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
      totalValue,
    });
  } catch (error) {
    console.error("Error fetching exchange distribution:", error);
    res.status(500).json({ error: "Failed to fetch exchange distribution" });
  }
});

// Get total debt sum
router.get("/total-debt", async (req, res) => {
  try {
    const debts = await prisma.debt.findMany();
    const totalDebtUSD = debts.reduce((sum, debt) => {
      return (
        sum + currencyService.convertToUsd(Number(debt.amount), debt.currency)
      );
    }, 0);

    const totalDebtIDR = currencyService.usdToIdr(totalDebtUSD);

    res.json({
      totalDebtUSD,
      totalDebtIDR,
      debtCount: debts.length,
      currency: "USD",
    });
  } catch (error) {
    console.error("Error calculating total debt:", error);
    res.status(500).json({ error: "Failed to calculate total debt" });
  }
});

// Get total revenue (assets - debts)
router.get("/revenue", async (req, res) => {
  try {
    // Get total assets value in USD
    const assets = await prisma.asset.findMany();
    const totalAssetsUSD = assets.reduce((sum, asset) => {
      const value = Number(asset.amount) * Number(asset.currentPrice);
      return sum + currencyService.convertToUsd(value, asset.currency);
    }, 0);

    // Get total debts in USD
    const debts = await prisma.debt.findMany();
    const totalDebtsUSD = debts.reduce((sum, debt) => {
      return (
        sum + currencyService.convertToUsd(Number(debt.amount), debt.currency)
      );
    }, 0);

    const totalRevenue = totalAssetsUSD - totalDebtsUSD;

    res.json({
      totalAssetsUSD,
      totalDebtsUSD,
      totalRevenue,
      currency: "USD",
    });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    res.status(500).json({ error: "Failed to calculate revenue" });
  }
});

module.exports = router;
