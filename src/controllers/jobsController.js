const { StatusCodes } = require('http-status-codes');

const redisClient = require('../config/redisConfig');
const { checkIfDataExists, responseMsg } = require('../helpers/utils');

exports.nodeJobs = async (req, res) => {
  try {
    const newJobs = await redisClient.get('newJobs');

    if (checkIfDataExists(newJobs) && checkIfDataExists(JSON.parse(newJobs))) {
      const jobs = JSON.parse(newJobs);

      let filteredJobs = jobs.filter((job) => {
        if (req.query.location && job.location) {
          if (job.location.toLowerCase() === req.query.location.toLowerCase()) {
            return true;
          }
          return false;
        }
        return true;
      });

      const page = req.query.page || 1;
      const limit = 10;

      const start = (page - 1) * limit;
      const end = start + limit;

      filteredJobs = filteredJobs.slice(start, end);

      return res.json(responseMsg(null, true, filteredJobs));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(responseMsg('No data found!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMsg('Something went wrong!'));
  }
};
