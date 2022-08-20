const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * *Esquema dedicado al usuario. Tiene como campo irrepetible el 'user'.
 */
var UserSchema = new Schema({
    user: {
        type: String
    },
    password: {
        type: String,
    }
});

UserSchema.methods.encryptPassword = async (password) => {
    let pass = await bcrypt.hash(password, 2);
    return pass;
}

UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);