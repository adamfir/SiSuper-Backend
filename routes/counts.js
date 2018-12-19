const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
var path = require("path")
const Attendance = require('../model/attendance')
const Business = require('../model/business')
const Certificate = require('../model/certificates')
const Event = require('../model/event')
const Invitation = require('../model/invitation')
const Product = require('../model/products')
const User = require('../model/users')

router.get('/event', checkAuth, (req, res, next) => {
    Event.find()
    .exec()
    .then(docs => {
        const response = {
            event: docs.length
        };
        res.status(200).json(response);

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/user', checkAuth, (req, res, next) => {
    User.find()
    .exec()
    .then(docs => {
        const response = {
            user: docs.length
        };
        res.status(200).json(response);

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/product', checkAuth, (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        const response = {
            product: docs.length
        };
        res.status(200).json(response);

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/business', checkAuth, (req, res, next) => {
    Business.find()
    .exec()
    .then(docs => {
        const response = {
            business: docs.length
        };
        res.status(200).json(response);

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;