const mongoose = require('mongoose')

const businessSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    category: {type: String, required: true},
    established_date: {type: Date, required: true},
    revenue: {type: Number, required: true},
    description: {type: String, required: true},
    address: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    site: {type: String, required: true},
    facebook: {type: String, required: true},
    twitter: {type: String, required: true},
    line: {type: String, required: true},
    instagram: {type: String, required: true},
    logo: {type: String, required: true}
});

module.exports = mongoose.model('Business', businessSchema);