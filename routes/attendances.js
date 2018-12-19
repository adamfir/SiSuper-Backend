const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Attendance = require('../model/attendance')
const User = require('../model/users');
const Event = require('../model/event')


router.get('/', checkAuth, (req, res, next) => {
    Attendance
    .find()
    .select('event user response _id')
    .populate('event user')
    .exec()
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            attendance: docs.map(doc =>{
                return {
                    _id: doc._id,
                    event: doc.event,
                    user: doc.user,
                    response: doc.response,
                    //kehadiran: doc.response.length,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/attendances/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    })
});


router.post('/', checkAuth, (req, res, next) => {
    Event.findById(req.body.eventId)
    .then(event =>{
        if(!event){
            return res.status(404).json({
                message: 'Event not found'
            })
        }
        const attendance = new Attendance({
            _id: mongoose.Types.ObjectId(),
            event: req.body.eventId,
            user: req.body.userId,
            response: req.body.response
        });
        return attendance.save();
            })
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Attendance stored',
                    createdAttendance: {
                        _id: result._id,
                        event: result.event,
                        user: result.user,
                        response: result.response
                    },
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/attendances/' + result._id
                    }
                });
            
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Attendance not created',
                    error: err
                });
    });
});

router.get('/:attendanceId', checkAuth, (req, res, next) => {
    Attendance.findById(req.params.attendanceId)
    .populate('event user')
    .exec()
    .then(attendance => {
        if(!attendance){
            return res.status(404).json({
                message: 'Attendance not found'
            });
        }
        res.status(200).json({
            attendance: attendance,
            //kehadiran: invitation.response.length,
            request :{
                type: 'GET',
                url: "http://localhost:3000/attendances"
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
});

router.patch('/:attendanceId', checkAuth, (req,res,next) =>{
    const id = req.params.attendanceId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Attendance.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result=> {
        res.status(200).json({
            message: 'Attendance updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/attendances/' + id
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

router.delete('/:attendanceId', checkAuth, (req, res, next) => {
    Attendance.remove({_id: req.params.attendanceId}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Attendance deleted',
            request :{
                type: 'POST',
                url: "http://localhost:3000/attendances",
                body: {
                    productId: 'ID',
                    userId: 'ID',
                    response: 'int'
                }
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
});


module.exports = router;