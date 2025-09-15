const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Get all configs
router.get("/", async (req, res) => {
  try {
    const configs = await prisma.config.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        key: "asc",
      },
    });

    // Convert to key-value object for easier frontend usage
    const configObject = {};
    configs.forEach((config) => {
      configObject[config.key] = {
        value: config.value,
        description: config.description,
        updatedAt: config.updatedAt,
      };
    });

    res.json({
      success: true,
      data: configObject,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching configs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch configuration",
    });
  }
});

// Get specific config by key
router.get("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const config = await prisma.config.findFirst({
      where: {
        key: key,
        isActive: true,
      },
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        error: "Configuration not found",
      });
    }

    res.json({
      success: true,
      data: {
        key: config.key,
        value: config.value,
        description: config.description,
        updatedAt: config.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch configuration",
    });
  }
});

// Create or update config
router.post("/", async (req, res) => {
  try {
    const { key, value, description } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: "Key and value are required",
      });
    }

    const config = await prisma.config.upsert({
      where: { key: key },
      update: {
        value: value,
        description: description || null,
        updatedAt: new Date(),
      },
      create: {
        key: key,
        value: value,
        description: description || null,
      },
    });

    res.json({
      success: true,
      data: {
        key: config.key,
        value: config.value,
        description: config.description,
        updatedAt: config.updatedAt,
      },
      message: "Configuration saved successfully",
    });
  } catch (error) {
    console.error("Error saving config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save configuration",
    });
  }
});

// Update config
router.put("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description, isActive } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        error: "Value is required",
      });
    }

    const config = await prisma.config.update({
      where: { key: key },
      data: {
        value: value,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: {
        key: config.key,
        value: config.value,
        description: config.description,
        isActive: config.isActive,
        updatedAt: config.updatedAt,
      },
      message: "Configuration updated successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Configuration not found",
      });
    }
    console.error("Error updating config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update configuration",
    });
  }
});

// Delete config (soft delete by setting isActive to false)
router.delete("/:key", async (req, res) => {
  try {
    const { key } = req.params;

    const config = await prisma.config.update({
      where: { key: key },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Configuration deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Configuration not found",
      });
    }
    console.error("Error deleting config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete configuration",
    });
  }
});

module.exports = router;
