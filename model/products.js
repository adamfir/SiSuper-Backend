const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bussiness_id: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    unit: {type: String, required: true},
    image: {type: String}
});

module.exports = mongoose.model('Product', eventSchema);