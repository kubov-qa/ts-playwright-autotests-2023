import { test } from '../../fixtures/lk-fixtures';
import { ADCAMPAIGN_LOCATORS } from '../../pages/adcampaign';
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { EFields } from '../../../common/reporter/fields';
import { ESeverity } from '../../../common/reporter/severity';
import { ESuite1 } from '../../reporter/suite-1';
import { ESuite2 } from '../../reporter/suite-2';
import { ESuite3 } from '../../reporter/suite-3';
import { EOWNERS } from '../../../common/reporter/owners';

const pointIsAddedToAdcampaign = 'Включение адреса РК сохраняется';

test.use({
  createAdcampaignWithPoint: false,
  caseTitleToIdMap: {
    [pointIsAddedToAdcampaign]: '6383',
  },
});

test.describe('Набор тест-кейсов редактирования точек вещания рекламной кампании', () => {
  test.beforeEach(async ({ baseLkPage, onboardedUser }) => {
    baseLkPage.loginByEmail(onboardedUser.user.email, onboardedUser.user.password);
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.AD_PAGE });
    allure.label({ name: EFields.SUITE3, value: ESuite3.AD_POINTS });
  });

  test(pointIsAddedToAdcampaign, async ({ page, baseLkPage, adcampaignInterval, point }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
    allure.owner(EOWNERS.KOROLKOVA);

    const pointThumbSwitch = `id=${ADCAMPAIGN_LOCATORS.POINT_THUMB_SWITCH_ID_PREFIX}${point.address}`;
    const pointCounter = `id=${ADCAMPAIGN_LOCATORS.POINT_COUNTER_ID_PREFIX}${adcampaignInterval.title}`;

    await test.step('Перейти в раздел реклама', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.NAVBAR_BUTTON);
    });

    await test.step('Нажать на тестовую РК', async () => {
      await page.getByText(adcampaignInterval.title).click();

      await test.step('Дровер тестовой РК открыт на странице', async () => {
        await expect(page.locator(ADCAMPAIGN_LOCATORS.DROWER_TITLE)).toHaveText(adcampaignInterval.title);
      });
    });

    await test.step('Перейти в настройки Адресов РК', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.POINTS_TAB);

      await test.step('Доступная точка вещания отображается в дровере', async () => {
        await baseLkPage.waitForText(point.address);
      });

      await test.step('Тумблер точки вещания в выключенном состоянии', async () => {
        await baseLkPage.checkAttribute(pointThumbSwitch, 'data-checked', 'false');
      });

      await test.step('Значение счетчика Точек Вещания у РК равно 0', async () => {
        await expect(page.locator(pointCounter)).toHaveText('0');
      });
    });

    await test.step('Переключить тумблер с адресом в ВКЛ состояние', async () => {
      await page.click(pointThumbSwitch);
    });

    await test.step('Нажать на кнопку "Сохранить"', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.SETTINGS_SAVE_BUTTON);

      await test.step('Появление модального окна с подтверждением сохранения настроек', async () => {
        await baseLkPage.waitForText('Сохранить настройки рекламной кампании');
      });
    });

    await test.step('Подтвердить сохранение настроек', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.SETTINGS_SAVE_CONFIRM_BUTTON);

      await test.step('Появление сообщения с информацией об успешном сохранении настроек РК', async () => {
        await baseLkPage.waitForText('Изменения сохранены');
      });

      await test.step('Тумблер точки вещания во включенном состоянии', async () => {
        await baseLkPage.checkAttribute(pointThumbSwitch, 'data-checked', 'true');
      });

      await test.step('Значение счетчика Точек Вещания у РК равно 1', async () => {
        await expect(page.locator(pointCounter)).toHaveText('1');
      });
    });
  });
});
