const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists, skipping...");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@gmail.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("✅ Admin user created successfully:");
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Password: admin123 (change this in production!)`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Database seeding failed:", error);
    process.exit(1);
  });
