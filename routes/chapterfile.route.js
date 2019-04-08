const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/general')


const { ChapterFile } = require('../sequelize');


router.delete('/:id', (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err) {
            return res.status(403).json('Accessing forbidden route')
        }
        else {
            ChapterFile.update({ isDeleted: true }, { where: { id: req.params.id } }).then(resp => {
                return res.json(resp).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

module.exports = router