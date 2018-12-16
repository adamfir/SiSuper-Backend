var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var bcript = require('bcrypt')
var Business = require('../model/business')
var jwt = require('jsonwebtoken')
var path = require("path")

//img upload
var multer = require('multer')

//Profile Pict
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
    cb(null, './img/businessPicture/')
  },
  filename: function(req, file, cb) {
    name = req.body.businessName + '-' + req.body.userId
    cb(null, name.concat('.jpg'))
  }
})
var businessPicture = multer({
  storage: store,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

//Certificate Pict

const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: 200,
        message: 'hit!'
    })
})

router.get('/getBusiness', checkAuth, (req, res, next) => {
    Business.find()
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: 'Success!',
                result: result
            })
        })
        .catch(err => {
            res.status(200).json({
                status: 500,
                message: 'Fail to retrive data'
            })
        })
})

router.post('/getBusinessById', checkAuth, (req, res, next) => {
    Business.findOne({ _id: req.body.businessId })
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: 'Success!',
                result: result
            })
        })
        .catch(err => {
            res.status(200).json({
                status: 500,
                message: 'Fail to retrive data'
            })
        })
})

router.post('/getBusinessByUserId', checkAuth, (req, res, next) => {
    Business.find({ user_id: req.body.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: 'Success!',
                result: result
            })
        })
        .catch(err => {
            res.status(200).json({
                status: 500,
                message: 'Fail to retrive data'
            })
        })
})

router.post('/addBusiness', businessPicture.single('businessPicture'), (req, res, next) => {
    const business = new Business({
        _id: new mongoose.Types.ObjectId(),
        user_id: req.body.userId,
        name: req.body.businessName,
        category: req.body.businessCategory,
        established_date: req.body.establishedDate,
        revenue: req.body.businessRevenue,
        description: req.body.businessDescription,
        address: req.body.businessAddress,
        email: req.body.businessEmail,
        phone: req.body.businessPhone,
        site: req.body.businessSite,
        facebook: req.body.businessFacebook,
        twitter: req.body.businessTwitter,
        line: req.body.businessLine,
        instagram: req.body.businessInstagram,
        logo: req.file.filename
    })

    business.save()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "Success!"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })

})

router.get('/getBusinessPicture/:logo', checkAuth, (req, res, next) => {
    var logo = req.params.logo.replace(/%20/g, " ");
    logo = logo + '.jpg'
    res.sendFile(path.join(__dirname, '../img/businessPicture/', logo))
})

router.post('/deleteBusiness', checkAuth, (req, res, next) => {
    Business.deleteOne({ _id: req.body.businessId }).exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "success!"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

router.post('/editBusiness', checkAuth, (req, res, next) => {
    Business.updateOne( { _id: req.body.businessId}, 
        {$set: {
            name: req.body.businessName,
            category: req.body.businessCategory,
            established_date: req.body.establishedDate,
            revenue: req.body.businessRevenue,
            description: req.body.businessDescription,
            address: req.body.businessAddress,
            email: req.body.businessEmail,
            phone: req.body.businessPhone,
            site: req.body.businessSite,
            facebook: req.body.businessFacebook,
            twitter: req.body.businessTwitter,
            line: req.body.businessLine,
            instagram: req.body.businessInstagram
        }}    
    )
    .then(result => {
        res.status(200).json({
            status: 200,
            message: "success!"
        })
    })
    .catch(err => {
        res.status(200).json({
            status: 500,
            message: err
        })
    })
})

module.exports = router;