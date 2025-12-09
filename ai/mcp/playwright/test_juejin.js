const { chromium } = require('@playwright/test');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to https://juejin.cn/ ...');
  await page.goto('https://juejin.cn/');
  
  console.log('Clicking "插件"...');
  // Setup a promise that resolves if a new page is created
  const pagePromise = context.waitForEvent('page');
  
  // We use a specific selector if possible, but 'text=插件' is robust enough for this task
  await page.click('text=插件');
  
  // Wait a bit to see if a new page is spawned
  let targetPage = page;
  const newPage = await Promise.race([
      pagePromise,
      new Promise(resolve => setTimeout(() => resolve(null), 3000)) // timeout 3s
  ]);

  if (newPage) {
      console.log('New tab detected.');
      targetPage = newPage;
      await targetPage.waitForLoadState();
  } else {
      console.log('No new tab detected, assuming same tab navigation.');
      await page.waitForLoadState('networkidle');
  }

  console.log('Target page URL:', targetPage.url());

  console.log('Taking screenshot...');
  await targetPage.screenshot({ path: 'juejin_plugins.png' });
  
  console.log('Checking content...');
  const title = await targetPage.title();
  console.log('Page title:', title);
  
  const content = await targetPage.content();
  if (content.includes('插件')) {
    console.log('SUCCESS: Page contains "插件"');
  } else {
    console.log('FAILURE: Page does not contain "插件"');
  }
  
  await browser.close();
})();
