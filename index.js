// const express = require("express");
// const cors = require("cors");

// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const port = process.env.PORT || 5000;

// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const userName = process.env.USER_NAME;
// const userPassword = process.env.USER_PASSWORD;

// const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.chdotmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// // const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.chdotmq.mongodb.net/`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const database = client.db("serviceDB");
//     const serviceCollection = database.collection("Bookings");

//     app.get("/bookings", async (req, res) => {
//       const cursor = serviceCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/booking/:email", async (req, res) => {
//       const email = req.param.email;
//       const query = { email: email };
//       const result = await serviceCollection.findOne(query);
//       res.send(result);
//     });

//     app.post("/bookings", async (req, res) => {
//       const booking = req.body;
//       console.log(booking);
//       const result = await serviceCollection.insertOne(booking);
//       res.send(result);
//     });

//     app.delete("/booking/:id", async (req, res) => {
//       const id = req.params.id;
//       console.log("delete id", id);
//       const query = { _id: new ObjectId(id) };
//       const result = await serviceCollection.deleteOne(query);
//       res.send(result);
//     });
//   } finally {
//     // Ensures that the client will close when you finish/error
//     app.listen(port, () => {
//       console.log(`App ruiing on port: ${port}`);
//     });
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// module.exports = app;


// // nahid
// // B4XsrE3jePC46T3E || nahid

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userName = process.env.USER_NAME;
const userPassword = process.env.USER_PASSWORD;
const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.chdotmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// 1. Create a function that ensures the DB is connected
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  // If we are not connected, connect now and wait for it
  await client.connect();
  const database = client.db("serviceDB");
  cachedDb = database;
  return database;
}

// 2. Define routes (Notice we call connectToDatabase() INSIDE every route)
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/bookings", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const serviceCollection = db.collection("Bookings");

    const cursor = serviceCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/booking/:email", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const serviceCollection = db.collection("Bookings");

    const email = req.params.email;
    const query = { email: email };
    const result = await serviceCollection.findOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/bookings", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const serviceCollection = db.collection("Bookings");

    const booking = req.body;
    console.log("Received booking:", booking);
    const result = await serviceCollection.insertOne(booking);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete("/booking/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const serviceCollection = db.collection("Bookings");

    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await serviceCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 3. Start server locally (Vercel will handle this automatically)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`🚀 Local server running on port ${port}`);
  });
}

module.exports = app;