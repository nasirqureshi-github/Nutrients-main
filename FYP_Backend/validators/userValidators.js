// userValidators.js
const { body } = require('express-validator');
const { checkSchema } = require('express-validator');

const createuserValidationRules = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string'),
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email'),
        body('Province')
            .notEmpty().withMessage('Province is required')
            .isString().withMessage('Province must be a string'),
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .custom(value => {
                const hasUpperCase = /[A-Z]/.test(value);
                const hasNumber = /[0-9]/.test(value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
                    throw new Error('Password must contain at least one uppercase letter, one number, and one special character');
                }
                return true;
            }),
        body('age')
            .notEmpty().withMessage('Age is required')
            .isString().withMessage('Age must be a string'),
        body('Areyou')
            .notEmpty().withMessage('Areyou is required')
            .isString().withMessage('Areyou must be a string'),
        body('DoB')
            .notEmpty().withMessage('Date of birth is required')
            .isString().withMessage('Date of birth must be a string')
    ];
};
const createuserValidationRules2 = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string'),
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email'),
        body('Province')
            .notEmpty().withMessage('Province is required')
            .isString().withMessage('Province must be a string'),
        body('age')
            .notEmpty().withMessage('Age is required')
            .isString().withMessage('Age must be a string'),
        body('Areyou')
            .notEmpty().withMessage('Areyou is required')
            .isString().withMessage('Areyou must be a string'),
        body('DoB')
            .notEmpty().withMessage('Date of birth is required')
            .isString().withMessage('Date of birth must be a string')
    ];
};

const loginuserValidationRules = () => {
    return [

        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .notEmpty().isString().withMessage('Please provide a valid Password')
    ];
};
const otp = () => {
    return [
        body('code')
            .notEmpty().withMessage('code is required')
            .isString().withMessage('code must be a string'),
    ];
};

const userValidationSchema = checkSchema({
    name: {
        optional: true,
        isString: {
            errorMessage: 'Name must be a string',
        },
    },
    phone: {
        optional: true,
        isString: {
            errorMessage: 'Phone must be a string',
        },
    },
    image: {
        optional: true,
        isString: {
            errorMessage: 'Image must be a string',
        },
    },
    address: {
        optional: true,
        isString: {
            errorMessage: 'Address must be a string',
        },
    },
    facebookUrl: {
        optional: true,
        isString: {
            errorMessage: 'Facebook URL must be a string',
        },
    },
    youtubeUrl: {
        optional: true,
        isString: {
            errorMessage: 'YouTube URL must be a string',
        },
    },
    instagramUrl: {
        optional: true,
        isString: {
            errorMessage: 'Instagram URL must be a string',
        },
    },
    tiktokUrl: {
        optional: true,
        isString: {
            errorMessage: 'TikTok URL must be a string',
        },
    },
    twitterUrl: {
        optional: true,
        isString: {
            errorMessage: 'Twitter URL must be a string',
        },
    },
    agencyName: {
        optional: true,
        isString: {
            errorMessage: 'Agency name must be a string',
        },
    },
    agencyLogo: {
        optional: true,
        isString: {
            errorMessage: 'Agency logo must be a string',
        },
    },
    agencyAddress: {
        optional: true,
        isString: {
            errorMessage: 'Agency address must be a string',
        },
    },
    agencyLandline: {
        optional: true,
        isString: {
            errorMessage: 'Agency landline must be a string',
        },
    },
    agencyPhone: {
        optional: true,
        isString: {
            errorMessage: 'Agency phone must be a string',
        },
    },
    agencyAbout: {
        optional: true,
        isString: {
            errorMessage: 'Agency about must be a string',
        },
    }
});



module.exports = {
    createuserValidationRules, otp, loginuserValidationRules, userValidationSchema, createuserValidationRules2
};
