const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var DateSchema = new Schema({
  deadline: {
    type: Number,
  },
});

DateSchema.methods.calculateDeadline = (remain_seconds) => {
  let now = new Date();
  let deadline = remain_seconds * 1000 + now.getTime();

  return deadline;
};

module.exports = mongoose.model('Date', DateSchema);
