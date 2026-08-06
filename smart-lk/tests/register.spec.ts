const assert = require('chai').assert;

import { test } from '../fixtures/lk-fixtures';
import { REGISTER_PAGE_URL_PATH, REGISTER_LOCATORS, OFERTA_URL, CONF_URL } from '../pages/register';
import { CREATE_COMPANY_PAGE_URL_PATH } from '../pages/create-company';
import { expect } from '@playwright/test';
import { User } from '../../common/models/user';
import { COMMON_CONSTANTS } from '../../common/constants/constants';
import { LOGIN_PAGE_URL_PATH } from '../pages/login';
import { allure } from 'allure-playwright';
import { EFields } from '../../common/reporter/fields';
import { ESeverity } from '../../common/reporter/severity';
import { ESuite1 } from '../reporter/suite-1';
import { ESuite2 } from '../reporter/suite-2';
import { getValidatedLkAuthCode } from '../../common/utils/auth-utils';
import { EPhoneMask } from '../../common/models/phone-mask';
import { EBehavior } from '../../common/reporter/behavior';
import { EOWNERS } from '../../common/reporter/owners';
import { ORGANIZATIONS_LOCATORS } from '../../react-admin/pages/organizations';
import { elementInFilterSubstringSearch } from '../../react-admin/utils/locator-utils';
import { FILTERS_LOCATORS } from '../../react-admin/pages/filters';
import { getOrganisationContractTypeByPhone } from '../../common/utils/company-utils';

const registerLabelsCheck = 'Проверка наличия текста';
const registerPhonePlaceholderCheck = 'Проверка текста подсказки в инпуте номера телефона';
const ofertaTabCheck = 'Проверка вкладки с офертой';
const pravicyTabCheck = 'Проверка вкладки с конфиденциальности';
const redirectToRegisterBySbbid = 'Переход на страницу регистрации по SBBID';
const redirectToLoginPageAndLabelsCheck = 'Переход на страницу авторизации с проверкой текстов';
const registrationByPhoneOfAlreadyRegisteredByEmailUser =
  'Попытка регистрации по смс на номер регнутого юзера (регнут через почту)';
const registrationByPhone = 'Регистрация нового пользователя по смс';
const registrationByPhoneOfAlreadyRegisteredByPhoneUser =
  'Попытка регистрации по смс на номер регнутого юзера (регнут через номер)';
const utmRegistrattionWithPhone =
  'Организации пользователя назначен тариф, соответствующий utm-метке (регистрация по телефону)';

test.use({
  caseTitleToIdMap: {
    [registerLabelsCheck]: '9086',
    [registerPhonePlaceholderCheck]: '9087',
    [ofertaTabCheck]: '9093',
    [pravicyTabCheck]: '9083',
    [redirectToRegisterBySbbid]: '9081',
    [redirectToLoginPageAndLabelsCheck]: '9095',
    [registrationByPhoneOfAlreadyRegisteredByEmailUser]: '9088',
    [registrationByPhone]: '9082',
    [registrationByPhoneOfAlreadyRegisteredByPhoneUser]: '27487',
    [utmRegistrattionWithPhone]: '27260',
  },
});

test.describe('Набор тест-кейсов на страницу регистрации', () => {
  test(registerLabelsCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MINOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_REG });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    await page.goto(REGISTER_PAGE_URL_PATH);
    await baseLkPage.waitForText('Регистрация');
    await baseLkPage.waitForText('Уже есть аккаунт?');
    await baseLkPage.waitForText('Войти');
    await baseLkPage.waitForText('СберБизнес ID');
    await baseLkPage.waitForText('Номер телефона');
    await baseLkPage.waitForText('Зарегистрироваться с помощью');
    await baseLkPage.waitForText('Продолжить');
  });
  test(registerPhonePlaceholderCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MINOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_REG });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    await page.goto(REGISTER_PAGE_URL_PATH);
    await baseLkPage.checkPlaceholder(REGISTER_LOCATORS.TEL_INPUT, '+7 999 000 00 00');
  });
  test(ofertaTabCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MINOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_REG });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    const randomUser = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, [], EPhoneMask.RU);

    await page.goto(REGISTER_PAGE_URL_PATH);
    await page.click(REGISTER_LOCATORS.TEL_INPUT);
    await page.fill(REGISTER_LOCATORS.TEL_INPUT, randomUser.phone);
    await page.click(REGISTER_LOCATORS.PHONE_SUBMIT_BUTTON);
    await page.click(REGISTER_LOCATORS.REDIRECT_TO_OFERTA);

    const ofertaPage = await baseLkPage.getSecondPage();
    const oferta = ofertaPage.url();
    assert.include(oferta, OFERTA_URL, 'В эндпоинте отсутствует /oferta');
  });
  test(pravicyTabCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MINOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_REG });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    const randomUser = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, [], EPhoneMask.RU);

    await page.goto(REGISTER_PAGE_URL_PATH);
    await page.click(REGISTER_LOCATORS.TEL_INPUT);
    await page.fill(REGISTER_LOCATORS.TEL_INPUT, randomUser.phone);
    await page.click(REGISTER_LOCATORS.PHONE_SUBMIT_BUTTON);
    await page.click(REGISTER_LOCATORS.REDIRECT_TO_CONFIDENTIAL);

    const confPage = await baseLkPage.getSecondPage();
    const conf = confPage.url();
    assert.include(conf, CONF_URL, 'В эндпоинте отсутствует /conf');
  });
  test.skip(redirectToRegisterBySbbid, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.NORMAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.SBBID });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    await page.goto(REGISTER_PAGE_URL_PATH);
    await page.click(REGISTER_LOCATORS.BY_SBBID_BUTTON);
    await baseLkPage.waitForText('Регистрация через СберБизнес ID');
    await page.click(REGISTER_LOCATORS.SBBID_MODAL_BUTTON);
    await baseLkPage.waitForText('Вход в сервис СберЗвук Бизнес'); //заменить на юрл
  });
  test(redirectToLoginPageAndLabelsCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MINOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_AUTH });
    await page.goto(REGISTER_PAGE_URL_PATH);
    await page.click(REGISTER_LOCATORS.REDIRECT_TO_LOGIN);
    await baseLkPage.waitForText('Вход');
    await baseLkPage.waitForText('СберБизнес ID');
    await baseLkPage.waitForText('Забыли пароль?');
    await baseLkPage.waitForText('Еще нет аккаунта?');
    await baseLkPage.waitForText('Зарегистрироваться');
    await expect(page).toHaveURL(LOGIN_PAGE_URL_PATH);
  });
  test(registrationByPhoneOfAlreadyRegisteredByEmailUser, async ({ page, baseLkPage, regularUserRuPhone }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_REG });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    const clientNumber = regularUserRuPhone.phone;
    await page.goto(REGISTER_PAGE_URL_PATH);
    await page.click(REGISTER_LOCATORS.TEL_INPUT);
    await page.fill(REGISTER_LOCATORS.TEL_INPUT, clientNumber);
    await page.click(REGISTER_LOCATORS.PHONE_SUBMIT_BUTTON);

    await baseLkPage.waitForText(
      'У вас уже есть аккаунт. Используйте электронную почту и пароль, чтобы войти в свой личный кабинет'
    );
  });

  test(registrationByPhone, async ({ page, baseLkPage, graphQLBackendApiUrl }) => {
    const randomUser = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, [], EPhoneMask.RU);

    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_REG });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    await page.goto(REGISTER_PAGE_URL_PATH);
    await page.click(REGISTER_LOCATORS.TEL_INPUT);
    await page.fill(REGISTER_LOCATORS.TEL_INPUT, randomUser.phone);
    await page.click(REGISTER_LOCATORS.PHONE_SUBMIT_BUTTON);
    await baseLkPage.pause(3000);
    const smsCode = await getValidatedLkAuthCode(randomUser.phone, graphQLBackendApiUrl);
    await page.click(REGISTER_LOCATORS.SMS_INPUT);
    await page.fill(REGISTER_LOCATORS.SMS_INPUT, smsCode);
    await page.click(REGISTER_LOCATORS.SMS_SUBMIT_BUTTON);

    await expect(page).toHaveURL(CREATE_COMPANY_PAGE_URL_PATH);
    await baseLkPage.waitForText('Какой у вас бизнес?');
  });

  test(registrationByPhoneOfAlreadyRegisteredByPhoneUser, async ({ page, baseLkPage, registeredByRuPhoneUser }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_REG });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    const clientNumber = registeredByRuPhoneUser.phone;
    await page.goto(REGISTER_PAGE_URL_PATH);
    await page.click(REGISTER_LOCATORS.TEL_INPUT);
    await page.fill(REGISTER_LOCATORS.TEL_INPUT, clientNumber);
    await page.click(REGISTER_LOCATORS.PHONE_SUBMIT_BUTTON);
    await baseLkPage.waitForText(
      'У вас уже есть аккаунт. Введите код из SMS-сообщения, чтобы войти в свой личный кабинет'
    );
  });
  test(utmRegistrattionWithPhone, async ({ page, baseLkPage, graphQLBackendApiUrl, adminUserGrapqQLClient }) => {
    const randomUser = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, [], EPhoneMask.RU);

    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.REGISTRATION_AUTHORISATION });
    allure.label({ name: EFields.SUITE2, value: ESuite2.POSITIVE_REG });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KAYP);

    const registerPageWithRAOutm = REGISTER_PAGE_URL_PATH + '?tariff=popular';
    const expectedPricePlan = 'Популярная музыка';

    await test.step('Открыть страницу регистрации с utm-меткой РАО в url', async () => {
      await page.goto(registerPageWithRAOutm);
    });
    await test.step('Кликнуть на инпут ввода телефона', async () => {
      await page.click(REGISTER_LOCATORS.TEL_INPUT);
    });
    await test.step('Ввести номер телефона тестового пользователя', async () => {
      await page.fill(REGISTER_LOCATORS.TEL_INPUT, randomUser.phone);
    });
    await test.step('Нажать на кнопку Продолжить', async () => {
      await page.click(REGISTER_LOCATORS.PHONE_SUBMIT_BUTTON);
    });

    //Получаем сгенерированный для пользователя смс-код
    await baseLkPage.pause(3000);
    const smsCode = await getValidatedLkAuthCode(randomUser.phone, graphQLBackendApiUrl);

    await test.step('Ввести смс-код в инпут кода', async () => {
      await page.click(REGISTER_LOCATORS.SMS_INPUT);
      await page.fill(REGISTER_LOCATORS.SMS_INPUT, smsCode);
    });
    await test.step('Подтвердить ввод смс-кода', async () => {
      await page.click(REGISTER_LOCATORS.SMS_SUBMIT_BUTTON);
      await baseLkPage.waitForText('Какой у вас бизнес?');
    });

    await test.step('Проверить, что тарифный план зарегистрированной организации совпадает с планом utm-метки', async () => {
      const testOrgPricePlan = await getOrganisationContractTypeByPhone(randomUser.phone, adminUserGrapqQLClient);
      assert.isTrue(
        testOrgPricePlan == expectedPricePlan,
        `Ожидаемый тарифный план организации - ${expectedPricePlan}, полученный тарифный план - ${testOrgPricePlan}`
      );
    });
  });
});
