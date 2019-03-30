const express = require('express');
const router = express.Router();

const sequelize = require('sequelize')
const { SubscribedUser, Course } = require('../sequelize');

router.get('/all', (req, res) => {
    SubscribedUser.findAll().then(subUser => {
        return res.json(subUser).status(200);
    }).catch(err => {
        return res.json(err).status(400)
    })
})


router.post('/new', (req, res) => {
    SubscribedUser.create(req.body).then(subUser => {
        return res.json(subUser).status(200);
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.get('/all/user/course/:userId', (req, res) => {
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
})

router.put('/rate/:id', (req, res) => {
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
            return avgrate
        })
        return res.json(avg).status(200);
    }).catch(err => {
        return res.json(err).status(400)
    })
})

module.exports = router;

