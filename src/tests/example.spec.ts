import { Page, test } from '@playwright/test'

let page: Page;

test.describe('Example', () => {
    test('Testing my shit', async ( {browser}) => {
        page = await browser.newPage()
        await page.goto('https://www.google.com')
        await page.pause()
    })
})