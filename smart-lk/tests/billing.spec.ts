import { test } from '../fixtures/lk-fixtures';
import { BILLING_LOCATORS } from '../pages/billing';
import { allure } from 'allure-playwright';
import { EFields } from '../../common/reporter/fields';
import { ESeverity } from '../../common/reporter/severity';
import { ESuite1 } from '../reporter/suite-1';
import { EBehavior } from '../../common/reporter/behavior';
import { EOWNERS } from '../../common/reporter/owners';
import { POINTS_ALL_PAGE_URL } from '../pages/points';

const redirectToYookassaPageFromBillingPageForOnePoint = 'Переход на страницу Юкассы из раздела Оплаты с одной точкой вещания';
const redirectToPointCreationFromBillingPage = 'Переход на страницу создания адреса из раздела Оплаты';

test.use({
  caseTitleToIdMap: {
    [redirectToYookassaPageFromBillingPageForOnePoint]: '25930',
    [redirectToPointCreationFromBillingPage]: '31282',
  },
});

test.describe('Набор тестов на страницу Оплаты', () => {
  test.beforeEach(async ({ baseLkPage, onboardedUser }) => {
    baseLkPage.loginByEmail(onboardedUser.user.email, onboardedUser.user.password);
  });

  test.skip(redirectToYookassaPageFromBillingPageForOnePoint, async ({ page, baseLkPage, point }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.BILLING });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    const yoomoneyRegexp = /https:\/\/yoomoney.ru\/checkout\/.*/;

    const cardBindButtonText = 'Подключить и привязать карту';

    await test.step('Перейти в раздел оплата', async () => {
      await page.click(BILLING_LOCATORS.MENU_BUTTON);

      await test.step(`Отображается элемент с текстом: ${cardBindButtonText}`, async () => {
        await baseLkPage.waitForText(cardBindButtonText);  
      });
    });

    await test.step('Нажать на кнопку добавления карты', async () => {
      await page.click(BILLING_LOCATORS.MODIFY_SUBSCRIPTION_WITH_ONLY_BIND_CARD_BUTTON);

      await test.step('Переход на сайт юкассы и сравнение URL', async () => {
        await page.waitForURL(yoomoneyRegexp);
      });
    });
  });

  test(redirectToPointCreationFromBillingPage, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.BILLING });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KOROLKOVA);

    const pointsPageEmptyStateText = 'Добавьте свой первый адрес, чтобы запустить на нём музыку';

    await test.step('Перейти в раздел оплата', async () => {
      await page.click(BILLING_LOCATORS.MENU_BUTTON);
      await page.mouse.click(500, 500);//Перемещаем курсор для скрытия меню
    });

    await test.step('Нажать на кнопку создания адреса', async () => {
      await page.click(BILLING_LOCATORS.CREATE_FIRST_ADRESS_BUTTON);

      await test.step('Переход на страницу Адресов', async () => {
        await page.waitForURL(POINTS_ALL_PAGE_URL);
      });

      await test.step(`Отображается текст: ${pointsPageEmptyStateText}`, async () => {
        await baseLkPage.waitForText(pointsPageEmptyStateText);  
      });
    });
  });
});
