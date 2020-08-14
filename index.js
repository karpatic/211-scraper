const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://md-dc.211counts.org/', { 
	'timeout': 10000, 
	'waitUntil':'networkidle2'
  });
  await page.waitFor(10000) 
  await page.screenshot({path: 'exampl.png'});

  await browser.close();
})();
