//* basic config start ...

// const express = require('express');
// const app = express();
// const cors = require('cors');
// require('dotenv').config(); //Database acce korar jonne lage eita
// const port = process.env.PORT || 5000;
// // middleware
// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('ehospitall backend server in ui'); // for web ui
// });
// app.listen(port, () => {
//   console.log(`ehospital server is running on port ${port}`); // for console console ui
// });
//*tar por mondo db connection korle kichu line add hobe
//* basic config end ...

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config(); //Database acce korar jonne lage eita
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

/* basic mongodb driver connection start ... */

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vv356rj.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/* {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    async function run() {
      try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log(
          'Pinged your deployment. You successfully connected to MongoDB!'
        );
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
    run().catch(console.dir);
} */
//basic mongodb driver connection end ...

/* Mongodb connection start ... */
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection on which to run the operation
    const doctorsCollections = client.db('eHospital').collection('doctors');
    const bookingsCollections = client.db('eHospital').collection('bookings');
    const usersCollections = client.db('eHospital').collection('users');

    /* find all doctors */
    app.get('/doctors', async (req, res) => {
      const result = await doctorsCollections.find().toArray(); //to array use korle data gula array er moto pawa jay
      res.send(result);
    });

    /* Booking cart section  */
    //get Booking cart items
    app.get('/bookings', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await bookingsCollections.find(query).toArray(); //to array use korle data gula arry formate a show korebe
      res.send(result);
    });
    // Add booking item
    app.post('/bookings', async (req, res) => {
      // res.send('booking ui');
      const bookingItem = req.body;
      const result = await bookingsCollections.insertOne(bookingItem);
      res.send(result);
    });
    // ✅ Dashboard: Get all bookings for admin panel
    app.get('/dashboard/bookings', async (req, res) => {
      try {
        const result = await bookingsCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error('Failed to fetch bookings for dashboard:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    /* Booking cart section end  */

    /* User related apis */
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollections.insertOne(user);
      res.send(result);
    });
    // Get all users or filter by email
    app.get('/users', async (req, res) => {
      const email = req.query.email;

      let query = {};
      if (email) {
        query = { email: email };
      }

      try {
        const users = await usersCollections.find(query).toArray();
        res.send(users);
      } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//mongodb connection end ...
app.get('/', (req, res) => {
  res.send('ehospitall backend server in ui'); // for web ui
});
app.listen(port, () => {
  console.log(`ehospital server is running on port ${port}`); // for console console ui
});
// this is the end of the server.js file
