const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')

const { SubscribedUser, Course } = require('../sequelize');
const { jwtSecret } = require('../configs/general')

router.post('/new', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            SubscribedUser.create(req.body).then(async subUser => {
                let subscriberCount = 0;
                await SubscribedUser.count({ where: { CourseId: req.body.CourseId } }).then(count => {
                    subscriberCount = count;
                })
                let resp = subUser.dataValues;
                resp.subscriberCount = subscriberCount
                return res.json(resp).status(200);
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

router.get('/all/user/course/:userId', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            SubscribedUser.findAll({ where: { UserId: Number(req.params.userId) } }).then(async (courses) => {
                let courseData = []
                await Promise.all(courses.map(async c => {
                    let id = Number(c.dataValues.CourseId)
                    await Course.findOne({ where: { id } }).then(course => {
                        courseData.push(course.dataValues)
                    })
                }))
                return res.json({ courses, courseData }).status(200);
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

router.put('/rate/:id', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            let id = req.params.id;
            let { course_rating, UserId } = req.body;
            SubscribedUser.update({ course_rating: course_rating }, { where: { CourseId: id, UserId: UserId } }).then(async (resp) => {
                avg = await SubscribedUser.findAll({
                    attributes: ['CourseId', [sequelize.fn('avg', sequelize.col('course_rating')), 'avg']],
                    where: { CourseId: id }
                }).then(data => {
                    let avgrate = data.map(d => {
                        Course.update({ course_rating: parseInt(d.dataValues.avg, 10) }, { where: { id } })
                        return parseInt(d.dataValues.avg, 10)
                    })
                    return avgrate[0]
                })
                return res.json(avg).status(200);
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

module.exports = router;

