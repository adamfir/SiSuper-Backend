const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
var path = require("path")
const Event = require('../model/event')

//img upload
var multer = require('multer')

//Event Pict
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
    cb(null, './img/eventPicture/')
  },
  filename: function(req, file, cb) {
    var num = Math.floor(Math.random() * 100) + 1
    name = req.body.location + '-' + req.body.name + '-' + num + '.jpg'
    cb(null, name)
  }
})
var eventPicture = multer({
  storage: store,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

router.get('/', checkAuth, (req, res, next) => {
    Event.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            event: docs
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

router.post('/', eventPicture.single('eventPicture'), checkAuth, (req, res, next) => {
    const event = new Event({ 
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        organized_by: req.body.organized_by,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        picture: req.file.filename
    });
    event.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Created event successfully',
            createdEvent: {
                name: result.name,
                organized_by: result.organized_by,
                date: result.date,
                location: result.location,
                description: result.description,
                _id: result._id,
                request:{
                    type: 'GET',
                    url: "http://localhost:3000/events/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/eventPicture/:eventPict', (req, res, next) => {
    var img = req.params.eventPict.replace(/%20/g, " ");
    img = img + '.jpg'
    res.sendFile(path.join(__dirname, '../img/eventPicture/', img))
    // res.status(200).json({
    //     ini: img
    // })
})

router.get('/:eventId', checkAuth, (req,res,next) =>{
    const id = req.params.eventId;
    Event.findById(id)
    .select('name organized_by date location description _id')
    .exec()
    .then(doc=>{
        console.log("From Database",doc);
        if(doc){
            res.status(200).json({
                event: doc,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/events"
                }
            });
        }
        else{
            res.status(404).json({message: "No Valid Entry found for provided ID"});
        }
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.patch('/:eventId', eventPicture.single('eventPicture'), checkAuth, (req,res,next) =>{
    const id = req.params.eventId;
    
    // const updateOps = {};
    // for(const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }
    Event.update({_id: id}, {$set: {
        name: req.body.name,
        organized_by: req.body.organized_by,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        picture: req.file.filename
    }}
        )
    .exec()
    .then(result=> {
        res.status(200).json({
            message: 'Event updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/events/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.delete('/:eventId', checkAuth, (req,res,next) =>{
    const id = req.params.eventId;
    Event.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Event deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/events',
                body: {
                    name: 'String',
                    organized_by: 'String',
                    date: 'Date',
                    location: 'String',
                    description: 'String'
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        }); 
    });
});

router.post('/search', checkAuth, (req, res, next) => {
    const search = req.body.search;
    Event.find({
        $text: { $search: search },
      })
      .exec()
      .then(docs => {
        if(docs.length == 0){
            res.status(404).json({message: "Search not found"});
        }
        else{
        const response = {
            count: docs.length,
            event: docs.map(doc => {
                return {
                    name: doc.name,
                    organized_by: doc.organized_by,
                    date: doc.date,
                    location: doc.location,
                    description: doc.description,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/events/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;