import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create a dummy user for reviews
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'plantlover@example.com' },
    update: {},
    create: {
      email: 'plantlover@example.com',
      name: 'Sarah Jenkins',
      password: passwordHash,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'green_thumb@example.com' },
    update: {},
    create: {
      email: 'green_thumb@example.com',
      name: 'Michael T.',
      password: passwordHash,
      role: 'USER',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'emily.r@example.com' },
    update: {},
    create: {
      email: 'emily.r@example.com',
      name: 'Emily R.',
      password: passwordHash,
      role: 'USER',
    },
  });

  console.log('Users seeded.');

  // 2. Create Categories
  const categories = [
    { name: 'Indoor Plants', tag: 'Purify Air', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop' },
    { name: 'Outdoor Plants', tag: 'Sun Lovers', image: 'https://images.unsplash.com/photo-1584589167171-54756e0c80d1?q=80&w=800&auto=format&fit=crop' },
    { name: 'Seeds', tag: 'Grow Your Own', image: 'https://images.unsplash.com/photo-1595858801931-e8d975a6c0c2?q=80&w=800&auto=format&fit=crop' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { tag: cat.tag, image: cat.image },
      create: { name: cat.name, tag: cat.tag, image: cat.image },
    });
  }
  console.log('Categories seeded.');

  // 3. Create Products with subcategories
  const products = [
    {
      name: 'Monstera Deliciosa',
      description: 'A beautiful indoor plant with iconic split leaves. Very easy to care for and grows quite large.',
      price: 1299,
      category: 'Indoor Plants',
      subcategory: 'Low Light',
      stock: 15,
      images: JSON.stringify(['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop']),
      isIndoor: true,
    },
    {
      name: 'Snake Plant',
      description: 'The ultimate beginner plant. Thrives on neglect and is an excellent air purifier.',
      price: 599,
      category: 'Indoor Plants',
      subcategory: 'Air Purifiers',
      stock: 30,
      images: JSON.stringify(['https://images.unsplash.com/photo-1599421481545-0d29469e38e1?q=80&w=800&auto=format&fit=crop']),
      isIndoor: true,
    },
    {
      name: 'Bougainvillea (Pink)',
      description: 'A stunning outdoor plant that produces vibrant pink flowers. Loves direct sunlight.',
      price: 850,
      category: 'Outdoor Plants',
      subcategory: 'Flowering',
      stock: 10,
      images: JSON.stringify(['https://images.unsplash.com/photo-1611116244632-41147a275e7a?q=80&w=800&auto=format&fit=crop']),
      isIndoor: false,
    },
    {
      name: 'Ficus Bonsai',
      description: 'A beautiful miniature tree perfect for gifting or decorating your desk.',
      price: 2499,
      category: 'Indoor Plants',
      subcategory: 'Bonsai',
      stock: 5,
      images: JSON.stringify(['https://images.unsplash.com/photo-1599598425947-33001c3e6eb8?q=80&w=800&auto=format&fit=crop']),
      isIndoor: true,
    },
    {
      name: 'Cherry Tomato Seeds',
      description: 'Grow your own sweet and juicy cherry tomatoes at home. High germination rate.',
      price: 149,
      category: 'Seeds',
      subcategory: 'Vegetables',
      stock: 100,
      images: JSON.stringify(['https://images.unsplash.com/photo-1592194996534-4b0091b65b12?q=80&w=800&auto=format&fit=crop']),
      isIndoor: false,
    },
    {
      name: 'Sunflower Seeds',
      description: 'Brighten up your garden with these giant sunflowers.',
      price: 99,
      category: 'Seeds',
      subcategory: 'Flowers',
      stock: 50,
      images: JSON.stringify(['https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop']),
      isIndoor: false,
    }
  ];

  const createdProducts = [];
  for (const p of products) {
    // Check if it exists by name to avoid duplicates during repeated seeds
    let prod = await prisma.product.findFirst({ where: { name: p.name } });
    if (!prod) {
      prod = await prisma.product.create({ data: p });
    }
    createdProducts.push(prod);
  }
  console.log('Products seeded.');

  // 4. Create Fake Testimonials
  const reviewsData = [
    {
      rating: 5,
      comment: "Absolutely love my Monstera! It arrived in perfect condition and the packaging was so secure. It's already putting out a new leaf!",
      userId: user1.id,
      productId: createdProducts[0].id, // Monstera
    },
    {
      rating: 5,
      comment: "The Snake Plant is exactly as described. It fits perfectly in my bedroom and I don't have to worry about watering it constantly. Highly recommend GoGreen!",
      userId: user2.id,
      productId: createdProducts[1].id, // Snake Plant
    },
    {
      rating: 4,
      comment: "The bonsai tree is beautiful and very healthy. It took a few extra days to deliver, but it was worth the wait.",
      userId: user3.id,
      productId: createdProducts[3].id, // Ficus Bonsai
    },
    {
      rating: 5,
      comment: "Planted the cherry tomato seeds 2 weeks ago and almost all of them sprouted! The quality of seeds here is unmatched.",
      userId: user1.id,
      productId: createdProducts[4].id, // Tomato Seeds
    }
  ];

  for (const r of reviewsData) {
    const existingReview = await prisma.review.findFirst({
      where: { userId: r.userId, productId: r.productId }
    });
    if (!existingReview) {
      await prisma.review.create({ data: r });
    }
  }

  console.log('Testimonials seeded.');
  console.log('Seeding complete! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
