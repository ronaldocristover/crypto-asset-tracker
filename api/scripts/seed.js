const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Create exchanges
    const exchanges = [
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

    console.log("📊 Creating exchanges...");
    for (const exchange of exchanges) {
      await prisma.exchange.upsert({
        where: { name: exchange.name },
        update: {},
        create: exchange,
      });
    }

    // Get created exchanges
    const createdExchanges = await prisma.exchange.findMany();
    console.log(`✅ Created ${createdExchanges.length} exchanges`);

    // Create sample assets
    const sampleAssets = [
      {
        exchangeId: createdExchanges[0].id, // Binance
        amount: 0.5,
        purchasePrice: 45000,
        currentPrice: 47000,
        currency: "USD",
        submitDate: new Date("2024-01-15"),
      },
      {
        exchangeId: createdExchanges[1].id, // Coinbase
        amount: 1.2,
        purchasePrice: 42000,
        currentPrice: 47000,
        currency: "USD",
        submitDate: new Date("2024-02-01"),
      },
      {
        exchangeId: createdExchanges[2].id, // Kraken
        amount: 0.8,
        purchasePrice: 44000,
        currentPrice: 47000,
        currency: "USD",
        submitDate: new Date("2024-02-15"),
      },
      {
        exchangeId: createdExchanges[0].id, // Binance
        amount: 1000000,
        purchasePrice: 15000,
        currentPrice: 16500,
        currency: "IDR",
        submitDate: new Date("2024-03-01"),
      },
    ];

    console.log("💰 Creating sample assets...");
    for (const asset of sampleAssets) {
      await prisma.asset.create({
        data: asset,
      });
    }
    console.log(`✅ Created ${sampleAssets.length} sample assets`);

    // Create sample debts
    const sampleDebts = [
      {
        description: "Credit Card Debt",
        amount: 2500,
        currency: "USD",
        submitDate: new Date("2024-01-01"),
      },
      {
        description: "Personal Loan",
        amount: 5000000,
        currency: "IDR",
        submitDate: new Date("2024-02-01"),
      },
    ];

    console.log("💳 Creating sample debts...");
    for (const debt of sampleDebts) {
      await prisma.debt.create({
        data: debt,
      });
    }
    console.log(`✅ Created ${sampleDebts.length} sample debts`);

    // Create sample daily growth data
    const sampleDailyGrowth = [
      {
        date: new Date("2024-01-01"),
        totalValue: 45000,
        profitLoss: 2000,
      },
      {
        date: new Date("2024-01-02"),
        totalValue: 46000,
        profitLoss: 3000,
      },
      {
        date: new Date("2024-01-03"),
        totalValue: 47000,
        profitLoss: 4000,
      },
      {
        date: new Date("2024-01-04"),
        totalValue: 46500,
        profitLoss: 3500,
      },
      {
        date: new Date("2024-01-05"),
        totalValue: 48000,
        profitLoss: 5000,
      },
    ];

    console.log("📈 Creating sample daily growth data...");
    for (const growth of sampleDailyGrowth) {
      await prisma.dailyGrowth.upsert({
        where: { date: growth.date },
        update: growth,
        create: growth,
      });
    }
    console.log(`✅ Created ${sampleDailyGrowth.length} daily growth records`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
