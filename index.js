const { MongoClient, ServerApiVersion } = require('mongodb');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rl5ffdh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product');
    const addcartCollection = client.db('productDB').collection('addcart');

    app.get('/product', async(req, res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/addcart', async(req, res)=>{
      const cursor = addcartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/product', async(req, res)=>{
        const product = req.body;
        console.log(product);
        const result = await productCollection.insertOne(product)
        res.send(result)
        
    })

    app.post('/addcart', async(req, res)=>{
      const product = req.body;
      console.log(product);
      const result = await addcartCollection.insertOne(product)
      res.send(result)
      
  })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('Working');
})

app.listen(port,()=>{
    console.log(`Server is running at : ${port}`);
})