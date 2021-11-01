const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
var cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const email = require("mongodb").email;
require('dotenv').config();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmbaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('database connect');
    
    //Events database
    const eventsCollection = client.db("eventsCollection");
    //Events Collection
    const events = eventsCollection.collection("events");
    //Traveller Collection
    const traveller = eventsCollection.collection("traveller");
    //Booking Collection
    const book = eventsCollection.collection("booking");


    //ADD Events
    app.post('/addEvents', async(req, res)=>{
      const addEvents = req.body;
      console.log(req.body);
      const result = await events.insertOne(addEvents);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });

    //ALL Events
    app.get('/allEvents', async(req, res)=>{
      const result = await events.find({}).toArray();
      res.send(result);
    });
    //DELETE Events
    app.delete('/deleteEvent/:id', async (req, res)=>{
      const deleteEvents = req.params.id;
      const query = {_id: ObjectId(deleteEvents)};
      const result = await events.deleteOne(query);
      res.send(result);
    })
    //ADD traveller 
    app.post('/addTraveller', async (req, res)=>{
      const addTraveller = req.body;
      const result = await traveller.insertOne(addTraveller);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });

    //ALL traveller
    app.get('/allTraveller', async(req, res)=>{
      const result = await traveller.find({}).toArray();
      res.send(result);
    });
    //Get single events data
    app.get('/service/:id', async(req, res)=>{
      const service = req.params.id;
      const query = {_id: ObjectId(service)};
      const result = await events.findOne(query);
      res.send(result)
    });

    //ADD an order in database
    app.post('/booking', async(req, res)=>{
      const booking = req.body;
      const result = await book.insertOne(booking);
      res.send(result)
      
    });
    //GET my order
    app.get('/myOrder/:email', async(req, res)=>{
      const allMyOrder = req.params.email;
      const query = {email:allMyOrder}
      const result = await book.find(query).toArray();
      res.send(result);
    });
    //DELETE MY Order
    app.delete('/deleteOrder/:id', async(req, res)=>{
      const deleteOrder = req.params.id;
      const query = {_id: ObjectId(deleteOrder)};
      const result = await book.deleteOne(query);
      res.send(result);
    })
    
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})