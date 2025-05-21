const { body, validationResult } = require('express-validator');

const validateUser = [
    body('name')
        .isLength({ min: 20, max: 60 })
        .withMessage('Name must be between 20 and 60 characters'),
    body('email')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one uppercase letter and one special character'),
    body('address')
        .isLength({ max: 400 })
        .withMessage('Address must be less than 400 characters'),
];

const validateRating = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
];

const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateUser, validateRating, checkValidationResult };