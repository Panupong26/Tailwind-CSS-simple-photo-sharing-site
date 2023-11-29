const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const post = require("../controllers/post")
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Upload/postImages')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
      cb(null, uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage });

router.post('/create', authenticate, upload.any('media'), post.createPost);
router.get('/getuserpost/:id/:offset', post.getUserPost);
router.get('/getusertagpost/:id/:offset', post.getUserTagPost);
router.get('/getallpost/:offset', post.getAllPost);
router.get('/getbyquery/:offset/:query', post.getPostByQuery);
router.get('/:id', authenticate, post.getPost);
router.post('/like/:id', authenticate, post.likePost);
router.delete('/unlike/:id', authenticate, post.unlikePost);
router.delete('/delete/:id', authenticate, post.deletePost);


module.exports = router