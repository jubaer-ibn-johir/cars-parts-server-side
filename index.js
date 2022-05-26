const express = require('express');
const cors = require('cors');
//const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmkbv32.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const purchaseCollection = client.db('cars-Parts').collection('purchase');
    const myOrderCollection = client.db('cars-Parts').collection('myOrder');
    const userCollection = client.db('cars-Parts').collection('user');

    app.get('/purchase', async (req, res) => {
      const query = {};
      const cursor = purchaseCollection.find(query);
      const purchases = await cursor.toArray();
      res.send(purchases);
    });

    app.get('/purchase/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const purchase = await purchaseCollection.findOne(query);
      res.send(purchase);
    });

    app.put('/user/:email', async(req, res)=> {
      const email = req.params.email;
      const user = req.body;
      const filter = {email: email};
      const options = {upsert: true};
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      //const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'} )
      res.send({result, token});
    }); 

    app.post('/myOrder', async(req,res)=> {
      const newOrder = req.body;
      const result = await myOrderCollection.insertOne(newOrder);
      res.send(result);
    });

    app.get('/myOrder', async (req, res) => {
      const email = req.query.email;
      //const query = {};
      const query = {email: email,}
      const cursor = myOrderCollection.find(query);
      const myOrder = await cursor.toArray();
      res.send(myOrder);
    });



  }
  finally{

  }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Car Parts is running here')
});

app.listen(port, () => {
    console.log('Listening to port', port);
})