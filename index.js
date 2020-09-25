const puppeteer = require('puppeteer');


/*
https://www.codota.com/code/javascript/functions/puppeteer/Page/click
    <div style="text-align: center">
        <input id="submitSearchMob" type="submit" value="SEARCH" class="btn doSearch"/>
        <input type="reset" value="RESET" class="btn resetAll"/>
    </div>
</div>
                </div>

                    <div  id="forWeb" class="regionTime uppercase">
                        <select name="region" class="col-lg-12 chosen-select" tabindex="2"
                                data-placeholder="Select Choice"  disabled>
                            <option data-type="ALL" value="0" >All</option>
                        </select>
                    </div>
                    
                    
                    
                    

                <div class="regionTime uppercase">
                    
                    
                <select name="timeIntervalId" class="col-lg-11 chosen-select">
                    <optgroup
                            label="Data begins Jan, 2014 ">
                        <option value="0" >Custom Date</option>
                        
                            <option value="335" >YESTERDAY</option>
                        
                            <option value="334" >LAST 7 DAYS</option>
                        
                            <option value="333" >LAST 30 DAYS</option>
                        
                            <option value="332" >LAST 90 DAYS</option>
                        
                            <option value="331" >LAST 180 DAYS</option>
                        
                            <option value="330" selected="selected">LAST 365 DAYS</option>
                        
                    </optgroup>
                </select>
                    
                              
                              

                </div>

            </div>
        </div>

*/

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
