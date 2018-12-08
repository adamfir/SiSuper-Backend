var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var bcript = require('bcrypt')
var Review = require('../model/review')
var jwt = require('jsonwebtoken')

const checkAuth = require('../middleware/check-auth');

//review counter
var avgReview = (result) =>{
    var i = 0
    var sum_location = 0
    var sum_event = 0
    var sum_content = 0
    for(i = 0; i < result.length; i++){
        sum_location = sum_location + result[i].location_rate
        sum_event = sum_event + result[i].event_rate
        sum_content = sum_content + result[i].content_rate
    }
    return [sum_location/i, sum_event/i, sum_content/i]
}

router.get('/', checkAuth,(req, res, next) => {
    Review.find()
        .exec()
        .then(reviews => {
            res.status(200).json({
                status: 200,
                result: reviews
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: "Failed to retrive"
            })
        })
})

router.post('/getReviewById', checkAuth, (req, res, next) => {
    Review.find({_id: req.body.eventId})
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                result: result
            })
        })
        .catch(err => {
            {
                res.status(500).json({
                    staus: 500,
                    message: "failed to retrive data.",
                    error: err
                })
            }
        })
})

router.post('/createReview', checkAuth, (req, res, next) => {
    const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        user_id: req.body.userId,
        event_id: req.body.eventId,
        location_rate: req.body.locationRate,
        content_rate: req.body.contentRate,
        event_rate: req.body.eventRate,
        review: req.body.review
    })
    review.save()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "Reviews saved!"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: "Failed to add review."
            })
        })
})

router.post('/getAverageRating', checkAuth, (req, res, next) => {
    id = req.body.eventId,
    Review.find({event_id: id})
        .exec()
        .then(result => {
            var avg = avgReview(result)
            res.status(200).json({
                status: 200,
                averageLocationRating: avg[0],
                averageEventRating: avg[1],
                averageContentRating: avg[2]
            })
        })
})

module.exports = router;