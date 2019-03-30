module.exports = (sequelize, type) => {
    return sequelize.define('UserCart', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UserId: {
            type: type.INTEGER,
            allowNull: false
        },
        CourseId: {
            type: type.INTEGER,
            allowNull: false
        }
    })
}