module.exports = (sequelize, type) => {
    return sequelize.define('subscribedUser', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: type.INTEGER,
            allowNull: false
        },
        CourseId: {
            type: type.INTEGER,
            allowNull: false
        },
        course_rating: {
            type: type.INTEGER,
            defaultValue: 0
        }
    })
}