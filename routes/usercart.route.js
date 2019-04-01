const express = require('express')
const router = express.Router()

const { UserCart, Course } = require('../sequelize')

router.get('/user/:userId', (req, res) => {
    UserCart.findAll({ where: { UserId: req.params.userId } }).then(async cart => {
        let courseData = []
        await Promise.all(cart.map(async c => {
            let id = Number(c.dataValues.CourseId)
            await Course.findOne({ where: { id } }).then(course => {
                courseData.push(course.dataValues)
            })
        }))
        return res.json({ cart, courseData }).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.post('/user/new', (req, res) => {
    UserCart.create(req.body).then(cart => {
        return res.json(cart).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.delete('/user/:userId/course/:courseId', (req, res) => {
    UserCart.destroy({ where: { CourseId: req.params.courseId, UserId: req.params.userId } }).then(resp => {
        return res.json(resp).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.get('/count/:userId', (req, res) => {
    UserCart.count({ where: { UserId: req.params.userId } }).then(count => {
        return res.json(count).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

module.exports = router