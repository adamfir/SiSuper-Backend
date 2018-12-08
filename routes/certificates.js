var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var bcript = require('bcrypt')
var Certifcate = require('../model/certificates')
var jwt = require('jsonwebtoken')
var path = require("path")

//img upload
var multer = require('multer')

//Certifcate Pict
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
    cb(null, './img/cerificatePicture/')
  },
  filename: function(req, file, cb) {
    name = req.body.idOwner + '-' + file.originalname
    cb(null, name.concat('.jpg'))
  }
})
var certificatePicture = multer({
  storage: store,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

const checkAuth = require('../middleware/check-auth')

router.get('/', (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: 'hit!'
  })
})

router.post('/addCertificateUser', certificatePicture.single('certificatePicture'), (req, res, next) => {
    const certificate = new Certifcate({
        _id: new mongoose.Types.ObjectId(),
        idOwner: req.body.idOwner,
        type: "1",
        image: req.file.filename
    })

    certificate.save()
      .then(result => {
        res.status(200).json({
          status: 200,
          message: 'success!'
        })
      })
      .catch(err => {
        res.status(200),json({
          status: 200,
          message: err,
        })
      })
})

router.post('/deleteCertificate', (req, res, next) => {
  Certifcate.deleteOne({ _id: req.certificate.certificateId })
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

router.post('/editCertificate', certificatePicture.single('certificatePicture'), (req, res, next) => {
  Certifcate.updateOne({ _id: req.certificate.certificateId}, {$set: {
    image: req.file.filename
  }})
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