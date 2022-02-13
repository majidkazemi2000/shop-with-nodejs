const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').Recaptcha;
const { validationResult } = require('express-validator/check');
const isMongoId = require('validator/lib/isMongoId');
const sprintf = require('sprintf-js').sprintf;

module.exports = class controller {
    constructor() {
        autoBind(this);
        this.recaptchaConfig();
    }

    recaptchaConfig() {
        this.recaptcha = new Recaptcha(
            config.service.recaptcha.client_key,
            config.service.recaptcha.secret_key , 
            {...config.service.recaptcha.options}
        );
    }

    recaptchaValidation(req , res) {
        return new Promise((resolve , reject) => {
            this.recaptcha.verify(req , (err , data) => {
                if(err) {
                    req.flash('errors' , 'گزینه امنیتی مربوط به شناسایی روبات خاموش است، لطفا از فعال بودن آن اطمینان حاصل نمایید و مجدد امتحان کنید');
                    this.back(req,res)
                } else resolve(true);
            })
        })
    }

    async validationData(req) {
        const result = validationResult(req);
        if (! result.isEmpty()) {
            const errors = result.array();
            const messages = [];
           
            errors.forEach(err => messages.push(err.msg));

            req.flash('errors' , messages)

            return false;
        }

        return true;
    }

    back(req , res) {
        req.flash('formData' , req.body);
        return res.redirect(req.header('Referer') || '/');
    }

    isMongoId(paramId) {
        if(! isMongoId(paramId))
            this.error('ای دی وارد شده صحیح نیست', 404);
    }

    error(message , status = 500) {
        let err = new Error(message);
        err.status = status;
        throw err;
    }

    getTime(episodes) {
        let second = 0;

        episodes.forEach(episode => {
            let time = episode.time.split(":");
            if(time.length === 2) {
                second += parseInt(time[0]) * 60;
                second += parseInt(time[1]);
            } else if(time.length === 3) {
                second += parseInt(time[0]) * 3600;
                second += parseInt(time[1]) * 60;
                second += parseInt(time[2]);
            }
        });

        let minutes = Math.floor(second / 60);
        
        let hours = Math.floor(minutes / 60);

        minutes -= hours * 60;

        second = Math.floor(( ( second / 60 ) % 1 ) * 60 );
    
        return sprintf('%02d:%02d:%02d' , hours , minutes , second);
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }

    alert(req , data) {
        let title = data.title || '',
            message = data.message || '',
            type = data.type || 'info',
            button = data.button || null,
            timer = data.timer || 2000;

        req.flash('sweetalert' , { title , message , type , button , timer});
    }

    alertAndBack(req, res , data) {
        this.alert(req , data);
        this.back(req , res);
    }
}