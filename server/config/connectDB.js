import { prisma } from '../lib/prisma.js'

export const ConnectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for MySQL Prisma connection')
    }

    await prisma.$connect()
    console.log('MySQL connected through Prisma...')
  } catch (error) {
    console.error('Error connecting to database:', error.message)
    process.exit(1)
  }
}
