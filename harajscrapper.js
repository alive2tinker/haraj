const { assert } = require('console');
const puppeteer = require('puppeteer');

async function scrape(){
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({Referer: 'https://beta.haraj.com.sa'});
  var availableMakes = [
    "تويوتا",
    "نيسان",
    "فورد",
    "لكزس",
    "شيفروليه",
    "مرسيدس",
    "جي%20ام%20سي",
    "بي%20ام%20دبليو",
    "دودج",
    "همر",
    "كاديلاك",
    "اودي",
    "هوندا",
    "لاند%20روفر",
    "فولكس%20واجن",
    "مازدا",
    "ميتسوبيشي",
    "هونداي",
    "جيب",
    "انفنيتي",
    "سوزوكي",
    "كيا",
    "كرايزلر",
    "بورش"
];
  var makeNumber = Math.floor(Math.random() * 23);
  await page.goto('https://beta.haraj.com.sa/tags/'+availableMakes[makeNumber]);
  //await page.waitForSelector('div#root > div.wrapper > div.tagWrapper > div.tagMain > div.postlist > div.post > div.postInfo > div.postTitle > a');
  await page.waitForSelector('button#more');

  var numberOfPages;
  var products = [];
  
  for(numberOfPages = 0; numberOfPages <= 100; numberOfPages++){
    console.log(numberOfPages);
    const titles = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('div#root > div.wrapper > div.tagWrapper > div.tagMain > div.postlist > div.post > div.postInfo > div.postTitle > a'))
      return titles.map(title => title.text).slice(0, 10)
    });

    const locations = await page.evaluate(() => {
      const locations = Array.from(document.querySelectorAll('div#root > div.wrapper > div.tagWrapper > div.tagMain > div.postlist > div.post > div.postInfo > div.postExtraInfo >  div.postExtraInfoPart:first-child > a'))
      return locations.map(location => location.text).slice(0, 10)
    });

    for(var x = 0; x < titles.length; x++){
      products.push({title: titles[x], location: locations[x]})
    }

  }
  var stringify = require('csv-stringify');
  var assert = require('assert');
  const fs = require('fs');
 
  await stringify(products, {
    header: true,
    columns: [ { key: 'title', header: 'title' }, { key: 'location', header: 'location' } ]
  }, function(err, output){
    assert(output, '1,2\n');
    fs.appendFile("output.csv", output, (err) => {
      if (err) throw err;
      console.log("success");
    });
  });
  await browser.close();
}

try{
  scrape();
}catch(error){
  console.log(error);
}

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}


