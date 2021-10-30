const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
var cors = require('cors');
require('dotenv').config();
const port = 5000


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmbaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('database connect')
    const eventsCollection = client.db("eventsCollection");
    const events = eventsCollection.collection("events");

    //ADD Events
    app.post('/addEvents', async(req, res)=>{
      const addEvents = req.body;
      console.log(req.body);
      const result = await events.insertOne(addEvents);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
      // create a document to insert
      // const doc = {
      //   title: "Record of a Shriveled Datum",
      //   content: "No bytes, no problem. Just insert a document, in MongoDB",
      // }
      // const result = await haiku.insertOne(doc);
    });

    //ALL Events
    app.get('/allEvents', async(req, res)=>{
      const result = await events.find({}).toArray();
      res.send(result);
    });
    
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