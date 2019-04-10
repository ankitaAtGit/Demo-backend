const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { Wishlist, Course } = require('../sequelize');
const { jwtSecret } = require('../configs/general')

router.get('/:userId', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            Wishlist.findAll({ where: { UserId: req.params.userId } }).then(async list => {
                let wishlist = list.map(_ => _.dataValues);
                let courseData = [];
                await Promise.all(wishlist.map(async w => {
                    await Course.findOne({ where: { id: w.CourseId, isDeleted: false } }).then(course => {
                        courseData.push(course.dataValues)
                    })
                }))
                return res.json({ wishlist, courseData }).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

router.post('/new', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            Wishlist.create(req.body).then(async wishlist => {
                let courseData = await Course.findOne({ where: { id: req.body.CourseId, isDeleted: false } }).then(course => {
                    return course.dataValues
                })
                wishlist = wishlist.dataValues;
                return res.json({ wishlist, courseData }).status(200)
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
            Wishlist.destroy({ where: { UserId: req.params.userId, CourseId: req.params.courseId } }).then(resp => {
                return res.json(resp).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})
module.exports = router;