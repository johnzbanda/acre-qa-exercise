import { Page, test, expect } from '@playwright/test';
import { BTLCalculator } from '../pages/btlCalculator';
import { ApplicationTypes } from '../pages/populator/applicationTypes';
import { Outcomes } from '../pages/populator/outcomes';
import { ProductTypes } from '../pages/populator/productTypes';
import { TaxRates } from '../pages/populator/taxRates';

//https://docs.google.com/spreadsheets/d/1ideOZT2xXa55bDPA8lF7fdHxG61ob8aet7GW1emh_p4/edit#gid=0 - Decision Table
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

  test('Rental income criteria met', async () => {
    const propertyValue = 75000;
    const loanAmount = 25000;
    await btlCalculator.completeForm({
      propertyValue: propertyValue,
      loanAmount: loanAmount,
      feeAmount: 5000,
      monthlyRentalIncome: 5000,
      applicationType: ApplicationTypes.additionalBorrowing,
      productType: ProductTypes.twoYearFixed,
      productRate: 50,
      taxRate: 'No',
    });
    await assertLoanToValue(propertyValue, loanAmount);
    await expect(btlCalculator.outcomeResultText).toHaveText(
      Outcomes.rentalIncomeMet,
    );
  });

  test('Loan amount criteria not met', async () => {
    const propertyValue = 100000;
    const loanAmount = 2500;
    await btlCalculator.completeForm({
      propertyValue: propertyValue,
      loanAmount: loanAmount,
      feeAmount: 5000,
      monthlyRentalIncome: 5000,
      applicationType: ApplicationTypes.additionalBorrowing,
      productType: ProductTypes.twoYearFixed,
      productRate: 50,
      taxRate: TaxRates.no,
    });
    await assertLoanToValue(propertyValue, loanAmount);
    await expect(btlCalculator.outcomeResultText).toHaveText(
      Outcomes.loanAmountNotMet,
    );
  });

  test('Incorrect values', async () => {
    const invalidValue = [1000000000, 10000];
    await btlCalculator.completeForm({
      propertyValue: invalidValue[0],
      loanAmount: invalidValue[0],
      feeAmount: invalidValue[1],
      monthlyRentalIncome: invalidValue[0],
      productRate: invalidValue[1],
    });
    await expect(btlCalculator.loanToValueText).toHaveText('--- %');
    await expect(btlCalculator.outcomeResultText).toHaveText(
      'Please ensure all fields are completed to generate a result',
    );
    await expect(
      btlCalculator.page.locator('#property-value-error-message'),
    ).toBeVisible();
    await expect(
      btlCalculator.page.locator('#loan-amount-error-message'),
    ).toBeVisible();
    await expect(
      btlCalculator.page.locator('#monthly-rental-income-error-message'),
    ).toBeVisible();
    await expect(
      btlCalculator.page.getByText('Enter a value between GBP 0 and GBP 9999'),
    ).toBeVisible();
    await expect(
      btlCalculator.page.getByText('Enter a value between 0.00 and 50.00'),
    ).toBeVisible();
  });

  test('Rental income criteria not shown', async () => {
    const propertyValue = 1000000;
    const loanAmount = 500000;
    await btlCalculator.completeForm({
      propertyValue: propertyValue,
      loanAmount: loanAmount,
      feeAmount: 1500,
      monthlyRentalIncome: 2400,
      applicationType: ApplicationTypes.remortgageNoBorrowing,
      productType: ProductTypes.fiveYearFixed,
      productRate: 10,
      taxRate: TaxRates.yes,
    });
    await assertLoanToValue(propertyValue, loanAmount);
    await expect(btlCalculator.outcomeResultText).toContainText(
      Outcomes.rentalIncomeNotMet,
    );
  });

  test('Property value not met', async () => {
    await btlCalculator.completeForm({
      propertyValue: 1000,
      loanAmount: 500000,
      feeAmount: 5000,
      monthlyRentalIncome: 1000,
      applicationType: ApplicationTypes.porting,
      productType: ProductTypes.twoYearTracker,
      productRate: 20,
      taxRate: TaxRates.yes,
    });
    await expect(btlCalculator.outcomeResultText).toContainText(
      Outcomes.propertyValueNotMet,
    );
  });

  test('Loan to value not met', async () => {
    const propertyValue = 250000;
    const loanAmount = 500000;
    await btlCalculator.completeForm({
      propertyValue: propertyValue,
      loanAmount: loanAmount,
      feeAmount: 5000,
      monthlyRentalIncome: 1000,
      applicationType: ApplicationTypes.unencumbered,
      productType: ProductTypes.tenYearFixed,
      productRate: 20,
      taxRate: TaxRates.no,
    });
    await assertLoanToValue(propertyValue, loanAmount);
    await expect(btlCalculator.outcomeResultText).toContainText(
      Outcomes.loanToValueNotMet,
    );
  });

  test('Maximum loan amount shown', async () => {
    //all you need to do here is assert that the text can be seen, do not worry about the calculation for maximum loan amount for now
    const propertyValue = 1000;
    const loanAmount = 500000;
    await btlCalculator.completeForm({
      propertyValue: propertyValue,
      loanAmount: loanAmount,
      feeAmount: 5000,
      monthlyRentalIncome: 1000,
      applicationType: ApplicationTypes.porting,
      productType: ProductTypes.twoYearFixed,
      productRate: 50,
      taxRate: TaxRates.yes,
    });
    await expect(btlCalculator.outcomeResultText).toContainText(
      Outcomes.maximumLoanAmount,
    );
  });

  test('Check you can click all the dropdown options', async () => {
    for (const applicationType of Object.values(ApplicationTypes)) {
      await btlCalculator.completeForm({applicationType: applicationType})
      await expect(await btlCalculator.applicationTypeDropdown.innerText()).toMatch(applicationType)
    }

    for (const product of Object.values(ProductTypes)) {
      await btlCalculator.completeForm({productType: product})
      await expect(await btlCalculator.productTypeDropdown.innerText()).toMatch(product)
    }

    for (const taxRate of Object.values(TaxRates)) {
      await btlCalculator.completeForm({taxRate: taxRate})
      await expect(await btlCalculator.basicTaxRateDropdown.innerText()).toMatch(taxRate)
    }
  })
});

async function assertLoanToValue(propertyValue: number, loanAmount: number) {
  const loanToValue = await btlCalculator.calculateLoanToValue(
    propertyValue,
    loanAmount,
  );
  return await expect(btlCalculator.loanToValueText).toHaveText(loanToValue);
}
