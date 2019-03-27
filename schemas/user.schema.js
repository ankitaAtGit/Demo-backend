module.exports = (sequelize, type) => {
    return sequelize.define('User', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: type.STRING,
            unique: true
        },
        password: type.STRING,
        firstName: type.STRING,
        lastName: type.STRING,
        isDeleted: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        picture: type.STRING
    })
}