const express = require('express');
const cors = require('cors');
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
    })



  }
  finally{

  }

}
run().catch(console.dir);




app.get('/', (req,res) => {
    res.send('Car Parts is running here')
});

app.listen(port, () => {
    console.log('Listening to port', port);
})