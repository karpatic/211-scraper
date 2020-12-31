/*
 * https://stackoverflow.com/questions/48681145/set-pupeteer-window-size-when-running-not-headless-not-viewport

https://medium.com/@aslushnikov/automating-clicks-in-chromium-a50e7f01d3fb
* 
*/
const puppeteer = require('puppeteer');
var zipCodes = { 
  '21201':11175, 
  '21202':11176, 
  '21203':14550, 
  '21204':11177, 
  '21205':11178, 
  '21206':11179, 
  '21207':11180, 
  '21208':11181,
  '21209':11182, 
  '21210':11183, 
  '21211':11184, 
  '21212':11185, 
  '21213':11373, 
  '21214':11375, 
  '21215':11376, 
  '21216':11377,
  '21217':11378, 
  '21218':11379, 
  '21219':11380, 
  '21220':11381, 
  '21221':11382, 
  '21222':11383, 
  '21223':11384, 
  '21224':11385, 
  '21225':11386, 
  '21226':11387, 
  '21227':11388, 
  '21228':11389, 
  '21229':11390, 
  '21230':11391,
  '21231':11392, 
};
let nomatch = [ 
  '21232', 
  '14550', 
  '11177', 
  '11178', 
  '11178', 
  '11189'
]

var finalData = {};
(async () => {
  // Init url to scrape, load browser and page
  const browser = await puppeteer.launch({
    headless: false, // The browser is visible
    ignoreHTTPSErrors: true,
    args: [`--window-size=1200,1000`] // new option
  })
                            
  const page = await browser.newPage()
  await page.goto('https://md-dc.211counts.org/')
  await page.setViewport({ width: 1200, height: 1000 })
  await page.waitForSelector('#mainContent #identifierCategory')
  // Click Covid-19 Checkbox
  await page.click('#mainContent #identifierCategory') 
  await page.waitForSelector('#mainContent #displayCount')
  // Click Radio Button
  await page.click('#mainContent #displayCount')
  // Click to Expand the Timestamp Dropdown
  await page.mouse.move(713, 37);
  await page.mouse.down({button: 'left'});
  await page.mouse.up({button: 'left'});
  // Click from the dropdwn '30 Days'
  await page.mouse.move(688, 194);
  await page.mouse.down({button: 'left'});
  await page.mouse.up({button: 'left'}); 
  // Search for every zip code and add the result to an object
  for (var j = 0; j < Object.keys(zipCodes).length; j++) {
	var currentZipCode = Object.keys(zipCodes)[j]
	var zid = zipCodes[currentZipCode]	 
	console.log("CurZip: " + currentZipCode, ' ID: ', 'input[value="'+zid+'"]');  
	await page.evaluate((zc) => {	
	  // Prepare the zip code checkbox identifier to click on
	  let reset = 'input[value="RESET"]';
	  $(reset).click();
	  let zipCodeCheckBox = 'input[value="' + zc  + '"]';
	  $(zipCodeCheckBox).click();
	  // Get search button, click
      $("#submitSearch").click();
	}, zid);
	
	// And wait for the results to load
	await page.waitFor(1000);
	
	await page.screenshot({path: currentZipCode+'.png'});
	
	await page.evaluate((zc) => {
		// Click on count radio button 
		let countsBtn = document.getElementById('displayCount');
		countsBtn.click();
		// Prepare the zip code checkbox identifier to click on
		let zipCodeCheckBox = 'input[value="' + zc  + '"]';
		$(zipCodeCheckBox).click();
		// Get search button, click
		$("#submitSearch").click();
	}, currentZipCode);
	// And wait for the results to load
	await page.waitFor(1000);
	await page.screenshot({path: currentZipCode+'.png'});
		// Then we grab the results
	let result = await page.evaluate(async () => {
      // Get all categories div
	  let categories = document.querySelectorAll(".categories");
	  // Iterate through all categories and add their values to an object
	  let pointer = 0; 
	  let data = {}
	  while (pointer < categories.length) {
		// Now we have access to two categories
		let category = categories[pointer];
		// Making sure we have both a label and a value and category is not null
		if (category != null && category != undefined && category.children.length > 1) {
		  let label = ""; 
		  let value = "";
		  let percentage = "";
		  for (var i = 0; i < category.children.length; i++) {
			let node = category.children[i];
			// Make sure that the node is either a label or a paragraph, can't rely on indices alone
			if (node.nodeName.toLowerCase() === 'label') {
			  label = node.querySelector("span").innerText;
			}
			if (node.nodeName.toLowerCase() === 'p') {
			  value = node.querySelector("span").getAttribute("data-value");
			  percentage = node.querySelector("span").getAttribute("data-percentage");
		    }  
		  }
		  data[label + " Count"] = value;
		  data[label + " Percent"] = percentage;
		}
		pointer += 1;
	  }
	  return data;
	});
	// Now we add this zip code's result to the final answer
	finalData[currentZipCode.toString()] = result;
  }
  console.log(JSON.stringify(finalData));

  await page.waitFor(3000); 
  
  
  // await browser.close()
})() 
