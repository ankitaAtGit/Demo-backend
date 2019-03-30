const express = require('express')
const router = express.Router()

const { UserCart } = require('../sequelize')

router.get('/user/:userId', (req, res) => {
    UserCart.findAndCountAll({ where: { UserId: req.params.userId } }).then(result => {
        return res.json(result).status(200)
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

module.exports = router