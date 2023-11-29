const express = require("express");
const router = express.Router();
const follower = require("../controllers/follower");
const authenticate = require("../middlewares/authenticate");

router.post('/create/:id', authenticate, follower.follow);
router.delete('/cancle/:id', authenticate, follower.cancleFollow)


module.exports = router