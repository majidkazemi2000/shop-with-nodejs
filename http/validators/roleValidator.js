const validator = require('./validator');
const { check } = require('express-validator/check');
const Role = require('app/models/role');

class roleValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let role = await Role.findById(req.params.id);
                        if(role.name === value) return;
                    }
                    
                    let role = await Role.findOne({ name : value });
                    if(role) {
                        throw new Error('چنین سطح دسترسی با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),

            check('label')
                .not().isEmpty()
                .withMessage('فیلد توضیح نمیتواند خالی بماند'),

            check('permissions')
                .not().isEmpty()
                .withMessage('فیلد لیست اجازه دسترسی نمیتواند خالی بماند')
        ]
    }

}

module.exports = new roleValidator();