import { Page, test, expect } from '@playwright/test';
import { BTLCalculator } from '../pages/btlCalculator';

let page: Page;
let btlCalculator: BTLCalculator;

test.describe('BTL Calculator', () => {
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    btlCalculator = new BTLCalculator(page);
    await page.goto('https://servicing.hsbc.co.uk/mortgages/btl-calculator/'); //add this to base url inside config
  });

  test('Verify all Front-End elements', async () => {
    await expect(btlCalculator.propertyValueInput).toBeVisible();
    await expect(btlCalculator.propertyValueInput).toBeEditable();
    await expect(btlCalculator.loanAmountInput).toBeVisible();
    await expect(btlCalculator.loanAmountInput).toBeEditable();
    await expect(btlCalculator.feeAmountInput).toBeVisible();
    await expect(btlCalculator.feeAmountInput).toBeEditable();
    await expect(btlCalculator.monthlyRentalIncomeInput).toBeVisible();
    await expect(btlCalculator.monthlyRentalIncomeInput).toBeEditable();
    await expect(btlCalculator.applicationTypeDropdown).toBeVisible();
    await expect(btlCalculator.applicationTypeDropdown).toBeEnabled();
    await expect(btlCalculator.productTypeDropdown).toBeVisible();
    await expect(btlCalculator.productTypeDropdown).toBeEnabled();
    await expect(btlCalculator.productRateInput).toBeVisible();
    await expect(btlCalculator.productRateInput).toBeEditable();
    await expect(btlCalculator.basicTaxRateDropdown).toBeVisible();
    await expect(btlCalculator.basicTaxRateDropdown).toBeEnabled();
    await expect(btlCalculator.loanToValueText).toBeVisible();
    await expect(btlCalculator.loanToValueText).toHaveText('--- %');
    await expect(btlCalculator.outcomeResultText).toBeVisible();
    await expect(btlCalculator.outcomeResultText).toHaveText(
      'Please ensure all fields are completed to generate a result',
    );
  });

  test('Complete form', async () => {
    await btlCalculator.completeForm({
      loanAmount: 25000,
      feeAmount: 5000,
      monthlyRentalIncome: 5000,
      productType: '2 year fixed rate',
      productRate: 50,
      taxRate: 'No',
    });
    await btlCalculator.page.pause();
    //add expects
  });

  /**
   * TODO:
   * Create function for completing form - done
   * Add extra scenarios - https://docs.google.com/spreadsheets/d/1ideOZT2xXa55bDPA8lF7fdHxG61ob8aet7GW1emh_p4/edit#gid=0
   * Create function that will figure out calculation for each condition --- TRICKY
   * Try to figure out all the criteria
   */
});
