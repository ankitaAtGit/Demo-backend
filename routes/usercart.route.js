const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const { UserCart, Course } = require('../sequelize')
const { jwtSecret } = require('../configs/general')

router.get('/user/:userId', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            UserCart.findAll({ where: { UserId: req.params.userId } }).then(async cart => {
                let courseData = []
                await Promise.all(cart.map(async c => {
                    let id = Number(c.dataValues.CourseId)
                    await Course.findOne({ where: { id, isDeleted: false } }).then(course => {
                        courseData.push(course.dataValues)
                    })
                }))
                return res.json({ cart, courseData }).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

router.post('/user/new', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            UserCart.create(req.body).then(cart => {
                return res.json(cart).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

router.delete('/user/:userId/course/:courseId', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            UserCart.destroy({ where: { CourseId: req.params.courseId, UserId: req.params.userId } }).then(resp => {
                return res.json(resp).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

router.get('/count/:userId', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            UserCart.count({ where: { UserId: req.params.userId } }).then(count => {
                if (!count) count = 0
                return res.json(count).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

module.exports = router