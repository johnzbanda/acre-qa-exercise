import { Page, test, expect } from "@playwright/test";
import { BTLCalculator } from "../pages/btlCalculator";

let page: Page;
let btlCalculator: BTLCalculator;

test.describe("BTL Calculator", () => {
  test("Verify all Front-End elements", async ({ browser }) => {
    page = await browser.newPage();
    btlCalculator = new BTLCalculator(page);
    await page.goto("https://servicing.hsbc.co.uk/mortgages/btl-calculator/"); //add this to base url inside config
    await expect(btlCalculator.propertyValueInput).toBeVisible();
    await expect(btlCalculator.propertyValueInput).toBeEditable();
    await expect(btlCalculator.loanAmountInput).toBeVisible()
    await expect(btlCalculator.loanAmountInput).toBeEditable()
    await expect(btlCalculator.feeAmountInput).toBeVisible()
    await expect(btlCalculator.feeAmountInput).toBeEditable()
    await expect(btlCalculator.monthlyRentalIncomeInput).toBeVisible()
    await expect(btlCalculator.monthlyRentalIncomeInput).toBeEditable()
    await expect(btlCalculator.applicationTypeDropdown).toBeVisible()
    await expect(btlCalculator.applicationTypeDropdown).toBeEnabled()
    await expect(btlCalculator.productTypeDropdown).toBeVisible()
    await expect(btlCalculator.productTypeDropdown).toBeEnabled()
    await expect(btlCalculator.productRateInput).toBeVisible()
    await expect(btlCalculator.productRateInput).toBeEditable()
    await expect(btlCalculator.basicTaxRateDropdown).toBeVisible()
    await expect(btlCalculator.basicTaxRateDropdown).toBeEnabled()
    await expect(btlCalculator.loanToValueText).toBeVisible()
    await expect(btlCalculator.loanToValueText).toHaveText('--- %')
    await expect(btlCalculator.outcomeResultText).toBeVisible()
    await expect(btlCalculator.outcomeResultText).toHaveText('Please ensure all fields are completed to generate a result')
    await page.pause();
  });
});
