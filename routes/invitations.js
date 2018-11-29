const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Invitation = require('../model/invitation')
const User = require('../model/users');
const Event = require('../model/event')


router.get('/', checkAuth, (req, res, next) => {
    Invitation
    .find()
    .select('event user _id')
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
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/invitations/' + doc._id
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
        const invitation = new Invitation({
            _id: mongoose.Types.ObjectId(),
            event: req.body.eventId,
            user: req.body.userId
        });
        return invitation.save();
            })
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Invitation stored',
                    createdAttendance: {
                        _id: result._id,
                        event: result.event,
                        user: result.user
                    },
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/invitations/' + result._id
                    }
                });
            
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Invitation not created',
                    error: err
                });
    });
});

router.get('/:invitationId', checkAuth, (req, res, next) => {
    Attendance.findById(req.params.invitationId)
    .populate('event user')
    .exec()
    .then(invitation => {
        if(!invitation){
            return res.status(404).json({
                message: 'Invitation not found'
            });
        }
        res.status(200).json({
            attendance: attendance,
            request :{
                type: 'GET',
                url: "http://localhost:3000/invitations"
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
});

router.patch('/:invitationId', checkAuth, (req,res,next) =>{
    const id = req.params.invitationId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Invitation.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result=> {
        res.status(200).json({
            message: 'Invitation updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/invitations/' + id
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

router.delete('/:invitationId', checkAuth, (req, res, next) => {
    Invitation.remove({_id: req.params.invitationId}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Invitation deleted',
            request :{
                type: 'POST',
                url: "http://localhost:3000/invitations",
                body: {
                    productId: 'ID',
                    userId: 'ID'
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