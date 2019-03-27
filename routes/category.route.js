const express = require('express');
const router = express.Router();

const { Category } = require('../sequelize')

router.get('/all/categories', (req, res) => {
    Category.findAll().then(categories => {
        return res.json(categories).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

// router.post('/new/category', (req, res) => {
//     Category.create(req.body).then(category => {
//         return res.json(category).status(200)
//     }).catch(err => {
//         return res.json(err).status(400)
//     })
// })

module.exports = router