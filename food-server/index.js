const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 6001;
require('dotenv').config()
// console.log(process.env.DB_USER)


// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@demo-foodi-cluster.ok8kwhr.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server
    await client.connect();

    // database & collection
    const menuCollections = client.db("demo-foodi-client").collection("menus");
    const cartCollections = client.db("demo-foodi-client").collection("cartItems");

    // all menus operations
    app.get('/menu', async (req, res) => {
        const result = await menuCollections.find().toArray();
        res.send(result);
      })


      // all carts operations

    // get carts using email
    app.get('/carts', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const result = await cartCollections.find(query).toArray();
        res.send(result);
      });
      
      // post all carts
      app.post('/carts', async (req, res) => {
        const cartItem = req.body;
        const result = await cartCollections.insertOne(cartItem);
        res.send(result);
      });
  
      // delete a cart
      app.delete('/carts/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await cartCollections.deleteOne(query);
        res.send(result);
      })

      // update cart quantity
      app.put('/carts/:id', async (req, res) => {
        const itemId = new ObjectId(req.params.id);
        const { quantity } = req.body;
    
        try {
          const result = await cartCollections.updateOne(
            { _id: itemId },
            { $set: { quantity: parseInt(quantity, 10) } }
          );
    
          if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Quantity updated successfully' });
          } else {
            res.status(404).json({ message: 'Item not found' });
          }
        } catch (error) {
          console.error('Error updating quantity:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });

      // get an single items
      app.get('/carts/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await cartCollections.findOne(query);
        res.send(result);
      })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Foodi Client Server!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})