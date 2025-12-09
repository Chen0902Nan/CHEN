const { chromium } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

function resolveDefaultBrowserProfile () {
  const userProfile = process.env.USERPROFILE || process.env.HOME || ''
  const candidates = [
    {
      channel: 'msedge',
      dir: path.join(
        userProfile,
        'AppData',
        'Local',
        'Microsoft',
        'Edge',
        'User Data'
      )
    },
    {
      channel: 'chrome',
      dir: path.join(
        userProfile,
        'AppData',
        'Local',
        'Google',
        'Chrome',
        'User Data'
      )
    }
  ]
  for (const c of candidates) {
    try {
      if (fs.existsSync(c.dir)) return c
    } catch {}
  }
  return { channel: undefined, dir: path.join(process.cwd(), '.pw-user-data') }
}

async function launchContext () {
  const profile = resolveDefaultBrowserProfile()
  try {
    const ctx = await chromium.launchPersistentContext(profile.dir, {
      channel: profile.channel,
      headless: false
    })
    return { context: ctx, browser: null }
  } catch {}
  const channels = [profile.channel, 'msedge', 'chrome'].filter(Boolean)
  for (const ch of channels) {
    try {
      const browser = await chromium.launch({ channel: ch, headless: false })
      const context = await browser.newContext()
      return { context, browser }
    } catch {}
  }
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  return { context, browser }
}

function parseFans (text) {
  const patterns = [
    /粉丝\s*[:：]?\s*([0-9]+(?:\.[0-9]+)?)(万|w|W|K|k)?/,
    /粉丝数\s*[:：]?\s*([0-9]+(?:\.[0-9]+)?)(万|w|W|K|k)?/,
    /关注我的\s*[:：]?\s*([0-9]+(?:\.[0-9]+)?)(万|w|W|K|k)?/
  ]
  for (const re of patterns) {
    const m = text.match(re)
    if (m) {
      let n = parseFloat(m[1])
      const unit = (m[2] || '').toLowerCase()
      if (unit === '万' || unit === 'w') n *= 10000
      if (unit === 'k') n *= 1000
      return String(Math.round(n))
    }
  }
  return null
}

;(async () => {
  const { context, browser } = await launchContext()
  const page = await context.newPage()

  await page.goto('https://juejin.cn/')

  const pagePromise = context.waitForEvent('page')
  await page.click('text=创作者中心')

  let targetPage = page
  const maybeNew = await Promise.race([
    pagePromise,
    new Promise(resolve => setTimeout(() => resolve(null), 5000))
  ])
  if (maybeNew) {
    targetPage = maybeNew
    await targetPage.waitForLoadState('load')
  } else {
    await page.waitForLoadState('networkidle')
  }

  await targetPage.waitForTimeout(1000)

  const needsLogin = (await targetPage.locator('text=/登录|注册/').count()) > 0
  if (needsLogin) {
    await targetPage.waitForTimeout(60000)
    try {
      await targetPage.click('text=创作者中心', { timeout: 3000 })
      await targetPage.waitForLoadState('load')
    } catch {}
  }

  let fansOutput = '粉丝数不可用'
  try {
    const label = await targetPage.locator('text=粉丝').first()
    if (await label.count()) {
      const container = label.locator('xpath=..')
      const txt = await container.innerText()
      const parsed = parseFans(txt)
      if (parsed) fansOutput = parsed
    }
    if (fansOutput === '粉丝数不可用') {
      const bodyText = await targetPage.evaluate(() => document.body.innerText)
      const parsed = parseFans(bodyText)
      if (parsed) fansOutput = parsed
    }
  } catch {}

  console.log(fansOutput)

  if (browser) {
    await browser.close()
  } else {
    await context.close()
  }
})()
