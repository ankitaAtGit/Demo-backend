module.exports = (sequelize, type) => {
    return sequelize.define('ChapterFile', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        file_name: type.STRING,
        ChapterId: {
            type: type.INTEGER,
            allowNull: false
        },
        file_type: type.STRING,
        isDeleted: {
            type: type.BOOLEAN,
            defaultValue: false
        }
    })
}