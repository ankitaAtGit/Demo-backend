const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken')

const { jwtSecret } = require('../configs/general')
const { checkToken } = require('../common');
const { Chapter, ChapterFile } = require('../sequelize')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './chapterfiles/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage });

router.get('/course/:id', (req, res) => {
    Chapter.findAll({ where: { CourseId: req.params.id, isDeleted: false } }).then(async chapters => {
        let chapterData = chapters.map(ch => ch.dataValues);
        await Promise.all(chapterData.map(async (c, i) => {
            let id = Number(c.id)
            let ChapterFiles = await ChapterFile.findAll({ where: { ChapterId: id, isDeleted: false } }).then(ch => {
                fileData = ch.map(ch => ch.dataValues)
                return fileData
            })
            chapterData[i].ChapterFiles = ChapterFiles
        }))
        return res.json(chapterData).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.post('/new', checkToken, upload.array('chapter_files'), (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden routes')
        else {
            req.body.CourseId = Number(req.body.CourseId)
            let files = []
            Chapter.create(req.body).then(async chapter => {
                if (req.files) {
                    for (let file of req.files) {
                        let chapter_file = { file_name: file.filename, ChapterId: chapter.dataValues.id, file_type: file.mimetype }
                        let fileData = await ChapterFile.create(chapter_file).then(resp => {
                            return resp.dataValues;
                        }).catch(err => {
                            console.log(err)
                        })
                        files.push(fileData)
                    }
                }
                let chapterData = chapter.dataValues;
                chapterData = { ...chapterData, ChapterFiles: files }
                return res.json(chapterData).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})

router.delete('/:id', checkToken, (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err) {
            return res.status(403).json('Accessing forbidden route')
        }
        else {
            Chapter.update({ isDeleted: true }, { where: { id: req.params.id } }).then(resp => {
                return res.json(resp).status(200);
            }).catch(err => {
                return res.json(err).status(200)
            })
        }
    })
})

router.put('/:id', checkToken, upload.array('chapter_files'), (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, data) => {
        if (err)
            return res.status(403).json('Accessing forbidden routes')
        else {
            req.body.CourseId = Number(req.body.CourseId)
            let files = []
            Chapter.update(req.body, { where: { id: req.params.id } }).then(async chapter => {
                if (req.files) {
                    for (let file of req.files) {
                        let chapter_file = { file_name: file.filename, ChapterId: req.params.id, file_type: file.mimetype }
                        let fileData = await ChapterFile.create(chapter_file).then(resp => {
                            return resp.dataValues;
                        }).catch(err => {
                            console.log(err)
                        })
                        files.push(fileData)
                    }
                }
                let chapterData = files;
                return res.json(chapterData).status(200)
            }).catch(err => {
                return res.json(err).status(400)
            })
        }
    })
})
module.exports = router;