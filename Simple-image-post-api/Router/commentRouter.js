const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const comment = require("../controllers/comment");

router.post('/create', authenticate, comment.createComment);
router.delete('/delete/:id', authenticate, comment.deleteComment);

module.exports = router