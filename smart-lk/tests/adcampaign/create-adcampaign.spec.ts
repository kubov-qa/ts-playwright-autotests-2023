import { test } from '../../fixtures/lk-fixtures';
import { ADCAMPAIGN_LOCATORS } from '../../pages/adcampaign';
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { EFields } from '../../../common/reporter/fields';
import { ESeverity } from '../../../common/reporter/severity';
import { ESuite1 } from '../../reporter/suite-1';
import { ESuite2 } from '../../reporter/suite-2';
import { ESuite3 } from '../../reporter/suite-3';
import { getTestMediafilePath, TEST_MEDIAFILE_NAME } from '../../../common/utils/upload-utils';

const adcampaignWithMp3PromoIsCreated =
  'Рекламная кампании с роликом в формате .mp3 создается и отображается на странице';

test.use({
  caseTitleToIdMap: {
    [adcampaignWithMp3PromoIsCreated]: '6365',
  },
});

const adcampaignTitle = 'Тест РК e2e';

test.describe('Набор тест-кейсов создания рекламной кампании', () => {
  test.beforeEach(async ({ baseLkPage, onboardedUser }) => {
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.AD_PAGE });
    allure.label({ name: EFields.SUITE3, value: ESuite3.AD_CREATION });
    baseLkPage.loginByEmail(onboardedUser.user.email, onboardedUser.user.password);
  });

  test(adcampaignWithMp3PromoIsCreated, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });

    await test.step('Перейти в раздел реклама', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.NAVBAR_BUTTON);
    });

    await test.step('Нажать на кнопку "Создать рекламную кампанию"', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.ADD_BUTTON);
    });

    await test.step('Загрузить ролик в формате .mp3', async () => {
      await page.locator(ADCAMPAIGN_LOCATORS.FILE_INPUT).setInputFiles(getTestMediafilePath());
    });

    await test.step('Ввести название РК', async () => {
      await page.fill(ADCAMPAIGN_LOCATORS.TITLE_INPUT, adcampaignTitle);
    });

    await test.step('Нажать на кнопку "Создать"', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.ADD_MODAL_BUTTON);

      await test.step('Появление сообщения с информацией об успешном создании РК', async () => {
        await baseLkPage.waitForText('Рекламная кампания создана');
      });

      await test.step('Созданная РК отображается на странице с указанным названием', async () => {
        await expect(page.locator(ADCAMPAIGN_LOCATORS.DROWER_TITLE)).toHaveText(adcampaignTitle);
      });
    });

    await test.step('Для созданной РК перейти во вкладку "Ролики"', async () => {
      await page.click(ADCAMPAIGN_LOCATORS.PROMOS_TAB);

      await test.step('Список роликов содержит загруженный при создании проморолик', async () => {
        await baseLkPage.waitForText(TEST_MEDIAFILE_NAME);
      });
    });
  });
});
