module.exports = (sequelize, type) => {
    return sequelize.define('Course', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        course_name: type.STRING,
        course_description: type.STRING,
        course_rating: {
            type: type.INTEGER,
            defaultValue: 0
        },
        isDeleted: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        price: type.INTEGER
    })
}