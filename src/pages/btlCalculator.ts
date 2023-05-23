import { Page, Locator } from '@playwright/test';
//PAGE OBJECT MODEL
export class BTLCalculator {
  readonly page: Page;
  readonly propertyValueInput: Locator;
  readonly loanAmountInput: Locator;
  readonly feeAmountInput: Locator;
  readonly monthlyRentalIncomeInput: Locator;
  readonly applicationTypeDropdown: Locator;
  readonly productTypeDropdown: Locator;
  readonly productRateInput: Locator;
  readonly basicTaxRateDropdown: Locator;
  readonly loanToValueText: Locator;
  readonly outcomeResultText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.propertyValueInput = page.locator('#property-value-input');
    this.loanAmountInput = page.locator('#loan-amount-input');
    this.feeAmountInput = page.locator('#fee-amount-input');
    this.monthlyRentalIncomeInput = page.locator(
      '#monthly-rental-income-input',
    );
    this.applicationTypeDropdown = page.locator(
      '#likeByLikeRemortgage-dropdown',
    );
    this.productTypeDropdown = page.locator('#productType-dropdown');
    this.productRateInput = page.locator('#product-rate-input');
    this.basicTaxRateDropdown = page.locator('#taxRate-dropdown');
    this.loanToValueText = page.locator('#ltv-value');
    this.outcomeResultText = page.locator('#cal-outcome-value');
  }
}
