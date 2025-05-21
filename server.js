const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();


app.use(cors());
app.use(express.json());

console.log(process.env.MONGODB_URI, 'mongodb uri')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})