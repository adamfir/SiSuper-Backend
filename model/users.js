var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: { type: String, required: true},
    password: { type: String, required: true},
    phone: { type: String, required: true},
    address: { type: String, required: true},
    image: { type: String},
    account_status: { type: Number, required: true}
});


module.exports = mongoose.model('User', usersSchema);