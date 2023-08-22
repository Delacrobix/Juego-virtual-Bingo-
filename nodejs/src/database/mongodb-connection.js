const mongoose = require('mongoose');
const MONGODB = process.env.MONGODB;

(async () => {
  try {
    await mongoose.connect(MONGODB);
  } catch (err) {
    console.error('ERROR: connecting to Database: ' + err.message);
  }
})();
