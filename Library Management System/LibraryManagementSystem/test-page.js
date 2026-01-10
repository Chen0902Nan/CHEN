// 测试页面状态的脚本
const puppeteer = require('puppeteer');

async function testPage() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // 设置视口大小
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    // 访问登录页面
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    console.log('成功访问登录页面');
    
    // 登录
    await page.type('#login-username', 'admin');
    await page.type('#login-password', 'admin123');
    await page.click('button[type="submit"]');
    
    // 等待登录完成
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('登录成功，当前URL:', page.url());
    
    // 检查页面内容
    const pageContent = await page.content();
    console.log('页面内容长度:', pageContent.length);
    
    // 检查是否有错误
    const errors = await page.evaluate(() => {
      return console.error.calls.map(call => call.args.join(' '));
    });
    
    if (errors.length > 0) {
      console.log('页面错误:', errors);
    } else {
      console.log('页面没有错误');
    }
    
    // 截图
    await page.screenshot({ path: 'page-screenshot.png' });
    console.log('已截图保存为 page-screenshot.png');
    
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    await browser.close();
  }
}

testPage();
