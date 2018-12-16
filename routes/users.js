var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var bcript = require('bcrypt')
var User = require('../model/users')
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
    cb(null, './img/userProfilePicture/')
  },
  filename: function(req, file, cb) {
    cb(null, req.params.userId.concat('.jpg'))
  }
})
var imgProfilePicture = multer({
  storage: store,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

const checkAuth = require('../middleware/check-auth');


router.post('/signUp', (req, res, next) => {
  // email sudah ada ?
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if(user.length > 0){
        res.status(422).json({
          status: 422,
          message: 'Email exist'
        })
      }
      else {
        // kalo hash suskses baru buat users
        bcript.hash(req.body.password, 10, (err, hash) => {
          if (err){
            return res.status(500).json({
              status: 501,
              error: err
            })
          }
          else{
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              email: req.body.email,
              password: hash,
              phone: req.body.phone,
              address: req.body.address,
              image: null,
              account_status: 1,
            })
            user.save()
              .then(result => {
                console.log(result)
                res.status(201).json({
                  status: 200,
                  message: 'user created',
                })
              })
              .catch(err => {
                console.log(err)
                res.status(500).json({
                  status: 500,
                  error: err
                })
              })
          }
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: 500,
        message: "gagal membuat user"
      })
    })
  
})

router.post('/signIn', (req, res, next) => {
  User.findOne({ email: req.body.email})
    .exec()
    .then(user => {
      if(user == null){
          res.status(404).json({
          status: 404,
          message: 'user tidak ditemukan'
        })
      }
      else{
        bcript.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            res.status(500).json({
              status: 500,
              message: 'error'
            })
          }
          else if(result){
            // var token = "ini token loh"
            var token = jwt.sign({
              email: user.email,
              userId: user._id
              }, process.env.JWT_KEY, 
              {
                expiresIn: "10000h"
              }
            )
            res.status(200).json({
              status: 200,
              message: "sukses",
              token: token,
              result: user
            })
          }
          else{
            res.status(401).json({
              status: 401,
              message: 'Auth gagal'
            })
          }
      });
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: 500,
        message: "gagal login",
      })
    })
})

router.get('/', (req, res, next) => {
  User.find()
    .exec()
    .then(user => {
      res.status(200).json({
        status: 200,
        hasil: user
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: 500,
        message: "gagal login",
        look: user
      })
    })
})

router.get('/userList', checkAuth, (req, res, next) => {
  User.find()
    .exec()
    .then(user => {
      res.status(200).json({
        status: 200,
        message: "Successfuly retrieve data.",
        result: user
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: 500,
        message: "Failed to Retrive User data."
      })
    })
})

router.get('/getUserById/:userId', checkAuth, (req, res, next) => {
  id = req.param.userId
  User.findOne({_id: req.params.userId})
    .exec()
    .then(user => {
      res.status(200).json({
        status: 200,
        message: "Successfuly retrieve data.",
        result: user,
        look: id
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: 500,
        message: "Failed to retrive data"
      })
    })
})

router.get('/suspendUser/:userId', checkAuth, (req, res, next) => {
  id = req.params.userId
  User.updateOne({_id: id}, {$set: {account_status: 0}})
    .exec()
    .then(user => {
      res.status(200).json({
        status: 200,
        message: "User Suspended!"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: 500,
        message: "Failed to suspend"
      })
    })
})

router.get('/unsuspendUser/:userId', checkAuth, (req, res, next) => {
  id = req.params.userId
  User.updateOne({_id: id}, {$set: {account_status: 1}})
    .exec()
    .then(user => {
      res.status(200).json({
        status: 200,
        message: "User Unsuspended!"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: 500,
        message: "Failed to Unsuspend"
      })
    })
})

router.post('/editProfile/:userId', checkAuth, (req, res, next) => {
  id = req.params.userId
  User.updateOne({_id: id}, {$set: { 
    phone: req.body.phone, 
    address: req.body.address}})
    .exec()
    .then(result => {
      res.status(200).json({
        status: 200,
        message: "edit Success!"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: 500,
        message: "Failed to edit"
      })
    })
})

router.post('/editProfilePicture/:userId', imgProfilePicture.single('userProfilePicture'), checkAuth, (req, res, next) => {
  id = req.params.userId,
  User.updateOne({_id: id}, {$set: {
    image: req.file.path}})
    .exec()
    .then(result => {
      res.status(200).json({
        status: 200,
        message: "Upload Success!"
      })
    })
    .catch(err => {
      res.status(200).json({
        status: 500,
        message: err
      })
    })
})

router.get('/profilePicture/:userId', (req, res, next) => {
  id = req.params.userId,
  res.sendFile(path.join(__dirname, '../img/userProfilePicture/' + id + '.jpg'))
})

router.post('/nullImage:userId', (req, res, next) => {
  User.update({$set: {image: null}})
    .exec()
    .then(result => {
      res.status(200).json({
        status: 200,
        message: "Sukese wid!"
      })
    })
})

module.exports = router;
