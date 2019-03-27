const bcrypt = require('bcrypt-nodejs');

exports.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

exports.matchHash = function (val1, val2) {
    return bcrypt.compareSync(val1, val2);
}
