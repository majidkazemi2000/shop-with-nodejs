const controller = require('app/http/controllers/controller');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string')
const mail = require('app/helpers/mail');

class forgotPasswordController extends controller {
    
    showForgotPassword(req , res) {
        const title = 'فراموشی رمز عبور';
        res.render('home/auth/passwords/email' , { recaptcha : this.recaptcha.render() , title });
    }

    async sendPasswordResetLink(req  ,res , next) {
        // await this.recaptchaValidation(req , res);
        let result = await this.validationData(req)
        if(result) {
            return this.sendResetLink(req, res)
        } 
        
        return this.back(req ,res);
    }

    async sendResetLink(req ,res , next) {
        let user = await User.findOne({ email : req.body.email });
        if(! user) {
            req.flash('errors' , 'چنین کاربری وجود ندارد');
            return this.back(req, res);
        }

        const newPasswordReset = new PasswordReset({
            email : req.body.email,
            token : uniqueString()
        });
        
        await newPasswordReset.save();


        let mailOptions = {
            from: 'مجید کاظمی', // sender address
            to: `${newPasswordReset.email}`, // list of receivers
            subject: 'ریست کردن پسورد', // Subject line
            html: `
                <h2>ریست کردن پسورد</h2>
                <p>برای ریست کردن پسورد بر روی لینک زیر کلیک کنید</p>
                <a href="${config.siteurl}/auth/password/reset/${newPasswordReset.token}">ریست کردن</a>
            ` // html body
        };

        mail.sendMail(mailOptions  , (err , info) => {
            if(err) return console.log(err);

            console.log('Message Sent : %s' , info.messageId);

            this.alert(req, {
                title : 'دقت کنید',
                message : 'ایمیل حاوی لینک پسورد به ایمیل شما ارسال شد',
                type  : 'success'
            });

            return res.redirect('/');

        })
        
        // req.flash('success' , 'ایمیل بازیابی رمز عبور با موفقیت انجام شد');
        res.redirect('/');
    }

}

module.exports = new forgotPasswordController();