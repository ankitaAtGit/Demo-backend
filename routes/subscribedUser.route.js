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
    SubscribedUser.findAll({ where: { UserId: req.params.userId } }).then(courses => {
        // let courseArray = []
        // courses.forEach(async (course) => {
        //     let courseData = await Course.findOne({ where: { id: course.dataValues.CourseId } }).then(c => {
        //         return c;
        //     })
        //     courseArray.push(courseData)
        //     // return courseData
        // })
        // console.log(courseArray)
        return res.json(courses).status(200);
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.put('/rate/:id', (req, res) => {
    let id = req.params.id;
    let { course_rating, UserId } = req.body;
    SubscribedUser.update({ course_rating: course_rating }, { where: { CourseId: id, UserId: UserId } }).then((resp) => {
        SubscribedUser.findAll({
            attributes: ['CourseId', [sequelize.fn('avg', sequelize.col('course_rating')), 'avg']],
            where: { CourseId: id }
        }).then(data => {
            data.map(d => {
                Course.update({ course_rating: Number(d.dataValues.avg) }, { where: { id } })
            })
        })
        return res.json(resp).status(200);
    }).catch(err => {
        return res.json(err).status(400)
    })
})

module.exports = router;

