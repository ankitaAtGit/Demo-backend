const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const { port } = require('./configs/general')
const userRoute = require('./routes/user.route');
const categoryRoute = require('./routes/category.route');
const courseRoute = require('./routes/course.route');
const subscribedUserRoute = require('./routes/subscribedUser.route');
const chapterRoute = require('./routes/chapter.route');
const cartRoute = require('./routes/usercart.route');
const { checkToken } = require('./common')
const app = express();

require('./configs/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

let ImageDir = require('path').join(__dirname, '/images/');
let FileDir = require('path').join(__dirname, '/chapterfiles/');
app.use('/images', express.static(ImageDir));
app.use('/chapterfiles', express.static(FileDir));

app.use(cors());

app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', userRoute)
app.use('/category', categoryRoute);
app.use('/course', courseRoute);
app.use('/sub/course-user', checkToken, subscribedUserRoute);
app.use('/chapter', chapterRoute)
app.use('/cart', checkToken, cartRoute);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});