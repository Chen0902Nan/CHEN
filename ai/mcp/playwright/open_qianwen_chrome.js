const { chromium } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

;(async () => {
  let browser
  const candidates = [
    path.join(
      process.env['ProgramFiles'] || '',
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    ),
    path.join(
      process.env['ProgramFiles(x86)'] || '',
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    ),
    path.join(
      process.env['LOCALAPPDATA'] || '',
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    )
  ]
  let exe = candidates.find(p => p && fs.existsSync(p))
  if (exe) {
    browser = await chromium.launch({ executablePath: exe, headless: false })
  } else {
    try {
      browser = await chromium.launch({ channel: 'msedge', headless: false })
    } catch {
      browser = await chromium.launch({ headless: false })
    }
  }
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('https://www.qianwen.com/', { waitUntil: 'domcontentloaded' })

  let ok = false
  try {
    const input = page.locator('input, textarea').first()
    await input.waitFor({ timeout: 8000 })
    await input.click()
    await input.fill('你好')
    ok = true
  } catch {}

  if (!ok) {
    try {
      await page.keyboard.type('你好')
    } catch {}
  }

  await page.waitForTimeout(8000)
  await browser.close()
})()
