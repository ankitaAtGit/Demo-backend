const express = require('express')
const router = express.Router();
const multer = require('multer');

const { ChapterFile } = require('../sequelize');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './chapterfiles/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage });

router.post('/new', (req, res) => {
    
})