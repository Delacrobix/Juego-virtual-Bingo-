const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * *Esquema dedicado al usuario. Tiene como campo irrepetible el 'user'.
 */
var DateSchema = new Schema({
    date: {
      type: Date
    }
});

module.exports = mongoose.model('Date', DateSchema);