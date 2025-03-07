import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const usersData: Prisma.UserCreateManyInput[] = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { firstName: 'James', lastName: 'Smith', email: 'james.smith@example.com' },
    { firstName: 'Robert', lastName: 'Johnson', email: 'robert.johnson@example.com' },
    { firstName: 'Michael', lastName: 'Williams', email: 'michael.williams@example.com' },
    { firstName: 'William', lastName: 'Brown', email: 'william.brown@example.com' },
    { firstName: 'David', lastName: 'Jones', email: 'david.jones@example.com' },
    { firstName: 'Richard', lastName: 'Miller', email: 'richard.miller@example.com' },
    { firstName: 'Joseph', lastName: 'Davis', email: 'joseph.davis@example.com' },
    { firstName: 'Thomas', lastName: 'Garcia', email: 'thomas.garcia@example.com' },
    { firstName: 'Charles', lastName: 'Martinez', email: 'charles.martinez@example.com' },
];

async function main() {
    console.log(`Seeding ${usersData.length} users...`);
    console.log('Skipping duplicates = true');

    const users = await prisma.user.createMany({
        data: usersData,
        skipDuplicates: true,
    });

    console.log(`Created ${users.count} users.`);
    console.log(`Seeding finished.`);
  }

  main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })