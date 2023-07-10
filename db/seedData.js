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
    price MONEY NOT NULL,
    "stockQuantity" INTEGER NOT NULL,
    "imageURL" VARCHAR (255) NOT NULL,
    size VARCHAR(255)
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
    const productsToCreate = [];

    for (let i = 0; i < 30; i++) {
      productsToCreate.push({
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 5, max: 200 }),
        stockQuantity: faker.number.int({ min: 5, max: 200 }),
        imageURL: "https://tigers-den.s3.us-east-2.amazonaws.com/lsu-mug2.png",
      });
    }

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
