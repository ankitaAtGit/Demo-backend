const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { Course, User } = require('../sequelize')

router.get('/all/courses', (req, res) => {
    Course.findAll({ where: { isDeleted: false } }).then(courses => {
        return res.json(courses).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.get('/details/:id', (req, res) => {
    Course.findOne({
        where: { id: req.params.id }
    }).then(course => {
        User.findOne({ attributes: ['firstName', 'lastName', 'email', 'id'], where: { id: course.dataValues.UserId } }).then(author => {
            return res.json({ course: { course, author } }).status(200)
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

router.post('/new/course', (req, res) => {
    Course.create(req.body).then(course => {
        return res.json(course).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.put('/edit/course/:id', (req, res) => {
    let id = req.params.id
    Course.update(req.body, { where: { id } }).then(resp => {
        Course.findOne({
            where: { id }
        }).then(course => {
            User.findOne({ attributes: ['name', 'email', 'id'], where: { id: course.dataValues.UserId } }).then(author => {
                return res.json({ course: { course, author } }).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            });
        }).catch(err => {
            return res.json(err).status(400)
        })
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.delete('/delete/:id', (req, res) => {
    Course.update({ isDeleted: true }, { where: { id: req.params.id } }).then(resp => {
        return res.json(resp).status(200);
    }).catch(err => {
        return res.json(err).status(400);
    })
})
router.get('/search/:query', (req, res) => {
    course.findAll({
        where: {
            name: {
                [Op.like]: req.params.query + '%'
            }
        },
        order: ['course_name']
    }).then(courses => {
        return res.json(courses).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    });
})

module.exports = router