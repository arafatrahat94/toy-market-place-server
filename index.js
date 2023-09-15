const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8001;

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
