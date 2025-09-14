const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Get all assets
router.get("/", async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        exchange: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate additional fields
    const assetsWithCalculations = assets.map((asset) => {
      const totalValue = Number(asset.amount) * Number(asset.currentPrice);
      const investedValue = Number(asset.amount) * Number(asset.purchasePrice);
      const profitLoss = totalValue - investedValue;
      const profitLossPercentage =
        investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

      return {
        id: asset.id,
        symbol: "ASSET",
        name: `${asset.exchange.name} Portfolio`,
        exchange: asset.exchange.name,
        amount: Number(asset.amount),
        purchasePrice: Number(asset.purchasePrice),
        currentPrice: Number(asset.currentPrice),
        currency: asset.currency,
        submitDate: asset.submitDate,
        purchaseDate: asset.submitDate,
        totalValue,
        profitLoss,
        profitLossPercentage,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      };
    });

    res.json(assetsWithCalculations);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: "Failed to fetch assets" });
  }
});

// Get single asset
router.get("/:id", async (req, res) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        exchange: true,
      },
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const totalValue = Number(asset.amount) * Number(asset.currentPrice);
    const investedValue = Number(asset.amount) * Number(asset.purchasePrice);
    const profitLoss = totalValue - investedValue;
    const profitLossPercentage =
      investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

    res.json({
      id: asset.id,
      symbol: "ASSET",
      name: `${asset.exchange.name} Portfolio`,
      exchange: asset.exchange.name,
      amount: Number(asset.amount),
      purchasePrice: Number(asset.purchasePrice),
      currentPrice: Number(asset.currentPrice),
      currency: asset.currency,
      submitDate: asset.submitDate,
      purchaseDate: asset.submitDate,
      totalValue,
      profitLoss,
      profitLossPercentage,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching asset:", error);
    res.status(500).json({ error: "Failed to fetch asset" });
  }
});

// Create new asset
router.post("/", async (req, res) => {
  try {
    const {
      exchangeId,
      exchange,
      amount,
      purchasePrice,
      currentPrice,
      currency,
      submitDate,
      purchaseDate,
    } = req.body;

    // Handle exchange name to ID conversion if needed
    let finalExchangeId = exchangeId;
    if (!exchangeId && exchange) {
      const exchangeRecord = await prisma.exchange.findFirst({
        where: { name: exchange }
      });
      if (exchangeRecord) {
        finalExchangeId = exchangeRecord.id;
      } else {
        return res.status(400).json({ error: "Exchange not found" });
      }
    }

    // Validate required fields
    if (!finalExchangeId || !amount || !purchasePrice || !currentPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const asset = await prisma.asset.create({
      data: {
        exchangeId: parseInt(finalExchangeId),
        amount: parseFloat(amount),
        purchasePrice: parseFloat(purchasePrice),
        currentPrice: parseFloat(currentPrice),
        currency: currency || "USD",
        submitDate: submitDate || purchaseDate ? new Date(submitDate || purchaseDate) : new Date(),
      },
      include: {
        exchange: true,
      },
    });

    const totalValue = Number(asset.amount) * Number(asset.currentPrice);
    const investedValue = Number(asset.amount) * Number(asset.purchasePrice);
    const profitLoss = totalValue - investedValue;
    const profitLossPercentage =
      investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

    res.status(201).json({
      id: asset.id,
      symbol: "ASSET",
      name: `${asset.exchange.name} Portfolio`,
      exchange: asset.exchange.name,
      amount: Number(asset.amount),
      purchasePrice: Number(asset.purchasePrice),
      currentPrice: Number(asset.currentPrice),
      currency: asset.currency,
      submitDate: asset.submitDate,
      purchaseDate: asset.submitDate,
      totalValue,
      profitLoss,
      profitLossPercentage,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    });
  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({ error: "Failed to create asset" });
  }
});

// Update asset
router.put("/:id", async (req, res) => {
  try {
    const {
      exchangeId,
      amount,
      purchasePrice,
      currentPrice,
      currency,
      submitDate,
    } = req.body;
    const assetId = parseInt(req.params.id);

    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        ...(exchangeId && { exchangeId: parseInt(exchangeId) }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(purchasePrice && { purchasePrice: parseFloat(purchasePrice) }),
        ...(currentPrice && { currentPrice: parseFloat(currentPrice) }),
        ...(currency && { currency }),
        ...(submitDate && { submitDate: new Date(submitDate) }),
      },
      include: {
        exchange: true,
      },
    });

    const totalValue = Number(asset.amount) * Number(asset.currentPrice);
    const investedValue = Number(asset.amount) * Number(asset.purchasePrice);
    const profitLoss = totalValue - investedValue;
    const profitLossPercentage =
      investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

    res.json({
      id: asset.id,
      symbol: "ASSET",
      name: `${asset.exchange.name} Portfolio`,
      exchange: asset.exchange.name,
      amount: Number(asset.amount),
      purchasePrice: Number(asset.purchasePrice),
      currentPrice: Number(asset.currentPrice),
      currency: asset.currency,
      submitDate: asset.submitDate,
      purchaseDate: asset.submitDate,
      totalValue,
      profitLoss,
      profitLossPercentage,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    });
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: "Failed to update asset" });
  }
});

// Delete asset
router.delete("/:id", async (req, res) => {
  try {
    const assetId = parseInt(req.params.id);

    await prisma.asset.delete({
      where: { id: assetId },
    });

    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ error: "Failed to delete asset" });
  }
});

module.exports = router;
