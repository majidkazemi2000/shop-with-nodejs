const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const cors = require('cors')
const apiLimiter = new RateLimit({
    windowMs : 1000 * 60 * 5,
    max : 5,
    // message : "درخواست شما زیاد بوده لطفا 15 دقیقه دیگر دوباره تلاش کنید"
    handler : function (req, res, /*next*/) {
        res.json({
            data : 'درخواست شما زیاد بوده لطفا 15 دقیقه دیگر دوباره تلاش کنید',
            status : 'error'
        })
    }
});

const apiv1 = require('./api-v1')
// const apiv2 = require('./api-v2');


router.use('/api/v1' , cors() , apiLimiter , apiv1);
// router.use('/api/v2' , apiv2);

module.exports = router;