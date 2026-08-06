import { test } from '../../fixtures/lk-fixtures';
import { ADCAMPAIGN_LOCATORS } from '../../pages/adcampaign';
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { EFields } from '../../../common/reporter/fields';
import { ESeverity } from '../../../common/reporter/severity';
import { ESuite1 } from '../../reporter/suite-1';
import { ESuite2 } from '../../reporter/suite-2';
import { ESuite3 } from '../../reporter/suite-3';
import { SMART_LK_EXACT_TIME_TITLE, SMART_LK_INTERVAL_TITLE } from '../../../common/constants/adcampaign-constants';

const adcampaignIntervalValueEditing = 'Выставление значения интервала выхода РК сохраняется';
const adcampaignExactTimeValueEditing = 'Выставление времени выхода ролика РК с точным временем сохраняется';

test.use({
  caseTitleToIdMap: {
    [adcampaignIntervalValueEditing]: '6380',
    [adcampaignExactTimeValueEditing]: '6382',
  },
});

test.describe('Набор тест-кейсов редактирования настроек рекламной кампании', () => {
  test.beforeEach(async ({ baseLkPage, onboardedUser }) => {
    baseLkPage.loginByEmail(onboardedUser.user.email, onboardedUser.user.password);
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.AD_PAGE });
    allure.label({ name: EFields.SUITE3, value: ESuite3.AD_SETTINGS });
  });

  test(adcampaignIntervalValueEditing, async ({ page, baseLkPage, adcampaignInterval }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });

    const newIntervalValue = '45';

    await test.step('Перейти в раздел реклама', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.NAVBAR_BUTTON);
    });

    await test.step('Нажать на тестовую РК', async () => {
      await page.getByText(adcampaignInterval.title).click();

      await test.step('Дровер тестовой РК открыт на странице', async () => {
        await expect(page.locator(ADCAMPAIGN_LOCATORS.DROWER_TITLE)).toHaveText(adcampaignInterval.title);
      });
    });

    await test.step('Перейти к выбору типа РК', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.TYPE_SELECTOR_FOR_INTERVAL_AD);
    });

    await test.step('Выбрать интервальный тип РК', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.TYPE_SELECTOR_INTERVAL_VALUE);
    });

    await test.step(`Установить значение интервала ${newIntervalValue}`, async () => {
      await page.fill(ADCAMPAIGN_LOCATORS.MODE_VALUE_INPUT, newIntervalValue);
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

      await test.step('Значение интервала совпадает с указанным', async () => {
        await expect(page.locator(ADCAMPAIGN_LOCATORS.MODE_VALUE_INPUT)).toHaveValue(newIntervalValue);
      });

      await test.step('Настройки содержат интервальный тип РК', async () => {
        await baseLkPage.waitForText(SMART_LK_INTERVAL_TITLE);
      });
    });
  });

  test(adcampaignExactTimeValueEditing, async ({ page, baseLkPage, adcampaignInterval }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });

    const newPromoTime = '18:15';
    const promoTitle = adcampaignInterval.promos[0].title;
    const promoTimeInput = `id=${ADCAMPAIGN_LOCATORS.PROMO_TIME_INPUT_ID_PREFIX}${promoTitle}`;

    await test.step('Перейти в раздел реклама', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.NAVBAR_BUTTON);
    });

    await test.step('Нажать на тестовую РК', async () => {
      await page.getByText(adcampaignInterval.title).click();

      await test.step('Дровер тестовой РК открыт на странице', async () => {
        await expect(page.locator(ADCAMPAIGN_LOCATORS.DROWER_TITLE)).toHaveText(adcampaignInterval.title);
      });
    });

    await test.step('Перейти к выбору типа РК', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.TYPE_SELECTOR_FOR_INTERVAL_AD);
    });

    await test.step('Выбрать тип РК проигрывания в указанное время', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.TYPE_SELECTOR_EXACT_TIME_VALUE);
    });

    await test.step(`Установить время выхода ролика ${newPromoTime}`, async () => {
      await page.fill(promoTimeInput, newPromoTime);
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

      await test.step('Время выхода ролика совпадает с указанным', async () => {
        await expect(page.locator(promoTimeInput)).toHaveValue(newPromoTime);
      });

      await test.step('Настройки содержат тип РК проигрывания в указанное время', async () => {
        await baseLkPage.waitForText(SMART_LK_EXACT_TIME_TITLE);
      });
    });
  });
});
