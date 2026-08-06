import { GraphQLClient } from 'graphql-request';
import { User } from '../../common/models/user';
import {
  removeUserByEmail,
  smartLkRegisterUser,
  getSmartLkAuthToken,
  getAuthUserData,
  getAuthAllowedActionsForPhone,
  authCodeCreate,
  smartLkRegisterByPhoneUser,
  removeUserByPhone,
} from '../../common/utils/requests/user-request-utils';
import { updateCompanyByOnboarding } from '../../common/utils/requests/organization-request-utils';
import { COMMON_CONSTANTS } from '../../common/constants/constants';
import { Company } from '../../common/models/company';
import { BaseLkPage } from '../pages/base-lk-page';
import { generateUtmMarks } from '../../common/utils/user-utils';
import { getSmartLkGrpaphQLApiUrl } from '../../common/utils/stage-utils';
import { UserWithCompany } from '../../common/models/user-with-company';
import { EPhoneMask } from '../../common/models/phone-mask';
import { LkFixtures } from './lk-fixtures-type';
import { test as baseTest } from '../../common/fixtures/fixtures';
import { getValidatedLkAuthCode } from '../../common/utils/auth-utils';

const assert = require('chai').assert;

export const test = baseTest.extend<LkFixtures>({
  baseLkPage: async ({ page }, use) => {
    const basePage = new BaseLkPage(page);
    await use(basePage);
  },
  regularUser: async ({ graphQLBackendApiUrl }, use) => {
    const user = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, []);
    const registerUserResp = await smartLkRegisterUser(user, generateUtmMarks(), graphQLBackendApiUrl);
    await use(user);
    const removeUserResp = await removeUserByEmail(user.email, graphQLBackendApiUrl);
  },

  graphQLSmartLkApiUrl: async ({}, use) => {
    const url = getSmartLkGrpaphQLApiUrl();
    await use(url);
  },

  lkUserGrapqQLClient: async ({ regularUser, graphQLSmartLkApiUrl }, use) => {
    const getAuthTokenResp = await getSmartLkAuthToken(regularUser.email, regularUser.password, graphQLSmartLkApiUrl);
    const authToken = getAuthTokenResp.auth.token.value;
    assert.isTrue(!!authToken, 'Auth Token should not be empty');
    const graphQLClient = new GraphQLClient(graphQLSmartLkApiUrl, {
      headers: {
        'authorization': 'JWT ' + authToken,
      },
    });
    await use(graphQLClient);
  },

  onboardedUser: async ({ regularUser, lkUserGrapqQLClient }, use) => {
    let company = new Company(regularUser.email);
    const getAuthUserDataResp = await getAuthUserData(lkUserGrapqQLClient);
    assert.isTrue(
      !!getAuthUserDataResp.currentUserPureQuery.companies[0] &&
        !!getAuthUserDataResp.currentUserPureQuery.companies[0].id,
      'Company id should not be empty'
    );
    const companyId = getAuthUserDataResp.currentUserPureQuery.companies[0].id;
    company.setCompanyId(companyId);

    await updateCompanyByOnboarding(company, 'Тест1', '4', lkUserGrapqQLClient);

    const onboardedUser: UserWithCompany = {
      user: regularUser,
      organization: company,
    };
    await use(onboardedUser);
  },

  regularUserRuPhone: async ({ graphQLBackendApiUrl }, use) => {
    const user = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, [], EPhoneMask.RU);
    await smartLkRegisterUser(user, generateUtmMarks(), graphQLBackendApiUrl);
    await use(user);
    await removeUserByEmail(user.email, graphQLBackendApiUrl);
  },

  regularUserByPhone: async ({ graphQLBackendApiUrl }, use) => {
    const user = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, [], EPhoneMask.BY);
    await smartLkRegisterUser(user, generateUtmMarks(), graphQLBackendApiUrl);
    await use(user);
    await removeUserByEmail(user.email, graphQLBackendApiUrl);
  },

  regularUserKzPhone: async ({ graphQLBackendApiUrl }, use) => {
    const user = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, [], EPhoneMask.KZ);
    await smartLkRegisterUser(user, generateUtmMarks(), graphQLBackendApiUrl);
    await use(user);
    await removeUserByEmail(user.email, graphQLBackendApiUrl);
  },

  /** Переопределяем фикстуру создания организации на уровне фикстур ЛК. Необходимо для того, чтобы сущности Потоков, РК, Точек привязывались
   *  к тестовой организации пользователя ЛК
   **/
  organization: async ({ onboardedUser }, use) => {
    await use(onboardedUser.organization);
  },

  registeredByRuPhoneUser: async ({ graphQLBackendApiUrl }, use) => {
    const user = new User(COMMON_CONSTANTS.TEST_RETENTION_EMAIL_PREFIX, [], EPhoneMask.RU);
    const authAllowedActionsForPhoneResp = await getAuthAllowedActionsForPhone(user.phone, graphQLBackendApiUrl);
    assert.equal(
      authAllowedActionsForPhoneResp.allowedActionsForPhone,
      'register',
      'Auth Allowed Actions For Phone should contains - register'
    );
    await authCodeCreate(user.phone, graphQLBackendApiUrl);
    const activationCode = await getValidatedLkAuthCode(user.phone, graphQLBackendApiUrl);
    await smartLkRegisterByPhoneUser(activationCode, user.phone, generateUtmMarks(), graphQLBackendApiUrl);
    await use(user);
    await removeUserByPhone(user.phone, graphQLBackendApiUrl);
  },
});
