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

  async completeForm(value?: {
    propertyValue?: number;
    loanAmount?: number;
    feeAmount?: number;
    monthlyRentalIncome?: number;
    applicationType?: string;
    productType?: string;
    productRate?: number;
    taxRate?: string;
  }) {
    if (value?.propertyValue) {
      await this.propertyValueInput.fill(value?.propertyValue.toString() || '');
    }
    if (value?.loanAmount) {
      await this.loanAmountInput.fill(value?.loanAmount.toString() || '');
    }
    if (value?.feeAmount) {
      await this.feeAmountInput.fill(value?.feeAmount.toString() || '');
    }
    if (value?.monthlyRentalIncome) {
      await this.monthlyRentalIncomeInput.fill(
        value?.monthlyRentalIncome.toString() || '',
      );
    }
    if (value?.applicationType) {
      await this.applicationTypeDropdown.selectOption(
        value?.applicationType as string,
      );
    }
    if (value?.productType) {
      await this.productTypeDropdown.selectOption(value?.productType as string);
    }
    if (value?.productRate) {
      await this.productRateInput.fill(value?.productRate.toString() || '');
    }
    if (value?.taxRate) {
      await this.basicTaxRateDropdown.selectOption(value?.taxRate as string);
    }
  }
}
