// userValidators.js
const { body } = require('express-validator');
const { checkSchema } = require('express-validator');

const otp = () => {
    return [
        body('code')
            .notEmpty().withMessage('code is required')
            .isString().withMessage('code must be a string'),
    ];
};



module.exports = {
    
};
