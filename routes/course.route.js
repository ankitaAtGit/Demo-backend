const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../configs/general')
const { Course, User, SubscribedUser } = require('../sequelize')
const { checkToken } = require('../common')

router.get('/all/courses', (req, res) => {
    Course.findAll({ where: { isDeleted: false } }).then(courses => {
        return res.json(courses).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.get('/details/:id', (req, res) => {
    Course.findOne({
        where: { id: req.params.id, isDeleted: false }
    }).then(course => {
        let subscriberCount = 0
        SubscribedUser.count({ where: { CourseId: req.params.id } }).then(count => {
            subscriberCount = count
        }).catch(err => {
            console.log(err)
        })
        User.findOne({ attributes: ['firstName', 'lastName', 'email', 'id'], where: { id: course.dataValues.UserId } }).then(author => {
            let courseData = course.dataValues
            return res.json({ ...courseData, author, subscriberCount }).status(200)
        }).catch(err => {
            return res.json(err).status(400)
        });
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.get('/category/courses/:catId', (req, res) => {
    Course.findAll({ where: { categoryId: req.params.catId, isDeleted: false } }).then(courses => {
        return res.json(courses).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.get('/user/courses/:userId', (req, res) => {
    Course.findAll({ where: { UserId: req.params.userId, isDeleted: false } }).then(courses => {
        return res.json(courses).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.post('/new/course', checkToken, (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err) {
            return res.status(403).json('Accessing forbidden route')
        }
        else {
            if (req.body.CategoryId === 1) {
                req.body.picture = 'category_photography.jpg'
            }
            else if (req.body.CategoryId === 2) {
                req.body.picture = 'category_it_and_software.png'
            }
            else if (req.body.CategoryId === 3) {
                req.body.picture = 'category_web_development.png'
            }
            else if (req.body.CategoryId === 4) {
                req.body.picture = 'category_music.jpg'
            }
            Course.create(req.body).then(course => {
                return res.json(course).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })

})

router.put('/edit/course/:id', checkToken, (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden route')
        else {
            let id = req.params.id
            Course.update(req.body, { where: { id, isDeleted: false } }).then(resp => {
                Course.findOne({
                    where: { id }
                }).then(course => {
                    User.findOne({ attributes: ['name', 'email', 'id'], where: { id: course.dataValues.UserId } }).then(author => {
                        let courseData = course.dataValues
                        return res.json({ ...courseData, author }).status(200)
                    }).catch(err => {
                        return res.json(err).status(400)
                    });
                }).catch(err => {
                    return res.json(err).status(400)
                })
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })

})

router.delete('/delete/:id', checkToken, (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err) {
            return res.status(403).json('Accessing forbidden route')
        }
        else {
            SubscribedUser.findOne({ where: { CourseId: req.params.id } }).then(scourse => {
                if (!scourse) {
                    Course.update({ isDeleted: true }, { where: { id: req.params.id } }).then(resp => {
                        return res.json(resp).status(200);
                    }).catch(err => {
                        return res.json(err).status(400);
                    })
                }
                else
                    return res.status(400).json('Cannot delete a course with subscribers')
            }).catch(err => {
                return res.json(err).status(400);
            })
        }
    })
})

module.exports = router