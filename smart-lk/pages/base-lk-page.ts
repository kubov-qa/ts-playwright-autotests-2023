import { Page } from '@playwright/test';
import { BasePage } from '../../common/pages/base-page';
import { LOGIN_LOCATORS, LOGIN_PAGE_URL_PATH } from './login';

//Base page with custom methods for smart-lk app
export class BaseLkPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async loginByEmail(email: string, password: string) {
    await this.page.goto(LOGIN_PAGE_URL_PATH);
    await this.page.click(LOGIN_LOCATORS.EMAIL_INPUT);
    await this.page.fill(LOGIN_LOCATORS.EMAIL_INPUT, email);
    await this.page.click(LOGIN_LOCATORS.PASSWORD_INPUT);
    await this.page.fill(LOGIN_LOCATORS.PASSWORD_INPUT, password);
    await this.page.click(LOGIN_LOCATORS.LOGIN_BUTTON);
  }
}
