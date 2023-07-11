const mongoose = require('mongoose');
const MONGODB = process.env.MONGODB || 'mongodb://localhost:27017/test';

(async () => {
  try {
    await mongoose.connect(MONGODB);
    console.log(`Connected to ${MONGODB}`);
  } catch (err) {
    console.error('ERROR: connecting to Database: ' + err.message);
  }
})();
