const mongoose = require('mongoose');
const MONGODB = process.env.MONGODB;

(async () => {
  try {
    await mongoose.connect(MONGODB);
    console.log(`Connected to ${MONGODB}`);
  } catch (err) {
    console.error("ERROR: connecting to Database: " + err.message);
  }
})();