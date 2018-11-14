var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, required: true},
    event_id: { type: String, required: true},
    location_rate: { type: Number, required: true},
    content_rate: { type: Number, required: true},
    event_rate: { type: Number, required: true},
    review: { type: String, required: true},
});


module.exports = mongoose.model('Review', reviewSchema);