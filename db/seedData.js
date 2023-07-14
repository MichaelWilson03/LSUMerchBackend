const {
  //Individiual table functions from all tables here
  createUser,
  createProduct,
  // createCategory,
  createOrder,
  // createAddress,
  createReview,
} = require("./");

const client = require("./client");

const { faker } = require("@faker-js/faker");

async function dropTables() {
  console.log("Dropping All Tables");
  await client.query(`
  DROP TABLE IF EXISTS orders_products;
  DROP TABLE IF EXISTS reviews;
  DROP TABLE IF EXISTS addresses;
  DROP TABLE IF EXISTS orders;
  DROP TYPE IF EXISTS status;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS users;
  `);
}

// COMMENTING OUT TABLES NOT CURRENTLY BEING USED
// May Add back in later
// CREATE TABLE categories (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   description TEXT NOT NULL
// );

// CREATE TABLE addresses (
//   id SERIAL PRIMARY KEY,
//   street TEXT NOT NULL,
//   city TEXT NOT NULL,
//   state TEXT NOT NULL,
//   zip VARCHAR(10) NOT NULL
// );

async function createTables() {
  try {
    console.log("Starting to build the tables...");
    await client.query(`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "isAdmin" BOOLEAN DEFAULT false
  );
  
  CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price MONEY NOT NULL,
    "stockQuantity" INTEGER NOT NULL,
    "imageURL" VARCHAR (255) NOT NULL,
    size VARCHAR(255),
    "isFeatured" BOOLEAN DEFAULT false NOT NULL
  );

  CREATE TYPE status AS ENUM ('In Cart', 'Order Placed', 'Order Complete');

  CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "totalPrice" MONEY,
    "orderStatus" status default 'In Cart' NOT NULL
  );

  CREATE UNIQUE INDEX ON orders ("userId")
  WHERE "orderStatus" = 'In Cart';


  CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    "creatorId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    UNIQUE ("creatorId", "productId")
  );

    CREATE TABLE orders_products (
      id SERIAL PRIMARY KEY,
      "orderId" INTEGER REFERENCES orders (id) NOT NULL,
      "productId" INTEGER REFERENCES products (id) NOT NULL,
      quantity INTEGER NOT NULL,
      UNIQUE ("orderId", "productId")
    ); 

  `);
    console.log("Tables built");
  } catch (error) {
    console.error("Tables failed");
    throw error;
  }
  //USERS
  //Will add addressId after adding address table
  //Phone Number?
  //D/O/B, age?
  //PRODUCTS
  //Research how to add image?
}

async function createInitialUsers() {
  console.log("Creating Initial Users");

  try {
    const usersToCreate = [
      {
        email: "SydneyCodes@gmail.com",
        password: "test",
        firstName: "Sydney",
        lastName: "Weakley",
        isAdmin: true,
      },
      {
        email: "RobertAlsoCodes@me.com",
        password: "test",
        firstName: "Robert",
        lastName: "Allred",
        isAdmin: true,
      },
      {
        email: "MichaelAlsoAlsoCodes@hotmail.com",
        password: "test",
        firstName: "Michael",
        lastName: "Wilson",
        isAdmin: true,
      },
      {
        email: "EduardoAlsoAlsoAlsoCodes@aol.com",
        password: "test",
        firstName: "Eduardo",
        lastName: "Martin",
        isAdmin: true,
      },
    ];

    for (let i = 0; i < 50; i++) {
      usersToCreate.push({
        email: faker.internet.email(),
        password: "test",
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        isAdmin: false,
      });
    }
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialProducts() {
  console.log("Creating Initial Products");

  try {
    const productsToCreate = [
      {
        name: `Joe Burrow "BURREAUX" Jersey`,
        description: "White Jersey with purple letters.",
        price: 150,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/burreaux-jersey.png",
        isFeatured: true,
        category: "Clothing",
        size: "Large",
      },
      {
        name: `World Series National Championship Flag`,
        description:
          "Purple flag celebraring the 2023 NCAA Baseball National Championship",
        price: 25,
        stockQuantity: 15,
        imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/flag.png",
        isFeatured: true,
        category: "Memorabilia",
      },
      {
        name: `Gold LSU Teeshirt`,
        description: "",
        price: 45,
        stockQuantity: 15,
        imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/gold-tee.png",
        isFeatured: false,
        category: "Clothing",
        size: "X-Large",
      },
      {
        name: `Gray LSU Sweatshirt`,
        description:
          "Gray LSU Headshirt with purple lettering and gold trim, perfect for a cold night!",
        price: 80,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/gray-sweatshirt.png",
        isFeatured: false,
        category: "Clothing",
        size: "Medium",
      },
      {
        name: `Geaux Tigers Tiger Print Tee`,
        description: "Fun gray t-shirt with tiger print lettering",
        price: 30,
        stockQuantity: 15,
        imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/gray-tee.png",
        isFeatured: false,
        category: "Clothing",
        size: "Large",
      },
      {
        name: `LSU Mini Helmet`,
        description:
          "Gold Helmet with Purple lettering. Make your co-workers jealous when you display this on your desk!",
        price: 40,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/mini-helmet.png",
        isFeatured: true,
        category: "Memorabilia",
      },
      {
        name: `Eye of the Tiger Coffee Mug`,
        description:
          "Purple mug with the eye of the tiger. Enjoy your morning refreshments in style!",
        price: 25,
        stockQuantity: 15,
        imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/mug.png",
        isFeatured: true,
        category: "",
        size: "Household",
      },
      {
        name: `Plush Football`,
        description:
          "Play with your children or blow off some steam around the office with your very own LSU plush football.",
        price: 15,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/plush-football.png",
        isFeatured: false,
        category: "Toys",
      },
      {
        name: `Purple Tiger Glasses`,
        description:
          "A future so bright, you gotta wear shades! Purple sunglasses with purple tint, perfect fo any LSU fan!",
        price: 30,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/purple-glasses.png",
        isFeatured: true,
        category: "Accessories",
      },
      {
        name: `Purple Onesie`,
        description:
          "Raise them right AND in style with this purple LSU onesie polo",
        price: 32,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/purple-onesie.png",
        isFeatured: false,
        category: "Baby",
        size: "6 months",
      },
      {
        name: `Silicone Ring`,
        description:
          "It's not a mood ring, but if you're in the modd to WIN, it might be the perfect ring for you!",
        price: 12,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/purple-ring.png",
        isFeatured: true,
        category: "Accessories",
      },
      {
        name: `Purple Shoes`,
        description:
          "Show your school pride as you tear up the streets in your very own LSU kicks!",
        price: 95,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/purple-shoes.png",
        isFeatured: true,
        category: "Accessories",
        size: "10- mens",
      },
      {
        name: `Purple LSU T-shirt`,
        description: "Purple t-shirt with gold lettering. Simple but sleak.",
        price: 40,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/purple-tee.png",
        isFeatured: false,
        category: "Clothing",
        size: "Medium",
      },
      {
        name: `Striped Onesie`,
        description:
          "Let your little one impress the neighbors with this white and black striped LSU onesie",
        price: 30,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/striped-onesie.png",
        isFeatured: false,
        category: "Baby",
        size: "3 months",
      },
      {
        name: `Tiger Onesie`,
        description:
          "Who's number 1? Your baby is when they wear this adorable tiger onesie!",
        price: 25,
        stockQuantity: 15,
        imageURL:
          "https://tigers-den.s3.us-east-2.amazonaws.com/white-onesie.png",
        isFeatured: false,
        category: "",
        size: "",
      },
      // {
      //   name: ``,
      //   description: "",
      //   price: 25,
      //   stockQuantity: 15,
      //   imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/XXXX.png",
      //   isFeatured: false,
      //   category: "",
      //   size: "",
      // },
      // {
      //   name: ``,
      //   description: "",
      //   price: 25,
      //   stockQuantity: 15,
      //   imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/XXXX.png",
      //   isFeatured: false,
      //   category: "",
      //   size: "",
      // },
      // {
      //   name: ``,
      //   description: "",
      //   price: 25,
      //   stockQuantity: 15,
      //   imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/XXXX.png",
      //   isFeatured: false,
      //   category: "",
      //   size: "",
      // },
    ];

    // for (let i = 0; i < 30; i++) {
    //   productsToCreate.push({
    //     name: faker.commerce.product(),
    //     description: faker.commerce.productDescription(),
    //     price: faker.number.int({ min: 5, max: 200 }),
    //     stockQuantity: faker.number.int({ min: 5, max: 200 }),
    //     imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/lsu-mug2.png",
    //     isFeatured: false,
    //     category: "Mens",
    //   });
    // }

    const products = await Promise.all(productsToCreate.map(createProduct));

    console.log("Product created:");
    console.log(products);
    console.log("Finished creating products!");
  } catch (err) {
    console.error(err);
  }
}

// async function createInitialCategories() {
//   console.log("Creating Initial Categories");

//   try {
//     const categoriesToCreate = [
//       {
//         name: "T-Shirts",
//         description:
//           "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
//       },
//       {
//         name: "Hats",
//         description:
//           "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
//       },
//     ];

//     const categories = await Promise.all(
//       categoriesToCreate.map(createCategory)
//     );

//     console.log("Category created!");
//     console.log(categories);
//     console.log("Finished creating categories!");
//   } catch (err) {
//     console.error(err);
//   }
// }

async function createInitialOrders() {
  console.log("Creating Initial Orders");

  try {
    const ordersToCreate = [];

    for (let i = 0; i < 100; i++) {
      ordersToCreate.push({
        userId: faker.number.int({ min: 1, max: 24 }),
      });
    }

    const orders = await Promise.all(ordersToCreate.map(createOrder));

    console.log("Order created!");
    console.log(orders);
    console.log("Finished creating orders!");
  } catch (err) {
    console.error(err);
  }
}

// async function createInitialAddresses() {
//   console.log("Creating Initial Addresses");

//   try {
//     const addressesToCreate = [
//       {
//         street: "2040 Thisway Dr.",
//         city: "Seattle",
//         state: "Oregon",
//         zip: "22432",
//       },
//       {
//         street: "2100 Overhere St.",
//         city: "Orlando",
//         state: "Florida",
//         zip: "5436-32431",
//       },
//       {
//         street: "555 Here Dr.",
//         city: "Chicago",
//         state: "Illinois",
//         zip: "65345",
//       },
//     ];

//     const addresses = await Promise.all(addressesToCreate.map(createAddress));

//     console.log("Address created!");
//     console.log(addresses);
//     console.log("Finished creating addresses!");
//   } catch (err) {
//     console.error(err);
//   }
// }

async function createInitialReviews() {
  console.log("Creating Initial Reviews");

  try {
    const reviewsToCreate = [
      {
        creatorId: 2,
        productId: 4,
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
        rating: 3,
      },
      {
        creatorId: 3,
        productId: 9,
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
        rating: 1,
      },
    ];

    for (let i = 0; i < 75; i++) {
      reviewsToCreate.push({
        creatorId: faker.number.int({ min: 1, max: 24 }),
        productId: faker.number.int({ min: 1, max: 100 }),
        message: faker.lorem.sentence({ min: 5, max: 40 }),
        rating: faker.number.int({ min: 1, max: 10 }),
      });
    }

    const reviews = await Promise.all(reviewsToCreate.map(createReview));

    console.log("Review created!");
    console.log(reviews);
    console.log("Finished creating reviews!");
  } catch (err) {
    console.error(err);
  }
}

async function rebuildDB() {
  await dropTables();
  await createTables();
  await createInitialUsers();
  await createInitialProducts();
  // await createInitialCategories();
  await createInitialOrders();
  // await createInitialAddresses();
  await createInitialReviews();
  // To rebuild and reseed the database, we will need to :
  // 1) Drop Tables
  // 2) Create Tables
  // 3) Create Data for individual tables
  // 4) Catch and Throw Error
}

module.exports = rebuildDB;
