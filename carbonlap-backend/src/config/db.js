const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ [DB] Database connected successfully');
  } catch (error) {
    console.error('❌ [DB] Connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = { prisma, connectDB };
