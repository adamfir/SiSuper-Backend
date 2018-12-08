const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idOwner: mongoose.Schema.Types.ObjectId,
    type: {type: Number, required: true},
    image: {type: String, required: true}
});

module.exports = mongoose.model('Certificate', certificateSchema)