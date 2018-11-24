var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var bcript = require('bcrypt')
var Product = require('../model/products')
var jwt = require('jsonwebtoken')

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

router.post('/addProduct', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        bussiness_id: req.body.bussinessId,
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

router.delete('/deleteProduct', (req, res, next) => {
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

router.post('/editProduct', (req, res ,next) => {
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

router.post('/getProductByBussinessId', (req, res, next) => {
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

router.post('/getProductById', (req, res, next) => {
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