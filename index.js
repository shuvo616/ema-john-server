const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Added from mongodb database connection code
const MongoClient = require('mongodb').MongoClient;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Change localhost port to 5000
const port = 5000;
// Environment variable require file
require('dotenv').config()
// mongodb database URI code cut past here to make it dynamic
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqs1t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


// Database connection setup
// const uri = "mongodb+srv://<username>:<password>@cluster0.lqs1t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  // console.log(err);
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
 //   console.log('Database Connected Successfully');

  // Add all products to database
  // To send bulk data at a time use this line--> productsCollection.insertMany(products)  
  app.post('/addProduct', (req,res) => {
      const products = req.body; 
      productsCollection.insertOne(products)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })
  // Read All products from database
  app.get('/products', (req,res) => {
    productsCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })
  // Read Single products from database
  app.get('/product/:key', (req,res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })
  // 
  app.post('/productsByKeys', (req,res) => {
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err,documents) => {
      res.send(documents);
    })
  })


    // Add Order to database
    app.post('/addOrder', (req,res) => {
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

});




// app.get('/', (req, res) => {
//   res.send('Hello World! from Ema-john Server!!')
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})