const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedConfig() {
  try {
    console.log("🌱 Seeding configuration data...");

    // Currency configuration
    const configs = [
      {
        key: "USD_TO_IDR_RATE",
        value: "16500",
        description: "USD to IDR exchange rate",
      },
      {
        key: "CURRENCY_DEFAULT",
        value: "USD",
        description: "Default currency for the application",
      },
      {
        key: "CURRENCY_SUPPORTED",
        value: "USD,IDR",
        description: "Supported currencies in the application",
      },
    ];

    for (const config of configs) {
      await prisma.config.upsert({
        where: { key: config.key },
        update: {
          value: config.value,
          description: config.description,
          updatedAt: new Date(),
        },
        create: {
          key: config.key,
          value: config.value,
          description: config.description,
        },
      });
      console.log(`✅ Created/Updated config: ${config.key} = ${config.value}`);
    }

    console.log("🎉 Configuration seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding configuration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedConfig();
