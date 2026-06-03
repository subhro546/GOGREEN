import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning up existing database...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  console.log('Seeding database with plants...')

  const products = [
    {
      name: 'Monstera Deliciosa',
      description: 'The Swiss Cheese Plant. Famous for its large, glossy, fenestrated leaves. A must-have for any indoor jungle.',
      price: 45.00,
      category: 'Indoor Plant',
      stock: 15,
      images: JSON.stringify(['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=500&q=80']),
      isIndoor: true,
    },
    {
      name: 'Fiddle Leaf Fig',
      description: 'A gorgeous statement plant with large, violin-shaped leaves. Prefers bright, indirect light.',
      price: 65.00,
      category: 'Indoor Plant',
      stock: 8,
      images: JSON.stringify(['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80']),
      isIndoor: true,
    },
    {
      name: 'Snake Plant',
      description: 'Extremely resilient and low maintenance. Known for its air-purifying qualities.',
      price: 30.00,
      category: 'Low Maintenance',
      stock: 25,
      images: JSON.stringify(['https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=500&q=80']),
      isIndoor: true,
    },
    {
      name: 'Peace Lily',
      description: 'Beautiful white blooms and dark green foliage. Great at cleaning indoor air.',
      price: 35.00,
      category: 'Air Purifying',
      stock: 12,
      images: JSON.stringify(['https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=500&q=80']),
      isIndoor: true,
    },
    {
      name: 'Bird of Paradise',
      description: 'Brings a tropical feel to any room with its large, banana-like leaves.',
      price: 85.00,
      category: 'Indoor Plant',
      stock: 5,
      images: JSON.stringify(['https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=500&q=80']),
      isIndoor: true,
    },
    {
      name: 'Pothos Golden',
      description: 'The perfect trailing plant for beginners. Fast growing and very forgiving.',
      price: 20.00,
      category: 'Low Maintenance',
      stock: 30,
      images: JSON.stringify(['https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80']),
      isIndoor: true,
    },
    {
      name: 'Majesty Palm',
      description: 'A beautiful indoor palm tree that adds elegance to any bright corner.',
      price: 55.00,
      category: 'Indoor Plant',
      stock: 10,
      images: JSON.stringify(['https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=500&q=80']),
      isIndoor: true,
    },
    {
      name: 'ZZ Plant',
      description: 'Virtually indestructible. Can survive in very low light conditions.',
      price: 28.00,
      category: 'Low Maintenance',
      stock: 20,
      images: JSON.stringify(['https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=500&q=80']),
      isIndoor: true,
    }
  ]

  for (const p of products) {
    await prisma.product.create({
      data: p
    })
  }

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
