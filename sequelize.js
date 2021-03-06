const Sequelize = require('sequelize');
const { host, database, username, password } = require('./configs/database.js');
const UserModel = require('./schemas/user.schema');
const CategoryModel = require('./schemas/category.schema');
const CourseModel = require('./schemas/course.schema');
const SubscribedUserModel = require('./schemas/subsribedUser.schema');
const ChapterModel = require('./schemas/chapter.schema');
const UserCartModel = require('./schemas/usercart.schema');
const ChapterFileModel = require('./schemas/chapterfile.schema');
const WishlistModel = require('./schemas/wishlist.schema');

const Op = Sequelize.Op
const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: 'mysql',
    operatorsAliases: Op,
});


const User = UserModel(sequelize, Sequelize);
const Category = CategoryModel(sequelize, Sequelize);
const Course = CourseModel(sequelize, Sequelize);
const SubscribedUser = SubscribedUserModel(sequelize, Sequelize);
const Chapter = ChapterModel(sequelize, Sequelize);
const UserCart = UserCartModel(sequelize, Sequelize)
const ChapterFile = ChapterFileModel(sequelize, Sequelize)
const Wishlist = WishlistModel(sequelize, Sequelize)

User.hasMany(Course, { foreignKey: 'UserId', sourceKey: 'id' });
Course.belongsTo(User, { foreignKey: 'UserId', targetKey: 'id' });

Category.hasMany(Course, { foreignKey: 'CategoryId', sourceKey: 'id' });
Course.belongsTo(Category, { foreignKey: 'CategoryId', targetKey: 'id' });

Course.hasMany(Chapter, { foreignKey: 'CourseId', sourceKey: 'id' });
Chapter.belongsTo(Course, { foreignKey: 'CourseId', targetKey: 'id' });

User.belongsToMany(Course, {
    through: SubscribedUser,
    foreignKey: 'UserId'
});

Course.belongsToMany(User, {
    through: SubscribedUser,
    foreignKey: 'CourseId'
});

User.belongsToMany(Course, {
    through: UserCart,
    foreignKey: 'UserId'
})

Course.belongsToMany(User, {
    through: UserCart,
    foreignKey: 'CourseId'
})

Chapter.hasMany(ChapterFile, { foreignKey: 'ChapterId', sourceKey: 'id' });
ChapterFile.belongsTo(Chapter, { foreignKey: 'ChapterId', targetKey: 'id' });

User.belongsToMany(Course, {
    through: Wishlist,
    foreignKey: 'UserId'
})

Course.belongsToMany(User, {
    through: Wishlist,
    foreignKey: 'CourseId'
})

// sequelize.sync().then(() => {
//     console.log(`Database and tables have been created`);
// });

sequelize
    .authenticate()
    .then(() => {
        console.log('Mysql connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = { User, Category, Course, SubscribedUser, Chapter, UserCart, ChapterFile, Wishlist };
