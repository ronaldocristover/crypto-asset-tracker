const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Get all debts
router.get("/", async (req, res) => {
  try {
    const debts = await prisma.debt.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedDebts = debts.map((debt) => ({
      id: debt.id,
      description: debt.description,
      amount: Number(debt.amount),
      currency: debt.currency,
      submitDate: debt.submitDate,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
    }));

    res.json(formattedDebts);
  } catch (error) {
    console.error("Error fetching debts:", error);
    res.status(500).json({ error: "Failed to fetch debts" });
  }
});

// Get single debt
router.get("/:id", async (req, res) => {
  try {
    const debt = await prisma.debt.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!debt) {
      return res.status(404).json({ error: "Debt not found" });
    }

    res.json({
      id: debt.id,
      description: debt.description,
      amount: Number(debt.amount),
      currency: debt.currency,
      submitDate: debt.submitDate,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching debt:", error);
    res.status(500).json({ error: "Failed to fetch debt" });
  }
});

// Create new debt
router.post("/", async (req, res) => {
  try {
    const { description, amount, currency, submitDate } = req.body;

    // Validate required fields
    if (!description || !amount) {
      return res
        .status(400)
        .json({ error: "Description and amount are required" });
    }

    const debt = await prisma.debt.create({
      data: {
        description,
        amount: parseFloat(amount),
        currency: currency || "USD",
        submitDate: submitDate ? new Date(submitDate) : new Date(),
      },
    });

    res.status(201).json({
      id: debt.id,
      description: debt.description,
      amount: Number(debt.amount),
      currency: debt.currency,
      submitDate: debt.submitDate,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
    });
  } catch (error) {
    console.error("Error creating debt:", error);
    res.status(500).json({ error: "Failed to create debt" });
  }
});

// Update debt
router.put("/:id", async (req, res) => {
  try {
    const { description, amount, currency, submitDate } = req.body;
    const debtId = parseInt(req.params.id);

    const debt = await prisma.debt.update({
      where: { id: debtId },
      data: {
        ...(description && { description }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(currency && { currency }),
        ...(submitDate && { submitDate: new Date(submitDate) }),
      },
    });

    res.json({
      id: debt.id,
      description: debt.description,
      amount: Number(debt.amount),
      currency: debt.currency,
      submitDate: debt.submitDate,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
    });
  } catch (error) {
    console.error("Error updating debt:", error);
    res.status(500).json({ error: "Failed to update debt" });
  }
});

// Delete debt
router.delete("/:id", async (req, res) => {
  try {
    const debtId = parseInt(req.params.id);

    await prisma.debt.delete({
      where: { id: debtId },
    });

    res.json({ message: "Debt deleted successfully" });
  } catch (error) {
    console.error("Error deleting debt:", error);
    res.status(500).json({ error: "Failed to delete debt" });
  }
});

// Get debt summary
router.get("/summary/totals", async (req, res) => {
  try {
    const debts = await prisma.debt.findMany();

    // Calculate totals by currency
    const totals = debts.reduce((acc, debt) => {
      const currency = debt.currency;
      if (!acc[currency]) {
        acc[currency] = 0;
      }
      acc[currency] += Number(debt.amount);
      return acc;
    }, {});

    // Convert to USD for total calculation (assuming 1 USD = 16500 IDR)
    const exchangeRate = 16500;
    const totalDebtUSD = Object.entries(totals).reduce(
      (total, [currency, amount]) => {
        if (currency === "USD") {
          return total + amount;
        } else if (currency === "IDR") {
          return total + amount / exchangeRate;
        }
        return total;
      },
      0
    );

    const totalDebtIDR = Object.entries(totals).reduce(
      (total, [currency, amount]) => {
        if (currency === "USD") {
          return total + amount * exchangeRate;
        } else if (currency === "IDR") {
          return total + amount;
        }
        return total;
      },
      0
    );

    res.json({
      totalDebtUSD,
      totalDebtIDR,
      debtCount: debts.length,
      debtsByCurrency: {
        USD: debts
          .filter((debt) => debt.currency === "USD")
          .map((debt) => ({
            id: debt.id,
            description: debt.description,
            amount: Number(debt.amount),
            currency: debt.currency,
            submitDate: debt.submitDate,
          })),
        IDR: debts
          .filter((debt) => debt.currency === "IDR")
          .map((debt) => ({
            id: debt.id,
            description: debt.description,
            amount: Number(debt.amount),
            currency: debt.currency,
            submitDate: debt.submitDate,
          })),
      },
    });
  } catch (error) {
    console.error("Error fetching debt summary:", error);
    res.status(500).json({ error: "Failed to fetch debt summary" });
  }
});

module.exports = router;
