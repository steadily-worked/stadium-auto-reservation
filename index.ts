import { chromium, Frame, Page } from 'playwright'

require('dotenv').config()
const LOADING_DURATION = 1000;

async function autoReservation() {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const browser = await chromium.launch({
    devtools: process.env.NODE_ENV !== "production",
  })

  const page = await browser.newPage();
  await page.goto("https://yeyak.seoul.go.kr/web/loginForm.do", {
    waitUntil: "networkidle"
  })
  await loginHandler(page, username, password)
  await wait(LOADING_DURATION)
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

async function loginHandler(
  page: Page,
  username: string,
  password: string
): Promise<void> {
  const loginPageHandle = await page.waitForSelector('#sub_contents')
  const loginPageFrame = await loginPageHandle.contentFrame()

  const userNameInput = await loginPageFrame?.$('#userid');
  await userNameInput?.type(username)
  const passwordInput = await loginPageFrame?.$('#userpwd');
  await passwordInput?.type(password)

  const loginButton = await loginPageFrame?.$('.btn_login');
  await loginButton?.click();
}