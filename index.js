const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5001;
const jwt = require("jsonwebtoken");
// middleware

app.use(cors());

app.use(express.json());
require("dotenv").config();
// jwb function
const verifyJWT = (req, res, next) => {
  //   console.log("hitting verify");
  //   console.log(req.headers.authorization);
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized user access" });
  } else {
    const token = authorization.split(" ")[1];
    console.log(token);
    jwt.verify(token, process.env.DB_SECRET, (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .send({ error: true, message: "unauthorized access" });
      }
      req.decoded = decoded;
      next();
    });
  }
};
// normal api codes
app.get("/", (req, res) => {
  res.send("Toys Are Broken");
});
app.listen(port, () => {
  console.log(`the toys are broken on the port ${port}`);
});

// mongodb codes
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_URI_Name}:${process.env.DB_USER_SEC}@cluster1.z16hlgw.mongodb.net/?retryWrites=true&w=majority`;

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
app.put("/Update:id", async (req, res) => {
  const Udata = req.body;
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };

  const option = { upsert: true };
  const updatedToy = {
    $set: {
      Name: Udata.Name,
      MadeIn: Udata.MadeIn,
      Recommended_Age: Udata.Recommended_Age,
      Price: Udata.Price,
      Description: Udata.Description,
      Category: Udata.Category,
      Quantity: Udata.Quantity,
      email: Udata.email,
      Image_URL: Udata.Image_URL,
    },
  };
  const result = await AllToyCollection.updateOne(filter, updatedToy, option);
  res.send(result);
});
app.get("/Details/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await AllToyCollection.findOne(query);
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
app.get("/MyToys", verifyJWT, async (req, res) => {
  const decoded = req.decoded;
  console.log(decoded.email);
  if (decoded.email !== req.query?.email) {
    return res.status(403).send({ error: 1, message: "Forbidden access" });
  }
  console.log(req.query);
  let query = {};
  if (req.query?.email) {
    query = { email: req.query.email };
  }
  const result = await AllToyCollection.find(query).toArray();
  res.send(result);
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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
