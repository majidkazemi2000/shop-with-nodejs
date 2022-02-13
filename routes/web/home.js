const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('app/http/controllers/homeController');
const courseController = require('app/http/controllers/courseController');
const userController = require('app/http/controllers/userController');

// validators 
const commentValidator = require('app/http/validators/commentValidator');

// middlewares
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const convertFileToField = require('app/http/middleware/convertFileToField')

// Helpers
const upload = require('app/helpers/uploadImage');



router.get('/logout' , (req ,res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});
router.get('/user/activation/:code' , userController.activation);

// Home Routes
router.get('/' , homeController.index);
router.get('/about-me' , homeController.index);
router.get('/courses' , courseController.index);
router.get('/courses/:course' , courseController.single);
router.post('/courses/payment' , redirectIfNotAuthenticated.handle , courseController.payment);
router.get('/courses/payment/checker' , redirectIfNotAuthenticated.handle , courseController.checker);


router.post('/comment' , redirectIfNotAuthenticated.handle , commentValidator.handle() ,homeController.comment);
router.get('/download/:episode' , courseController.download);

router.get('/user/panel' , userController.index);
router.get('/user/panel/history' , userController.history);
router.get('/user/panel/vip' , userController.vip);
router.post('/user/panel/vip/payment' , userController.vipPayment);
router.get('/user/panel/vip/payment/check' , userController.vipPaymentCheck);

router.get('/sitemap.xml' , homeController.sitemap);
router.get('/feed/courses' , homeController.feedCourses);
router.get('/feed/episodes' , homeController.feedEpisodes);

router.get('/ajaxupload' , (req , res , next) => res.render('home/ajaxupload'));
router.post('/ajaxupload' ,  upload.single('photo') , convertFileToField.handle ,(req , res , next) => {
    try {
        res.json({ ...req.body , ...req.file })
    } catch (err) {
        next(err);
    }
});


module.exports = router;