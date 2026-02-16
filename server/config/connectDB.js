import mongoose from 'mongoose'
import { prisma } from '../lib/prisma.js'

export const ConnectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL

    if (!mongoUri) {
      throw new Error('MONGODB_URI or DATABASE_URL is required')
    }

    await Promise.all([
      mongoose.connect(mongoUri),
      prisma.$connect(),
    ])

    console.log('MongoDB connected...')
    console.log('Prisma connected...')
  } catch (error) {
    console.error('Error connecting to database:', error.message)
    process.exit(1)
  }
}
