const express = require('express');
const router = express.Router();

// Controllers
const CourseController = require('app/http/controllers/api/v1/courseController');
const AuthController = require('app/http/controllers/api/v1/authController');

//validator 
const loginValidator = require('app/http/validators/loginValidator');

router.get('/courses' , CourseController.courses);
router.get('/courses/:course' , CourseController.singleCourse);
router.get('/courses/:course/comments' , CourseController.commentForSingleCourse);

router.post('/login' , loginValidator.handle() , AuthController.login);

module.exports = router;