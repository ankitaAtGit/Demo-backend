const bcrypt = require('bcrypt-nodejs');

exports.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

exports.matchHash = function (val1, val2) {
    return bcrypt.compareSync(val1, val2);
}

exports.checkToken = (req, res, next) => {
    const header = req.headers['Authorization'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token
        next();
    }
    else {
        res.json('Forbidden').status(403)
    }
}
