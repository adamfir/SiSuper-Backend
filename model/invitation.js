const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}]
});

module.exports = mongoose.model('Invitation', invitationSchema);