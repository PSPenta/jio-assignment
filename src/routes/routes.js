const router = require('express').Router();
const { check, query } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const dependencies = require('./routesDependencies');
const { responseMsg } = require('../helpers/utils');

router.get('/health', (req, res) => res.status(StatusCodes.OK).json(responseMsg(null, true, 'OK')));

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - Authentication
 *    name: Local Login API
 *    summary: Based on user's data, this api sent jwt token which leads to login process.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - email
 *         - password
 *    responses:
 *      200:
 *        description: JWT token will be in response.
 *      500:
 *        description: Internal server error.
 */
router.post(
  '/login',
  [
    check('email').exists().withMessage('The email is mandatory!')
      .isEmail()
      .normalizeEmail(),
    check('password', '...')
      .exists().withMessage('The password is mandatory!')
      .isLength({ min: 8, max: 15 })
      .withMessage('The password length must be between 8 and 15 digits!')
      .matches(/^(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$&*]{8,15}$/, 'i')
      .withMessage('The password must contain at least 1 uppercase, 1 lowercase, 1 special character and 1 number!')
  ],
  dependencies.middlewares.requestValidator.validateRequest,
  dependencies.controllers.authClient.jwtLogin
);

/**
 * @swagger
 * /node-jobs:
 *  get:
 *    tags:
 *      - Others
 *    name: Gets all the jobs from the redis server (if filters passed, get the specific jobs).
 *    summary: This api will give either all or the filtered jobs information.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Param Data
 *        in: param
 *        schema:
 *          type: object
 *          properties:
 *            location:
 *              type: string
 *            page:
 *              type: number
 *    responses:
 *      200:
 *        description: All the jobs.
 *      422:
 *        description: Input validation error messages.
 *      500:
 *        description: Internal server error.
 */
router.get(
  '/node-jobs',
  [
    query('location').optional({ nullable: true }).isAlpha().withMessage('The location is invalid!'),
    query('page').optional({ nullable: true }).isInt().withMessage('The page is invalid!')
  ],
  dependencies.middlewares.requestValidator.validateRequest,
  dependencies.controllers.jobs.nodeJobs
);

module.exports = router;
