const assert = require('chai').assert;

import { test } from '../fixtures/lk-fixtures';
import { POINTS_LOCATORS } from '../pages/points';
import { STREAMS_PARTIAL_URL, STREAMS_LOCATORS } from '../pages/streams';
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { EFields } from '../../common/reporter/fields';
import { ESeverity } from '../../common/reporter/severity';
import { ESuite1 } from '../reporter/suite-1';
import { ESuite2 } from '../reporter/suite-2';
import { EBehavior } from '../../common/reporter/behavior';
import { EOWNERS } from '../../common/reporter/owners';
import { CONSTANTS } from '../constants/constants';
import { elementWithText } from '../../common/utils/locator-utils';

const pointCreationAndStatusCheck = 'Создание адреса и проверка статуса вещания';
const pointCreationAndStreamChoiceButtonCheck = 'Создание адреса и переход в библиотеку';
const twoPointCreationAndOnePointRemoving = 'Создание двух адресов и удаление последнего';
const pointCreationAndBindedWebPlayerCodeCheck = 'Создание адреса и просмотр кода привязанного web-плеера';
const pointCreationFromStreamPage = 'Создание адреса вещания из раздела с волнами';
const alreadyBindedCodeValidationDuringPointBinding =
  'Попытка привязки плеера на точку вещания с использованием занятого кода привязки';
const invalidBindingCodeValidationDuringPointBinding =
  'Попытка привязки плеера на точку вещания с использованием невалидного кода привязки';
const streamChangeFromPointSettings = 'Смена волны через раздел настроек у точки вещания';
const streamChangeFromPointSettingsWithAdditionButton =
  'Смена волны через раздел настроек у точки вещания (дополнительная кнопка)';

test.use({
  caseTitleToIdMap: {
    [pointCreationAndStatusCheck]: '13381',
    [pointCreationAndStreamChoiceButtonCheck]: '13380',
    [twoPointCreationAndOnePointRemoving]: '13379',
    [pointCreationAndBindedWebPlayerCodeCheck]: '24405',
    [pointCreationFromStreamPage]: '25328',
    [alreadyBindedCodeValidationDuringPointBinding]: '25327',
    [invalidBindingCodeValidationDuringPointBinding]: '25326',
    [streamChangeFromPointSettings]: '25325',
    [streamChangeFromPointSettingsWithAdditionButton]: '25324',
  },
});

const adressName = 'Москва';
const adressName2 = 'плейврайт тест';
const noWaveStatus = 'Нет волны';
const partialStreamsUrl = 'streams/all';
const notValidCode = 'bugs';

test.describe('Набор тест-кейсов на страницу создания адресов вещания', () => {
  test.beforeEach(async ({ baseLkPage, onboardedUser }) => {
    baseLkPage.loginByEmail(onboardedUser.user.email, onboardedUser.user.password);
  });

  test(pointCreationAndStatusCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });

    await expect(page).toHaveURL(STREAMS_PARTIAL_URL);

    await page.click(POINTS_LOCATORS.POINT_NAVBAR_BUTTON);
    await page.click(POINTS_LOCATORS.ADD_POINT);
    await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName);
    await page.mouse.click(100, 100);
    await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);
    await baseLkPage.waitForText(noWaveStatus);
  });

  test(pointCreationAndStreamChoiceButtonCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });

    await page.click(POINTS_LOCATORS.POINT_NAVBAR_BUTTON);
    await page.click(POINTS_LOCATORS.ADD_POINT);
    await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName);
    await page.mouse.click(100, 100);
    await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);
    await page.click(POINTS_LOCATORS.ADD_STREAM_BUTTON);
    await expect(page).toHaveURL(partialStreamsUrl);
  });

  test(twoPointCreationAndOnePointRemoving, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });

    await page.click(POINTS_LOCATORS.POINT_NAVBAR_BUTTON);
    await page.click(POINTS_LOCATORS.ADD_POINT);
    await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName);
    await page.mouse.click(100, 100);
    await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);
    await page.click(POINTS_LOCATORS.ADD_POINT);
    await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName2);
    await page.mouse.click(100, 100);
    await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);
    await baseLkPage.waitForText(adressName2);
    await page.click(POINTS_LOCATORS.DRAWER_BUTTON);
    await page.click(POINTS_LOCATORS.MENU_DELETE_POINT);
    await baseLkPage.waitForText('Удалить адрес вещания?');
    await page.click(POINTS_LOCATORS.DELETE_POINT_MODAL_BUTTON);
    await baseLkPage.waitForText('Адрес удалён');
    await baseLkPage.waitForInvisible(adressName2);
  });

  test(pointCreationAndBindedWebPlayerCodeCheck, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KOROLKOVA);

    await test.step('Перейти в раздел "Адреса"', async () => {
      await page.click(POINTS_LOCATORS.POINT_NAVBAR_BUTTON);
    });

    await test.step('Нажать на кнопку добавления адреса', async () => {
      await page.click(POINTS_LOCATORS.ADD_POINT);
    });

    await test.step('Заполнить название адреса', async () => {
      await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName);
      await page.mouse.click(100, 100);
    });

    await test.step('Добавить адрес', async () => {
      await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);

      await test.step('Отображается дровер созданного адреса', async () => {
        await baseLkPage.waitForVisible(POINTS_LOCATORS.DRAWER_TITLE);
        const actualDrawerTitle = await page.innerText(POINTS_LOCATORS.DRAWER_TITLE);
        assert.equal(actualDrawerTitle, adressName);
      });

      await test.step(`В дровере отображается тип плеера - ${CONSTANTS.PLAYER_TYPE_WEB}`, async () => {
        await baseLkPage.waitForVisible(POINTS_LOCATORS.DRAWER_PLAYER_TYPE_TITLE);
        const actualPlayerType = await page.innerText(POINTS_LOCATORS.DRAWER_PLAYER_TYPE_TITLE);
        assert.equal(actualPlayerType, CONSTANTS.PLAYER_TYPE_WEB);
      });

      await test.step('В дровере отображается 4-х значный код привязанного плеера', async () => {
        await baseLkPage.waitForVisible(POINTS_LOCATORS.DRAWER_PLAYER_CODE);
        const actualPlayerBindingCode = await page.innerText(POINTS_LOCATORS.DRAWER_PLAYER_CODE);
        assert.match(actualPlayerBindingCode, CONSTANTS.PLAYER_BINDING_CODE_PATTERN);
      });
    });
  });

  test(pointCreationFromStreamPage, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    await expect(page).toHaveURL(STREAMS_PARTIAL_URL);
    await page.click(STREAMS_LOCATORS.WAVE_SELECT);
    await page.click(STREAMS_LOCATORS.STREAM_START_BUTTON);
    await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName2);
    await page.mouse.click(100, 100);
    await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);
    await baseLkPage.waitForText('Волна запущена');
  });

  test(
    alreadyBindedCodeValidationDuringPointBinding,
    async ({ page, baseLkPage, point, pointWithBindedAndroidDevice }) => {
      allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
      allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
      allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });
      allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
      allure.owner(EOWNERS.KUBOV);

      await expect(page).toHaveURL(STREAMS_PARTIAL_URL);
      await page.click(POINTS_LOCATORS.POINT_NAVBAR_BUTTON);
      await page.click(`${POINTS_LOCATORS.POINT_OPEN_DRAWER_PREFIX}${point.pointId}`);
      await page.click(POINTS_LOCATORS.DEVICE_CHANGE);
      await page.fill(POINTS_LOCATORS.DEVICE_CHANGE_INPUT, pointWithBindedAndroidDevice.device.code);
      await page.click(POINTS_LOCATORS.DEVICE_CHANGE_BUTTON);
      await baseLkPage.waitForText('Изменить плеер?');
      await page.click(POINTS_LOCATORS.DEVICE_CHANGE_CONFIRM);
      await baseLkPage.waitForText('Этот плеер уже привязан к другому адресу');
    }
  );

  test(invalidBindingCodeValidationDuringPointBinding, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.MAJOR });
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    await expect(page).toHaveURL(STREAMS_PARTIAL_URL);
    await page.click(POINTS_LOCATORS.POINT_NAVBAR_BUTTON);
    await page.click(POINTS_LOCATORS.ADD_POINT);
    await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName);
    await page.mouse.click(100, 100);
    await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);
    await page.click(POINTS_LOCATORS.DEVICE_CHANGE);
    await page.fill(POINTS_LOCATORS.DEVICE_CHANGE_INPUT, notValidCode);
    await page.click(POINTS_LOCATORS.DEVICE_CHANGE_BUTTON);
    await baseLkPage.waitForText('Изменить плеер?');
    await page.click(POINTS_LOCATORS.DEVICE_CHANGE_CONFIRM);
    await baseLkPage.waitForText('Плеер не найден. Возможно, код указан неверно');
  });

  test(streamChangeFromPointSettings, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    await expect(page).toHaveURL(STREAMS_PARTIAL_URL);
    await page.click(STREAMS_LOCATORS.WAVE_SELECT);
    await page.click(STREAMS_LOCATORS.STREAM_START_BUTTON);
    await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName2);
    await page.mouse.click(100, 100);
    await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);
    await baseLkPage.waitForText('Волна запущена');
    await page.click(STREAMS_LOCATORS.STREAM_MODAL_CLOSE);
    await page.click(POINTS_LOCATORS.POINT_NAVBAR_BUTTON);
    await page.click(elementWithText(adressName2));
    await page.click(POINTS_LOCATORS.CHANGE_WAVE);
    await page.click(STREAMS_LOCATORS.STREAM_START_BUTTON);
    await page.click(STREAMS_LOCATORS.MODAL_STREAM_START_BUTTON);
    await baseLkPage.waitForText('Волна запущена');
  });

  test(streamChangeFromPointSettingsWithAdditionButton, async ({ page, baseLkPage }) => {
    allure.label({ name: EFields.SEVERITY, value: ESeverity.CRITICAL });
    allure.label({ name: EFields.SUITE1, value: ESuite1.LK });
    allure.label({ name: EFields.SUITE2, value: ESuite2.ADDRESS_PAGE });
    allure.label({ name: EFields.BEHAVIOR, value: EBehavior.POSITIVE });
    allure.owner(EOWNERS.KUBOV);

    await expect(page).toHaveURL(STREAMS_PARTIAL_URL);
    await page.click(STREAMS_LOCATORS.WAVE_SELECT);
    await page.click(STREAMS_LOCATORS.STREAM_START_BUTTON);
    await page.fill(POINTS_LOCATORS.MODAL_INPUT, adressName2);
    await page.mouse.click(100, 100);
    await page.click(POINTS_LOCATORS.POINT_CREATE_BUTTON);
    await baseLkPage.waitForText('Волна запущена');
    await page.click(STREAMS_LOCATORS.STREAM_MODAL_CLOSE);
    await page.click(POINTS_LOCATORS.POINT_NAVBAR_BUTTON);
    await page.click(elementWithText(adressName2));
    await page.click(POINTS_LOCATORS.DRAWER_BUTTON);
    await page.click(POINTS_LOCATORS.CHANGE_WAVE);
    await page.click(STREAMS_LOCATORS.WAVE_SELECT);
    await page.click(STREAMS_LOCATORS.STREAM_START_BUTTON);
    await page.click(STREAMS_LOCATORS.MODAL_STREAM_START_BUTTON);
    await baseLkPage.waitForText('Волна запущена');
  });
});

/*
TO DO: 
1) запрет на удаление оплаченной точки вещания 
2) запрет на создание точек вещания при работе по счету
3) добавление плеера на адрес вещания
4) замена плеера обратно на вебплеер
*/
