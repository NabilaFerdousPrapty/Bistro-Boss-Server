const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongodb = require('mongodb');
const e = require('express');
 require('dotenv').config();
const port=process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pflyccd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const BistroDB=client.db("Bistro-Boss");
const menuCollection=BistroDB.collection("menu");
const userCollection=BistroDB.collection("users");
const reviewsCollection=BistroDB.collection("reviews");
const cartCollection=BistroDB.collection("carts");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    app.get('/menu', async (req, res) => {
        const menu = await menuCollection.find({}).toArray();
        res.send(menu);
    });
    app.get('/reviews', async (req, res) => {
        const reviews = await reviewsCollection.find({}).toArray();
        res.send(reviews);
    });
    app.post('/carts', async (req, res) => {
        const cart = req.body;
        const result = await cartCollection.insertOne(cart);
        res.send(result);
    })
    // app.get('/carts', async (req, res) => {
    //     const carts = await cartCollection.find({}).toArray();
    //     res.send(carts);
    // });
    app.get('/carts', async (req, res) => {
        const email = req.query.email;
        const query = { email: email }; 
        const carts = await cartCollection.find(query).toArray();
        res.send(carts);
    });
    app.delete('/carts/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
    });

    //user related api

    app.post('/users', async (req, res) => {
        const user = req.body;
        const query={email:user.email};
        const existingUser = await userCollection.findOne(query);
        if(existingUser){
          res.send({message:"User already exists",insertedId:null})
          return
            
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
    })
    app.get('/users', async (req, res) => {
        const users = await userCollection.find({}).toArray();
        res.send(users);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Bistro Boss Server is running');
}   );
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


