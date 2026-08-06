const assert = require('chai').assert;

import { test } from '../fixtures/lk-fixtures';
import { LOGIN_PAGE_URL_PATH, LOGIN_LOCATORS } from '../pages/login';
import { FORGOT_COMPLETE_URL, FORGOT_URL, REGISTER_PAGE_URL_PATH } from '../pages/register';
import { CREATE_COMPANY_PAGE_URL_PATH } from '../pages/create-company';
import { expect } from '@playwright/test';
import { User } from '../../common/models/user';
import { COMMON_CONSTANTS } from '../../common/constants/constants';
import { allure } from 'allure-playwright';
import { EFields } from '../../common/reporter/fields';
import { ESeverity } from '../../common/reporter/severity';
import { ESuite1 } from '../reporter/suite-1';
import { ESuite2 } from '../reporter/suite-2';

const redirectToRegisterPageFromLoginPage = 'Переход на страницу регистрации из авторизации';
const inputsPlaceholderAndLabelCheck = 'Проверка подсказок и заголовков у двух инпутов';
const loginWithInvalidPass = 'Попытка авторизации с неправильным паролем';
const loginWithNotRegisterEmail = 'Попытка авторизации по Email несуществующим юзером';
const loginWithValidCreds = 'Авторизация по Email существующим юзером';
const redirectToSbbidLogin = 'Переход на страницу авторизации по SBBID';
const twoEmptyRequiredFiledsValidation = 'Два пустых инпута и попытка входа по Email';
const passwordRecoveryPageLabelsCheck = 'Проверка текстов на странице с восстановлением пароля';
const passwordRecoveryEmailSendTrigger = 'Отправка письма с ссылкой на смену пароля';
const repeatedPasswordRecoveryEmailSendTrigger = 'Повторная отправка письма с ссылкой на смену пароля';

test.use({
  caseTitleToIdMap: {
    [redirectToRegisterPageFromLoginPage]: '9085',
    [inputsPlaceholderAndLabelCheck]: '9090',
    [loginWithInvalidPass]: '9075',
    [loginWithNotRegisterEmail]: '9080',
    [loginWithValidCreds]: '9074',
    [redirectToSbbidLogin]: '9097',
    [twoEmptyRequiredFiledsValidation]: '9076',
    [passwordRecoveryPageLabelsCheck]: '9073',
    [passwordRecoveryEmailSendTrigger]: '9094',
    [repeatedPasswordRecoveryEmailSendTrigger]: '9072',
  },
});

const invalidPassword = 'bug-password';
const unrealUsername = 'muzlab-qa@bug.ru';
const emailPlaceholder = 'example@zvuk.com';

test.describe('Набор тест-кейсов на страницу авторизации', () => {
  test(redirectToRegisterPageFromLoginPage, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_AUTH });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await baseLkPage.waitForText('Вход');
    await page.click(LOGIN_LOCATORS.REDIRECT_TO_REGISTER);
    await baseLkPage.waitForText('Регистрация');
    await expect(page).toHaveURL(REGISTER_PAGE_URL_PATH);
  });

  test(inputsPlaceholderAndLabelCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MINOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_AUTH });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await baseLkPage.waitForText('Электронная почта');
    await baseLkPage.waitForText('Пароль');
    await baseLkPage.checkPlaceholder(LOGIN_LOCATORS.EMAIL_INPUT, emailPlaceholder);
    await baseLkPage.checkPlaceholder(LOGIN_LOCATORS.PASSWORD_INPUT, 'Введите пароль...');
  });

  test(loginWithInvalidPass, async ({ page, baseLkPage, regularUser }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.NEGATIVE_AUTH });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.fill(LOGIN_LOCATORS.EMAIL_INPUT, regularUser.email);
    await page.fill(LOGIN_LOCATORS.PASSWORD_INPUT, invalidPassword);
    await page.click(LOGIN_LOCATORS.LOGIN_BUTTON);
    await baseLkPage.waitForText('Пожалуйста, введите правильные учетные данные');
  });

  test(loginWithNotRegisterEmail, async ({ page, baseLkPage, regularUser }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.NEGATIVE_AUTH });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.fill(LOGIN_LOCATORS.EMAIL_INPUT, unrealUsername);
    await page.fill(LOGIN_LOCATORS.PASSWORD_INPUT, regularUser.password);
    await page.click(LOGIN_LOCATORS.LOGIN_BUTTON);
    await baseLkPage.waitForText('Пожалуйста, введите правильные учетные данные');
  });

  test(loginWithValidCreds, async ({ page, baseLkPage, regularUser }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_AUTH });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.fill(LOGIN_LOCATORS.EMAIL_INPUT, regularUser.email);
    await page.fill(LOGIN_LOCATORS.PASSWORD_INPUT, regularUser.password);
    await page.click(LOGIN_LOCATORS.LOGIN_BUTTON);
    await expect(page).toHaveURL(CREATE_COMPANY_PAGE_URL_PATH);
    await baseLkPage.waitForText('Какой у вас бизнес?');
  });

  test.skip(redirectToSbbidLogin, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.SBBID });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.click(LOGIN_LOCATORS.BY_SBBID_BUTTON);
    await baseLkPage.waitForText('Вход в сервис СберЗвук Бизнес');
  });

  test(twoEmptyRequiredFiledsValidation, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.NORMAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.NEGATIVE_AUTH });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.click(LOGIN_LOCATORS.LOGIN_BUTTON);
    await baseLkPage.waitForText('Пожалуйста, введите правильные учетные данные');
  });

  test(passwordRecoveryPageLabelsCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MINOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.PASSWORD_CHANGE });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.click(LOGIN_LOCATORS.FORGOT_PASSWORD);
    await baseLkPage.waitForText('Восстановление пароля');
    await baseLkPage.waitForText('Укажите e-mail, который вы использовали при регистрации.');
    await baseLkPage.waitForText('На него мы вышлем ссылку для восстановления пароля.');
    await baseLkPage.waitForText('E-mail');
    await baseLkPage.waitForText('Получить ссылку');
    await baseLkPage.checkPlaceholder(LOGIN_LOCATORS.EMAIL_INPUT, emailPlaceholder);
    await page.click(LOGIN_LOCATORS.REDIRECT_TO_LOGIN);
    await expect(page).toHaveURL(LOGIN_PAGE_URL_PATH);
  });

  test(passwordRecoveryEmailSendTrigger, async ({ page, baseLkPage }) => {
    const randomUser = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, []);

    allure.label({ name: EFields.SEVERITY, value: ESeverity.NORMAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.PASSWORD_CHANGE });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.click(LOGIN_LOCATORS.FORGOT_PASSWORD);
    await page.fill(LOGIN_LOCATORS.EMAIL_INPUT, randomUser.email);
    await page.click(LOGIN_LOCATORS.NEW_PASSWORD_SENDING);
    await expect(page).toHaveURL(FORGOT_COMPLETE_URL);
    await baseLkPage.waitForText('Письмо отправлено');
    await page.click(LOGIN_LOCATORS.REDIRECT_TO_AUTHORIZATION);
    await expect(page).toHaveURL(LOGIN_PAGE_URL_PATH);
  });

  test(repeatedPasswordRecoveryEmailSendTrigger, async ({ page, baseLkPage }) => {
    const randomUser = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, []);
    const expectedEmail = randomUser.email;

    allure.label({ name: EFields.SEVERITY, value: ESeverity.NORMAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.PASSWORD_CHANGE });
    await page.goto(LOGIN_PAGE_URL_PATH);
    await page.click(LOGIN_LOCATORS.FORGOT_PASSWORD);
    await page.fill(LOGIN_LOCATORS.EMAIL_INPUT, expectedEmail);
    await page.click(LOGIN_LOCATORS.NEW_PASSWORD_SENDING);
    await expect(page).toHaveURL(FORGOT_COMPLETE_URL);
    await baseLkPage.waitForText('Письмо отправлено');
    await page.click(LOGIN_LOCATORS.REPEATED_PASSWORD_SENDING);
    await expect(page).toHaveURL(FORGOT_URL);
    await baseLkPage.waitForText('Восстановление пароля');
    const actualEmail = await page.inputValue(LOGIN_LOCATORS.EMAIL_INPUT);
    assert.equal(
      actualEmail,
      expectedEmail,
      `Ожидаемый емейл: ${expectedEmail} отличается от фактического: ${actualEmail}`
    );
  });
});
