const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    organized_by: {type: String, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true}
});
eventSchema.index({name: 'text'});

module.exports = mongoose.model('Event', eventSchema);