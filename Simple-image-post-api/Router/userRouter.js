const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const authenticate = require("../middlewares/authenticate");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Upload/profileImages')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
      cb(null, uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })


router.post('/createuser', user.createUser);
router.post('/login', user.login);
router.get('/getme', authenticate, user.getMe);
router.put('/editme', authenticate, upload.single('profileImage'), user.editProfile)
router.delete('/deleteme', authenticate, user.removeUser);
router.get('/getprofile/:name', authenticate, user.getProfile);
router.get('/getuserautocomplete/:query', authenticate, user.getUserAutoComplete);


module.exports = router