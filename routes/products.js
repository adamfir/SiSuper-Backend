var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var bcript = require('bcrypt')
var Product = require('../model/products')
var jwt = require('jsonwebtoken')

//img upload
var multer = require('multer')

//Product Pict
var fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png'){
      cb(null, true)
    }
    else{
      cb(null, false)
    }
}
var store = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './img/productPicture/')
    },
    filename: function(req, file, cb) {
      cb(null, req.params.userId.concat('.jpg'))
    }
})
var imgProductPicture = multer({
    storage: store,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(product => {
            res.status(200).json({
                status: 200,
                result: product
            })
    })
    .catch(err => {
        res.status(500).json({
            status: 500,
            message: err
        })
    })
})

router.post('/addProduct', checkAuth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        business_id: req.body.businessId,
        name: req.body.productName,
        price: req.body.productPrice,
        unit: req.body.productUnit
    })
    product.save()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "Product add successful"
            })
        })
        .catch(err => {
            res.status(200).json({
                status: 500,
                message: err
            })
        })
})

router.delete('/deleteProduct', checkAuth, (req, res, next) => {
    Product.deleteOne({_id: req.body.productId})
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "Product deleted!"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

router.post('/editProduct', checkAuth, (req, res ,next) => {
    Product.updateOne({_id: req.body.productId}, {$set:{
        name: req.body.productName,
        price: req.body.productPrice,
        unit: req.body.productUnit
    }})
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            message: "Product updated!"
        })
    })
    .catch(err => {
        res.status(200).json({
            status: 500,
            message: err
        })
    })
})

router.post('/getProductByBussinessId', checkAuth, (req, res, next) => {
    Product.find({ bussiness_id: req.body.bussinessId })
        .exec()
        .then(products => {
            res.status(200).json({
                status: 200,
                result: products
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

router.post('/getProductById', checkAuth, (req, res, next) => {
    Product.findOne({_id: req.body.productId})
        .exec()
        .then(product => {
            res.status(200).json({
                status: 200,
                result: product
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

module.exports = router