import {type Prisma} from "@prisma/client";

import prisma from "@/lib/prisma";
import {hashPassword} from "@/lib/password";

async function main() {
  // insert admin
  const usersAdmin: Prisma.UserCreateInput[] = [
    {
      email: "rika@gmail.com",
      name: "Rika",
      password: await hashPassword("password"),
      phoneNumber: "081511791945",
      isAdmin: true,
    },
    {
      email: "raka@gmail.com",
      name: "Raka",
      password: await hashPassword("password"),
      phoneNumber: "081511791946",
      isAdmin: true,
    },
  ];
  const resUsers = await prisma.user.createMany({
    data: usersAdmin,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resUsers.count} users.`);

  // insert category
  const categories: Prisma.CategoryCreateInput[] = [
    {
      name: "Kaos",
    },
    {
      name: "Kemeja",
    },
    {
      name: "Hoodie & Sweatshirt",
    },
    {
      name: "Pants",
    },
    {
      name: "Sneakers",
    },
    {
      name: "Aksesoris",
    },
  ];

  const resCategories = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resCategories.count} categories.`);

  // insert collection
  const collection: Prisma.CollectionCreateInput[] = [
    {
      name: "Promo",
    },
    {
      name: "Terbaru",
    },
    {
      name: "Pilihan Mingguan",
    },
    {
      name: "Terlaris",
    },
  ];
  const resCollection = await prisma.collection.createMany({
    data: collection,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resCollection.count} collection.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
