module.exports = (sequelize, type) => {
    return sequelize.define('Category', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category_name: type.STRING
    })
}