const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, Transaction } = require('mongodb');
const app = express()
const port = process.env.PORT || 9090;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tdgu4vw.mongodb.net/`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const partsCollection = client.db('eCommerce').collection('products');
  

    app.post('/save-products', async (req, res) => {
    try {
      const productsArray = req.body; 
      const result = await partsCollection.insertMany(productsArray);
      res.status(201).json({ message: 'Products saved successfully', insertedCount: result.insertedCount });
    } catch (error) {
      console.error('Error saving products:', error);
      res.status(500).json({ message: 'Error saving products', error: error.message });
    }
    });
  
    //products
    app.post('/products',async(req,res)=>{
        const addPart=req.body;
        const result=await partsCollection.insertOne(addPart);
        res.send(result);
      })

    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = partsCollection.find(query);
      const parts = (await cursor.toArray()).reverse();
      res.send(parts);
    });

    // app.get('/products/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const part = await partsCollection.findOne(query);
    //   res.send(part);
    // });


    app.get('/products/:id', async (req, res) => {
        try {
          const customId = req.params.id;
          const query = { id: customId }; // Use 'id' field for your custom ID
      
          const product = await partsCollection.findOne(query);
      
          if (!product) {
            res.status(404).json({ message: 'Product not found' });
          } else {
            res.json(product);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          res.status(500).json({ message: 'Error fetching product', error: error.message });
        }
      });
      

    app.delete('/products/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)};
      const result=await partsCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/test', async (req, res) => {
        res.send("test is fine");
      });

  }
  finally {


  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From eCommerce')
})

app.listen(port, () => {
  console.log(`eCommerce app listening on port ${port}`)
})
