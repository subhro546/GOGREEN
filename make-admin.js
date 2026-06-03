const { PrismaClient } = require('@prisma/client');

const email = process.argv[2];

if (!email) {
  console.error("Please provide an email address. Usage: node make-admin.js <email>");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      console.error(`User with email "${email}" not found. Please register this account on the website first!`);
      process.exit(1);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" }
    });

    console.log(`SUCCESS! User "${updatedUser.email}" has been promoted to role: ${updatedUser.role}`);
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
