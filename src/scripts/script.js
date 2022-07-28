/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const redisClient = require('../config/redisConfig');

(async () => {
  const jobs = [];
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // eslint-disable-next-line no-plusplus
  for (let pageNo = 1; pageNo <= 10; pageNo++) {
    await page.goto(`https://www.naukri.com/nodejs-jobs-${pageNo}`);

    // eslint-disable-next-line no-loop-func
    const data = await page.evaluate(() => {
      const list = [];
      // eslint-disable-next-line no-undef
      const items = document.querySelectorAll('article');

      if (items.length > 0) {
        items.forEach((item) => {
          list.push({
            jobTitle: item.querySelector('.jobTuple .title').innerHTML.trim(),
            company: item.querySelector('.jobTuple .subTitle').innerHTML.trim(),
            location: item.querySelector('.jobTuple .location .ellipsis').innerHTML.trim(),
            experience: item.querySelector('.jobTuple .experience .ellipsis').innerHTML.trim(),
            salary: item.querySelector('.jobTuple .salary .ellipsis').innerHTML.trim(),
            postedAt: item.querySelector('.jobTuple .jobTupleFooter .fw500').innerHTML.trim()
          });
        });
      }

      return list;
    });

    if (data.length <= 0) {
      break;
    }
    jobs.concat(data);
  }
  await browser.close();

  await redisClient.connect();

  await redisClient.set(
    'newJobs',
    JSON.stringify(jobs),
    'EX',
    86400, // 24hours
    (err) => (err ? console.error(err) : console.info('Data stored in redis!'))
  );
})();
