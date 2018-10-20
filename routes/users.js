var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var bcript = require('bcrypt')
var User = require('../model/users')
var jwt = require('jsonwebtoken')

router.post('/signup', (req, res, next) => {
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

router.post('/signin', (req, res, next) => {
  User.findOne({ email: req.body.email})
    .exec()
    .then(user => {
      if(user.length < 1){
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
            var token = jwt.sign({
              email: user.email,
              userId: user._id
              }, process.env.JWT_KEY, 
              {
                expiresIn: "1h"
              }
            )
            res.status(200).json({
              status: 200,
              message: "sukses",
              token: token
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
        look: user
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
module.exports = router;
