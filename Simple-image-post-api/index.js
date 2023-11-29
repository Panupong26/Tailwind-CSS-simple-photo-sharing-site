const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors");
const helmet = require("helmet");
const db = require("./models");
const userRouter = require("./Router/userRouter");
const followerRouter = require("./Router/followRouter");
const postRouter = require("./Router/postRouter");
const commentRouter = require("./Router/commentRouter");
const handleErr = require("./middlewares/handleErr");

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(helmet());
app.use('/user', userRouter);
app.use('/follower', followerRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);

app.use(handleErr);




db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 8000, () => console.log(`Server is running at port ${process.env.PORT}`));
})












