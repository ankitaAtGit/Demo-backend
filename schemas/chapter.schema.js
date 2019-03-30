module.exports = (sequelize, type) => {
    return sequelize.define('Chapter', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chapter_title: {
            type: type.STRING
        },
        chapter_files: type.STRING,
        CourseId: {
            type: type.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: type.BOOLEAN,
            defaultValue: false
        }
    })
}