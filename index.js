const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8001;
const jwt = require("jsonwebtoken");
// middleware
app.use(cors());
app.use(express.json());
require("dotenv").config();

// normal api codes
app.get("/", (req, res) => {
  res.send("Toys Are Broken");
});
app.listen(port, () => {
  console.log(`the toys are broken on the port ${port}`);
});

// mongodb codes
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const userCollection = client.db("TOyMarketUser").collection("Users");
const AllToyCollection = client.db("AllToys").collection("ToyCollection");

// apis
app.get("/Alltoys", async (req, res) => {
  const result = await AllToyCollection.find().toArray();
  res.send(result);
});
app.post("/User", async (req, res) => {
  const data = req.body;
  const result = await userCollection.insertOne(data);
  res.send(result);
});
app.post("/Addtoy", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await AllToyCollection.insertOne(data);
  res.send(result);
});

app.post("/jwt", (req, res) => {
  const user = req.body;
  console.log(user);
  const token = jwt.sign(user, process.env.DB_SECRET, {
    expiresIn: "2h",
  });
  console.log(token);
  res.send({ token });
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);
