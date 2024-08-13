import {type Prisma} from "@prisma/client";

import {prisma, bcrypt} from "@/lib";
import {STYLES} from "@/constant";

async function main() {
  // insert admin
  const usersAdmin: Prisma.UserCreateInput[] = [
    {
      email: "rika@gmail.com",
      name: "Rika",
      password: await bcrypt.hashPassword("password"),
      phoneNumber: "081511791945",
      role: "admin",
    },
    {
      email: "raka@gmail.com",
      name: "Raka",
      password: await bcrypt.hashPassword("password"),
      phoneNumber: "081511791946",
      role: "admin",
    },
  ];
  const resUsers = await prisma.user.createMany({
    data: usersAdmin,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resUsers.count} users.`);

  // insert sizes
  const sizes: Prisma.SizeCreateInput[] = [
    {
      name: "Small",
      code: "S",
    },
    {
      name: "Medium",
      code: "M",
    },
    {
      name: "Large",
      code: "L",
    },
    {
      name: "X-Large",
      code: "XL",
    },
  ];
  const resSizes = await prisma.size.createMany({
    data: sizes,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resSizes.count} sizes.`);

  // insert category
  const categories: Prisma.CategoryCreateInput[] = [
    {
      name: "Top",
    },
    {
      name: "Bottom",
    },
  ];
  const resCategories = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resCategories.count} categories.`);

  // insert styles
  const styles: Prisma.StyleCreateInput[] = STYLES;
  const resStyles = await prisma.style.createMany({
    data: styles,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resStyles.count} styles.`);

  const colors: Prisma.ColorCreateInput[] = [
    {
      name: "Light Green",
      hexCode: "#00C12B",
    },
    {
      name: "Red",
      hexCode: "#F50606",
    },
    {
      name: "Yellow",
      hexCode: "#F5DD06",
    },
    {
      name: "Orange",
      hexCode: "#F57906",
    },
    {
      name: "Light Blue",
      hexCode: "#06CAF5",
    },
    {name: "Dark Blue", hexCode: "#063AF5"},
    {
      name: "Purple",
      hexCode: "#7D06F5",
    },
    {
      name: "Pink",
      hexCode: "#F506A4",
    },
    {
      name: "White",
      hexCode: "#FFFFFF",
    },
    {
      name: "Black",
      hexCode: "#000000",
    },
    {
      name: "Olive",
      hexCode: "#4F4631",
    },
  ];
  const resColors = await prisma.color.createMany({
    data: colors,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resColors.count} colors.`);

  // insert products
  const products: Prisma.ProductCreateManyInput[] = [
    {
      name: "T-SHIRT WITH TAPE DETAILS",
      description:
        "This t-shirt which is perfect for casual occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
      price: 125000,
      categoryId: 1,
      styleId: 1,
    },
    {
      name: "One Life Graphic T-shirt",
      description:
        "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
      price: 260000,
      categoryId: 1,
      styleId: 1,
    },
    {
      name: "Skinny Fit Jeans",
      description:
        "Celana yang memiliki sentuhan halus, tetap utuh dan lurus, cocok untuk pakaian kantor kombinasi lengan panjang yang dimasukkan dan celana kasual.",
      price: 399000,
      categoryId: 2,
      styleId: 2,
    },
    {
      name: "Checkered Shirt",
      description:
        "Bahan 100% katun brushed yang terasa lembut di bagian luar, serta halus dan nyaman di bagian dalam.",
      price: 359000,
      categoryId: 1,
      styleId: 1,
    },
    {
      name: "Sleeve Stripped T-shirt",
      description:
        "Bahan 100% katun brushed yang terasa lembut di bagian luar, serta halus dan nyaman di bagian dalam.",
      price: 129000,
      categoryId: 1,
      styleId: 3,
    },
    {
      name: "Vertical Stripped Shirt",
      description:
        "Bahan 100% katun brushed yang terasa lembut di bagian luar, serta halus dan nyaman di bagian dalam.",
      price: 299000,
      categoryId: 1,
      styleId: 2,
    },
    {
      name: "Loose Fit Bermuda Shorts",
      description:
        "Bahan 100% katun brushed yang terasa lembut di bagian luar, serta halus dan nyaman di bagian dalam.",
      price: 399000,
      categoryId: 2,
      styleId: 1,
    },
    {
      name: "Celana Pendek Chino",
      description:
        "These chino shorts is really good for casual walks and every day use, pretty comfy and trendy.",
      price: 299000,
      categoryId: 2,
      styleId: 2,
    },
    {
      name: "Pullover Sweat Hoodie",
      description:
        "Bahan 100% katun brushed yang terasa lembut di bagian luar, serta halus dan nyaman di bagian dalam.",
      price: 499000,
      categoryId: 1,
      styleId: 1,
    },
    {
      name: "Jaket Sweat Hoodie Ritsleting",
      description:
        "Bahan 100% katun brushed yang terasa lembut di bagian luar, serta halus dan nyaman di bagian dalam.",
      price: 599000,
      categoryId: 1,
      styleId: 1,
    },
  ];

  const resProducts = await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log(`Inserted ${resProducts.count} products.`);

  // insert product images
  const productImages: Prisma.ProductImageCreateManyInput[] = [
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%207_SWT8K5YL6.jpg?updatedAt=1722946189666",
      productId: 1,
      colorId: 10,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%201_jqVPeGRCt.jpg?updatedAt=1723019840908",
      productId: 2,
      colorId: 11,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%205_XE-iX55iL.jpg?updatedAt=1723019840730",
      productId: 2,
      colorId: 11,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%206_4iCIbuZ3y.jpg?updatedAt=1723019840906",
      productId: 2,
      colorId: 11,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%208__PuZfyRtl.jpg?updatedAt=1723327264777",
      productId: 3,
      colorId: 6,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%209_i_vwkQU3A.jpg?updatedAt=1723327938519",
      productId: 4,
      colorId: 2,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%2010_mlQ_ln8yD.jpg?updatedAt=1723327938481",
      productId: 5,
      colorId: 4,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%207%20(1)_I0g-oVhIl.jpg?updatedAt=1723327938461",
      productId: 6,
      colorId: 11,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/image%209%20(1)_6nz3EtsKoO.jpg?updatedAt=1723327938404",
      productId: 7,
      colorId: 6,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/shorts_vpTePpKGl.jpg?updatedAt=1723327938562",
      productId: 8,
      colorId: 9,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/hoodie_RriGu4j7p.jpg?updatedAt=1723327938412",
      productId: 9,
      colorId: 9,
    },
    {
      url: "https://ik.imagekit.io/fnzl2pmmqv2d/hoodie_ritsleting_A8fk0f47f.jpg?updatedAt=1723327938512",
      productId: 10,
      colorId: 11,
    },
  ];

  const resProductImages = await prisma.productImage.createMany({
    data: productImages,
    skipDuplicates: true,
  });

  console.log(`Inserted ${resProductImages.count} product images.`);

  const productUnits: Prisma.ProductUnitCreateManyInput[] = [
    {
      quantity: 3,
      code: "P1/S3/C10",
      productId: 1,
      sizeId: 3,
      colorId: 10,
    },
    {
      quantity: 3,
      code: "P1/S2/C10",
      productId: 1,
      sizeId: 2,
      colorId: 10,
    },
    {
      quantity: 3,
      code: "P2/S1/C11",
      productId: 2,
      sizeId: 1,
      colorId: 11,
    },
    {
      quantity: 3,
      code: "P2/S2/C11",
      productId: 2,
      sizeId: 2,
      colorId: 11,
    },
    {
      quantity: 3,
      code: "P2/S3/C11",
      productId: 2,
      sizeId: 3,
      colorId: 11,
    },
    {
      quantity: 3,
      code: "P2/S4/C11",
      productId: 2,
      sizeId: 4,
      colorId: 11,
    },
  ];

  const resProductUnits = await prisma.productUnit.createMany({
    data: productUnits,
    skipDuplicates: true,
  });

  console.log(`Inserted ${resProductUnits.count} product unit.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
