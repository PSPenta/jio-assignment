const puppeteer = require('puppeteer');
const redisClient = require('../config/redisConfig');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://remoteok.io/remote-javascript-jobs');

  const data = await page.evaluate(() => {
    const list = [];
    // eslint-disable-next-line no-undef
    const items = document.querySelectorAll('tr.job');

    let count = 0;
    items.forEach((item) => {
      if (count > 200) {
        return;
      }
      list.push({
        jobTitle: item.querySelector('.company h2').innerHTML.trim(),
        company: item.querySelector('.company h3').innerHTML.trim(),
        // location: item.querySelector('.jobTuple .location .ellipsis').innerHTML.trim(),
        // experience: item.querySelector('.jobTuple .experience .ellipsis').innerHTML.trim(),
        // salary: item.querySelector('.jobTuple .salary .ellipsis').innerHTML.trim(),
        postedAt: item.querySelector('.time time').innerHTML.trim()
      });
      // eslint-disable-next-line no-plusplus
      count++;
    });

    return list;
  });

  await redisClient.connect();

  await redisClient.set(
    'newJobs',
    JSON.stringify(data),
    'EX',
    86400, // 24hours
    (err) => (err ? console.error(err) : console.info('Data stored in redis!'))
  );
  await browser.close();
  process.exit();
})();
