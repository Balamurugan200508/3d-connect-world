const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', channel: 'chrome' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log("Navigating to http://localhost:3000/portfolio...");
  await page.goto('http://localhost:3000/portfolio', { waitUntil: 'networkidle0' });
  
  console.log("Page loaded. Looking for START button...");
  const startBtn = await page.$('.button-start');
  if (startBtn) {
    console.log("START button found! Clicking it...");
    await startBtn.click();
    console.log("Clicked! Waiting 5 seconds to observe...");
    await new Promise(r => setTimeout(r, 5000));
    
    // Check if the body has class 'started'
    const hasStarted = await page.evaluate(() => document.body.classList.contains('started'));
    console.log(`Body has 'started' class: ${hasStarted}`);
    
    // Check if the preloader is hidden
    const isPreloaderHidden = await page.evaluate(() => {
      const preloader = document.getElementById('preloader');
      return window.getComputedStyle(preloader).display === 'none' || preloader.classList.contains('end');
    });
    console.log(`Preloader is hidden or ended: ${isPreloaderHidden}`);
  } else {
    console.log("START button NOT found.");
  }
  
  await browser.close();
  console.log("Done.");
})();
