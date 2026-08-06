const assert = require('chai').assert;
import { faker } from '@faker-js/faker';

import { test } from '../fixtures/lk-fixtures';
import { CREATE_COMPANY_LOCATORS, CREATE_COMPANY_PAGE_URL_PATH } from '../pages/create-company';
import { STREAMS_PARTIAL_URL } from '../pages/streams';
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { EFields } from '../../common/reporter/fields';
import { ESeverity } from '../../common/reporter/severity';
import { ESuite1 } from '../reporter/suite-1';
import { ESuite2 } from '../reporter/suite-2';
import { SETTINGS_LOCATORS } from '../pages/settings';
import { getOrganizationTypeName } from '../utils/organization-type-utils';
import { UserWithCompany } from '../../common/models/user-with-company';
import { getSuggestedCompany } from '../../common/utils/requests/organization-request-utils';
import { generateLkAutocompleteSuggestionCompanyPattern } from '../../common/utils/company-utils';
import { Company } from '../../common/models/company';

const organizationCreation = 'Создание компании';
const organizationCreationWithDuplicateInnCheck = 'Попытка создания компании с дублем по ИНН';
const organizationDataCheckAfterCreation = 'Проверка данных компании после создания';

test.use({
  caseTitleToIdMap: {
    [organizationCreation]: '12413',
    [organizationCreationWithDuplicateInnCheck]: '12414',
    [organizationDataCheckAfterCreation]: '19377',
  },
});

const someString = 'autotest';
const notAvailableInn = '7708117859';

type OrganizationFixtures = {
  /**
   * - [Вызывает фикстуру regularUser]
   * - Генерирует данные организации для прохождения онбординга ЛК
   * - Возвращает данные прошедшего регистрацию тестового пользователя и организации
   */
  organizationOnboarding: UserWithCompany;
};

const organizationTest = test.extend<OrganizationFixtures>({
  organizationOnboarding: async ({ regularUser, lkUserGrapqQLClient }, use) => {
    const getSuggestedCompanyResp = await getSuggestedCompany(
      lkUserGrapqQLClient,
      generateLkAutocompleteSuggestionCompanyPattern()
    );
    const firstSuggestedCompanyResult = getSuggestedCompanyResp.userPureSuggestionCompany.result[0];
    assert.isTrue(
      !!firstSuggestedCompanyResult && !!firstSuggestedCompanyResult.inn,
      'Suggested company result should not be empty'
    );
    const company = new Company(
      regularUser.email,
      firstSuggestedCompanyResult.inn,
      firstSuggestedCompanyResult.fullName,
      firstSuggestedCompanyResult.shortName,
      firstSuggestedCompanyResult.kpp,
      firstSuggestedCompanyResult.organizationType
    );
    company.setBusinessSphereId('4');

    const registeredUserWithCompany: UserWithCompany = {
      user: regularUser,
      organization: company,
    };
    await use(registeredUserWithCompany);
  },
});

organizationTest.describe('Набор тест-кейсов на страницу создания компании', () => {
  organizationTest.beforeEach(async ({ baseLkPage, regularUser }) => {
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.CREATE_COMPANY });
    baseLkPage.loginByEmail(regularUser.email, regularUser.password);
  });

  organizationTest(organizationCreation, async ({ page, baseLkPage, organizationOnboarding }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });

    await expect(page).toHaveURL(CREATE_COMPANY_PAGE_URL_PATH);

    await page.fill(CREATE_COMPANY_LOCATORS.ACTUAL_NAME, someString);
    await page.click(CREATE_COMPANY_LOCATORS.BUSINESS_TYPE_TEXT);
    await page.click(CREATE_COMPANY_LOCATORS.BUSINESS_BUTTON);
    await page.fill(CREATE_COMPANY_LOCATORS.ORGANIZATION_FORM, organizationOnboarding.organization.inn);
    await baseLkPage.waitForVisible(CREATE_COMPANY_LOCATORS.ORGANIZATION_DROPDOWN);
    await page.mouse.click(100, 100);
    await page.click(CREATE_COMPANY_LOCATORS.REDIRECT_TO_MAIL);
    await expect(page).toHaveURL(STREAMS_PARTIAL_URL);
  });

  organizationTest(organizationCreationWithDuplicateInnCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });

    await expect(page).toHaveURL(CREATE_COMPANY_PAGE_URL_PATH);

    await page.fill(CREATE_COMPANY_LOCATORS.ACTUAL_NAME, someString);
    await page.click(CREATE_COMPANY_LOCATORS.BUSINESS_TYPE_TEXT);
    await page.click(CREATE_COMPANY_LOCATORS.BUSINESS_BUTTON);
    await page.fill(CREATE_COMPANY_LOCATORS.ORGANIZATION_FORM, notAvailableInn);
    await baseLkPage.waitForVisible(CREATE_COMPANY_LOCATORS.ORGANIZATION_DROPDOWN);
    await page.mouse.click(100, 100);
    await page.click(CREATE_COMPANY_LOCATORS.REDIRECT_TO_MAIL);
    await baseLkPage.waitForText('Такая организация уже существует');
  });

  organizationTest(organizationDataCheckAfterCreation, async ({ page, baseLkPage, organizationOnboarding }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });

    const testCompanyName = faker.word.noun();

    await organizationTest.step('Ввести название компании', async () => {
      await page.fill(CREATE_COMPANY_LOCATORS.ACTUAL_NAME, testCompanyName);
    });

    await organizationTest.step('Выбрать сферу бизнеса', async () => {
      await page.click(CREATE_COMPANY_LOCATORS.BUSINESS_TYPE_TEXT);
    });

    await organizationTest.step('Нажать на кнопку продолжения создания компании', async () => {
      await page.click(CREATE_COMPANY_LOCATORS.BUSINESS_BUTTON);
    });

    await organizationTest.step('Ввести ИНН компании', async () => {
      await page.fill(CREATE_COMPANY_LOCATORS.ORGANIZATION_FORM, organizationOnboarding.organization.inn);
      await baseLkPage.waitForVisible(CREATE_COMPANY_LOCATORS.ORGANIZATION_DROPDOWN);
    });

    await organizationTest.step('Нажать на кнопку сохранения компании', async () => {
      await page.mouse.click(100, 100);
      await page.click(CREATE_COMPANY_LOCATORS.REDIRECT_TO_MAIL);
    });

    await organizationTest.step('Перейти в раздел "Настройки"', async () => {
      await page.click(SETTINGS_LOCATORS.SMART_MENU_SETTINGS_BUTTON);
    });

    const actualCompanyName = await page.inputValue(SETTINGS_LOCATORS.ORGANIZATION_NAME_INPUT);
    const actualCompanyShortName = await page.inputValue(SETTINGS_LOCATORS.ORGANIZATION_SHORT_NAME_INPUT);
    const actualCompanyType = await page.innerText(SETTINGS_LOCATORS.ORGANIZATION_TYPE_SPAN);
    const actualCompanyInn = await page.inputValue(SETTINGS_LOCATORS.ORGANIZATION_INN_INPUT);
    const actualCompanyKpp = await page.inputValue(SETTINGS_LOCATORS.ORGANIZATION_KPP_INPUT);

    await organizationTest.step('Название компании соответсвует введенному при создании', async () => {
      assert.equal(actualCompanyName, testCompanyName, 'Название компании не совпадает с введенным при создании');
    });

    await organizationTest.step('ЮЛ/ИП соответсвует выбранному при создании', async () => {
      assert.equal(
        actualCompanyShortName,
        organizationOnboarding.organization.organizationShortname,
        'ЮЛ/ИП не совпадает с выбранным при создании'
      );
    });

    await organizationTest.step('Тип организации соответсвует выбранному при создании', async () => {
      assert.equal(
        actualCompanyType,
        getOrganizationTypeName(organizationOnboarding.organization.organizationType),
        'Тип организации не совпадает с выбранным при создании'
      );
    });

    await organizationTest.step('ИНН соответсвует выбранному при создании', async () => {
      assert.equal(
        actualCompanyInn,
        organizationOnboarding.organization.inn,
        'ИНН не совпадает с выбранным при создании'
      );
    });

    await organizationTest.step('КПП соответсвует выбранному при создании', async () => {
      assert.equal(
        actualCompanyKpp,
        organizationOnboarding.organization.kpp,
        'КПП не совпадает с выбранным при создании'
      );
    });
  });
});
