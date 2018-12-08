const mongoose = require('mongoose')

const testScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    image: {type: String, required: true}
})

module.exports = mongoose.model('Test', testScheme)