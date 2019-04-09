module.exports = (sequelize, type) => {
    return sequelize.define('Wishlist', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CourseId: {
            type: type.INTEGER,
            allowNull: false
        },
        UserId: {
            type: type.INTEGER,
            allowNull: false
        }
    })
}