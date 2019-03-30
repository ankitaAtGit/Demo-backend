const express = require('express');
const router = express.Router();
const multer = require('multer');

const { Chapter } = require('../sequelize')
let fileId = 0;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './chapterfiles/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '_' + fileId++)
    }
})

const upload = multer({ storage });

router.get('/course/:id', (req, res) => {
    Chapter.findAll({ where: { CourseId: req.params.id, isDeleted: false } }).then(chapters => {
        return res.json(chapters).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.post('/new', upload.array('chapter_files'), (req, res) => {
    let files = []
    let chapter_files = null
    if (req.files) {
        for (let file of req.files) {
            files.push(file.filename)
        }
        chapter_files = JSON.stringify(files)
    }
    req.body.CourseId = Number(req.body.CourseId)
    req.body.chapter_files = chapter_files;
    Chapter.create(req.body).then(chapter => {
        return res.json(chapter).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.delete('/:id', (req, res) => {
    Chapter.update({ isDeleted: true }, { where: { id: req.params.id } }).then(resp => {
        return res.json(resp).status(200);
    }).catch(err => {
        return res.json(err).status(200)
    })
})

router.delete('/id/:id/file/:file', (req, res) => {
    Chapter.findOne({ where: { id: req.params.id } }).then(chapter => {
        if (chapter) {
            let chapter_files = JSON.parse(chapter.dataValues.chapter_files);
            let x = chapter_files.findIndex(file => file === req.params.file);
            chapter_files.splice(x, 1);
            chapter_files = JSON.stringify(chapter_files);
            Chapter.update({ chapter_files }, { where: { id: req.params.id } }).then(resp => {
                return res.json(resp).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})
module.exports = router;