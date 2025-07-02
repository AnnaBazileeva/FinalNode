const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {

  const url = process.env.MONGO_URI;
  if (!url) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;

