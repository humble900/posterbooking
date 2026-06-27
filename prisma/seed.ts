import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed PosterBooking as the default company
  const posterbooking = await prisma.company.upsert({
    where: { id: 'pb-default-001' },
    update: {},
    create: {
      id: 'pb-default-001',
      name: 'PosterBooking',
      website: 'https://posterbooking.com',
      support_email: 'support@posterbooking.com',
      sales_email: 'sales@posterbooking.com',
      knowledge_base_url: 'https://posterbooking.com/help',
      signup_url: 'https://posterbooking.com/signup',
      whatsapp_number: null,
      active: true,
    },
  });

  console.log(`✅ Company seeded: ${posterbooking.name} (${posterbooking.id})`);
  console.log('🌱 Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
