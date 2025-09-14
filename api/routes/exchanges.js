const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Get exchange names only (for frontend dropdown) - MUST be before /:id route
router.get("/names", async (req, res) => {
  try {
    const exchanges = await prisma.exchange.findMany({
      select: {
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Return array of strings as expected by frontend
    const exchangeNames = exchanges.map(exchange => exchange.name);
    res.json(exchangeNames);
  } catch (error) {
    console.error("Error fetching exchange names:", error);
    res.status(500).json({ error: "Failed to fetch exchange names" });
  }
});

// Get crypto list (static data as expected by frontend) - MUST be before /:id route
router.get("/crypto-list", async (req, res) => {
  try {
    const cryptoList = [
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
    
    res.json(cryptoList);
  } catch (error) {
    console.error("Error fetching crypto list:", error);
    res.status(500).json({ error: "Failed to fetch crypto list" });
  }
});

// Get all exchanges
router.get("/", async (req, res) => {
  try {
    const exchanges = await prisma.exchange.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(exchanges);
  } catch (error) {
    console.error("Error fetching exchanges:", error);
    res.status(500).json({ error: "Failed to fetch exchanges" });
  }
});

// Get single exchange
router.get("/:id", async (req, res) => {
  try {
    const exchange = await prisma.exchange.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        assets: true,
      },
    });

    if (!exchange) {
      return res.status(404).json({ error: "Exchange not found" });
    }

    res.json(exchange);
  } catch (error) {
    console.error("Error fetching exchange:", error);
    res.status(500).json({ error: "Failed to fetch exchange" });
  }
});

// Create new exchange
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Exchange name is required" });
    }

    const exchange = await prisma.exchange.create({
      data: {
        name,
        description: description || null,
      },
    });

    res.status(201).json(exchange);
  } catch (error) {
    console.error("Error creating exchange:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "Exchange with this name already exists" });
    } else {
      res.status(500).json({ error: "Failed to create exchange" });
    }
  }
});

// Update exchange
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const exchangeId = parseInt(req.params.id);

    const exchange = await prisma.exchange.update({
      where: { id: exchangeId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(exchange);
  } catch (error) {
    console.error("Error updating exchange:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "Exchange with this name already exists" });
    } else {
      res.status(500).json({ error: "Failed to update exchange" });
    }
  }
});

// Delete exchange
router.delete("/:id", async (req, res) => {
  try {
    const exchangeId = parseInt(req.params.id);

    // Check if exchange has assets
    const assetsCount = await prisma.asset.count({
      where: { exchangeId },
    });

    if (assetsCount > 0) {
      return res.status(400).json({
        error: "Cannot delete exchange with existing assets",
        assetsCount,
      });
    }

    await prisma.exchange.delete({
      where: { id: exchangeId },
    });

    res.json({ message: "Exchange deleted successfully" });
  } catch (error) {
    console.error("Error deleting exchange:", error);
    res.status(500).json({ error: "Failed to delete exchange" });
  }
});

// Seed default exchanges
router.post("/seed", async (req, res) => {
  try {
    const defaultExchanges = [
      {
        name: "Binance",
        description: "World's largest cryptocurrency exchange",
      },
      {
        name: "Coinbase",
        description: "Popular US-based cryptocurrency exchange",
      },
      { name: "Kraken", description: "Established cryptocurrency exchange" },
      { name: "KuCoin", description: "Global cryptocurrency exchange" },
      { name: "Bybit", description: "Cryptocurrency derivatives exchange" },
      { name: "OKX", description: "Leading cryptocurrency exchange" },
    ];

    const createdExchanges = [];

    for (const exchange of defaultExchanges) {
      try {
        const created = await prisma.exchange.create({
          data: exchange,
        });
        createdExchanges.push(created);
      } catch (error) {
        if (error.code !== "P2002") {
          // Ignore duplicate key errors
          throw error;
        }
      }
    }

    res.json({
      message: "Default exchanges seeded successfully",
      created: createdExchanges.length,
      exchanges: createdExchanges,
    });
  } catch (error) {
    console.error("Error seeding exchanges:", error);
    res.status(500).json({ error: "Failed to seed exchanges" });
  }
});

module.exports = router;
