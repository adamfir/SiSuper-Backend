var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var Test = require('../model/testings')

router.post('/', (req, res, next) => {
    const test = new Test({
        _id: new mongoose.Types.ObjectId(),
        image: req.body.image
    })
    .then(result => {
        res.status(200).json({
            status: 200,
            message: "bisa"
        })
    })
    .catch(err => {
        res.status(500).json({
            status: 500,
            message: err
        })
    })
})

router.get('/:img', (req, res, next) => {
    image_string = req.params.img

    var im = image_string.split(",")[1];

    var img = new Buffer(im, 'base64');

    res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
    });

    res.end(img); 
})

module.exports = router