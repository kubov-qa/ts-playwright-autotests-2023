const assert = require('chai').assert;

import { test } from '../fixtures/lk-fixtures';
import { LOGIN_LOCATORS, LOGIN_PAGE_URL_PATH } from '../pages/login';
import { REGISTER_PAGE_URL_PATH, REGISTER_LOCATORS } from '../pages/register';
import { CREATE_COMPANY_PAGE_URL_PATH, CREATE_COMPANY_LOCATORS } from '../pages/create-company';
import { expect } from '@playwright/test';
import { User } from '../../common/models/user';
import { COMMON_CONSTANTS } from '../../common/constants/constants';

test.describe('Demo Test1', () => {
  test('проверка подсказок и заголовков у двух инпутов', async ({ page, baseLkPage }) => {
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.click(LOGIN_LOCATORS.BY_EMAIL_BUTTON);
    await baseLkPage.waitForText('E-mail');
    await baseLkPage.waitForText('Пароль');
    await baseLkPage.checkPlaceholder(LOGIN_LOCATORS.USERNAME_INPUT, 'maria@best-cafe.ru');
    await baseLkPage.checkPlaceholder(LOGIN_LOCATORS.PASSWORD_INPUT, 'укажите пароль');
  });

  test('should test3', async ({ page, baseLkPage, regularUser }) => {
    await page.goto('/login');
    await page.click('id=button_expand');
    await page.fill('id=input_username', regularUser.email);
    await page.fill('id=input_password', regularUser.password);
    await page.click('id=button_login');
    await baseLkPage.pause(5000);
  });
  test('Повторная отправка письма с ссылкой на смену пароля', async ({ page, baseLkPage }) => {
    const randomUser = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, []);
    const ExpectedEmail = randomUser.email;

    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.click(LOGIN_LOCATORS.FORGOT_PASSWORD);
    await page.fill(REGISTER_LOCATORS.EMAIL_INPUT, ExpectedEmail);
    await page.click(LOGIN_LOCATORS.NEW_PASSWORD_SENDING);
    await expect(page).toHaveURL('/forgot-complete');
    await baseLkPage.waitForText('Письмо отправлено');
    await page.click(LOGIN_LOCATORS.LOGIN_BUTTON);
    await expect(page).toHaveURL('/forgot');
    await baseLkPage.waitForText('Восстановление пароля');
    const ActualEmail = await page.inputValue(REGISTER_LOCATORS.EMAIL_INPUT);
    assert.equal(ActualEmail, ExpectedEmail);
  });

  test('2 Повторная отправка письма с ссылкой на смену пароля', async ({ page, baseLkPage }) => {
    const randomUser = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, []);
    const randomEmail = randomUser.email;

    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.click(LOGIN_LOCATORS.FORGOT_PASSWORD);
    await page.fill(REGISTER_LOCATORS.EMAIL_INPUT, randomEmail);
    await page.click(LOGIN_LOCATORS.NEW_PASSWORD_SENDING);
    await expect(page).toHaveURL('/forgot-complete');
    await baseLkPage.waitForText('Письмо отправлено');
    await page.click(LOGIN_LOCATORS.LOGIN_BUTTON);
    await expect(page).toHaveURL('/forgot');
    await baseLkPage.waitForText('Восстановление пароля');
    await baseLkPage.pause(2000);
    const mailInInput = await page.innerText(REGISTER_LOCATORS.EMAIL_INPUT);
    assert.equal(mailInInput, randomEmail);
    await baseLkPage.pause(2000);
    await baseLkPage.waitForText('test-b2b-retention');
  });
  test('Создание компании', async ({ page, baseLkPage, regularUser, organization, organizationOnboarding }) => {
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.locator(LOGIN_LOCATORS.BY_EMAIL_BUTTON).click();
    await page.locator(LOGIN_LOCATORS.USERNAME_INPUT).fill(regularUser.email);
    await page.locator(LOGIN_LOCATORS.PASSWORD_INPUT).fill(regularUser.password);
    await page.locator(LOGIN_LOCATORS.LOGIN_BUTTON).click();
    await expect(page).toHaveURL(/.*create-company/);
    await baseLkPage.pause(1000);

    await page.fill(CREATE_COMPANY_LOCATORS.ORGANIZATION_FORM, organizationOnboarding.organization.inn);
    await baseLkPage.pause(1000);
    await page.locator(CREATE_COMPANY_LOCATORS.BUSINESS_TYPE).click();
    await baseLkPage.pause(1000);
    await page.locator('text="Бар"').click();
    await baseLkPage.pause(1000);
    await page.locator(CREATE_COMPANY_LOCATORS.ACTUAL_NAME).fill('autotest');
    await page.locator(CREATE_COMPANY_LOCATORS.REDIRECT_TO_LK).click();
    await expect(page).toHaveURL(/.*streams/);
    await baseLkPage.pause(2000);
  });
  test('Попытка создания компании с дублем по ИНН', async ({ page, baseLkPage, regularUser }) => {
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.locator(LOGIN_LOCATORS.BY_EMAIL_BUTTON).click();
    await page.locator(LOGIN_LOCATORS.USERNAME_INPUT).fill(regularUser.email);
    await page.locator(LOGIN_LOCATORS.PASSWORD_INPUT).fill(regularUser.password);
    await page.locator(LOGIN_LOCATORS.LOGIN_BUTTON).click();
    await expect(page).toHaveURL(/.*create-company/);
    await baseLkPage.pause(1000);

    await page.fill(CREATE_COMPANY_LOCATORS.ORGANIZATION_FORM, '7708117859');
    await baseLkPage.pause(1000);
    await page.locator(CREATE_COMPANY_LOCATORS.BUSINESS_TYPE).click();
    await baseLkPage.pause(1000);
    await page.locator('text="Бар"').click();
    await baseLkPage.pause(1000);
    await page.locator(CREATE_COMPANY_LOCATORS.ACTUAL_NAME).fill('autotest');
    await page.locator(CREATE_COMPANY_LOCATORS.REDIRECT_TO_LK).click();
    await baseLkPage.waitForText('Такая организация уже существует');
    await baseLkPage.pause(2000);
  });
});

('id=password_input_button_is_hidden'); // кнопка для скрытия пароля в инпуте
