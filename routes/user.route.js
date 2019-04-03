const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/general')
const multer = require('multer');

const { User } = require('../sequelize')
const { checkToken } = require('../common')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

let upload = multer({ storage });


router.post('/sign-up', upload.single('picture'), (req, res, next) => {
    return passport.authenticate('local-signup', (err, passportUser, info) => {
        if (err) {
            return res.status(400).json(err.message);
        }

        if (passportUser) {
            const user = { email: passportUser.email, id: passportUser.id, name: passportUser.name, picture: (req.file ? req.file.filename : null) };
            return res.json({ user: user });
        }

        return res.status(400).json(info);
    })(req, res, next);
});

router.post('/sign-in', (req, res, next) => {
    return passport.authenticate('local-login', (err, passportUser, info) => {
        if (err) {
            return res.status(400).json(err.message);
        }

        if (passportUser) {
            const user = { email: passportUser.email, id: passportUser.id, name: passportUser.name };
            user.token = jwt.sign({ email: passportUser.email, id: passportUser.id }, jwtSecret);

            return res.json({ user: user });
        }
        return res.status(400).json(info);

    })(req, res, next);
});

router.get('/get-user/:id', (req, res) => {
    User.findOne({ attributes: ['id', 'email', 'firstName', 'lastName', 'picture'], where: { id: req.params.id } }).then(user => {
        return res.json(user).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
})

router.put('/edit/:id', upload.single('picture'), (req, res) => {
    let id = req.params.id;
    if (req.file) {
        req.body.picture = req.file.filename
    }
    return User.update({ ...req.body }, { where: { id } }).then((user) => {
        res.json(req.body.picture).status(200);
    }).catch((err) => {
        res.json({ "error": JSON.stringify(err) }).status(400);
    });
})

module.exports = router;
