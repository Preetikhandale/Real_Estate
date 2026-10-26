import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './src/models/User.js'

dotenv.config()

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/real-estate-crm')
    console.log('Connected to MongoDB')

    const superAdmins = [
      { name: 'Besto RE', email: 'bestore@mail.com', password: 'Test@123' },
      { name: 'Platform Owner', email: 'superadmin@crm.local', password: 'SuperAdmin@123' },
    ]

    for (const sa of superAdmins) {
      const existing = await User.findOne({ email: sa.email })
      if (existing) {
        existing.name = sa.name
        existing.role = 'super_admin'
        existing.firm = null
        existing.isActive = true
        existing.password = sa.password
        await existing.save()
        console.log(`Updated ${sa.email} -> super_admin (active), password reset to: ${sa.password}`)
      } else {
        await User.create({
          name: sa.name,
          email: sa.email,
          password: sa.password,
          role: 'super_admin',
          firm: null,
          isActive: true,
        })
        console.log(`Created ${sa.email} -> super_admin (active), password: ${sa.password}`)
      }
    }

    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seed()
