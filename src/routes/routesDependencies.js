/* eslint-disable global-require */
module.exports = {
  controllers: {
    authClient: require('../controllers/authController'),
    jobs: require('../controllers/jobsController')
  },
  middlewares: {
    auth: require('../middlewares/auth'),
    requestValidator: require('../middlewares/validation')
  }
};
