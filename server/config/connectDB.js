import mongoose from 'mongoose'
import { prisma } from '../lib/prisma.js'

export const ConnectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for MySQL Prisma connection')
    }

    await prisma.$connect()
    console.log('MySQL connected through Prisma...')

    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('MongoDB connected for legacy modules...')
    }
  } catch (error) {
    console.error('Error connecting to database:', error.message)
    process.exit(1)
  }
}
