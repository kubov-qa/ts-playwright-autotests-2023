import { LOCATOR_CONSTANTS } from './two-buttons';

export const LOGIN_PAGE_URL_PATH = '/login';

export const LOGIN_LOCATORS = {
  // TODO - remove not used locators
  //BY_EMAIL_BUTTON: LOCATOR_CONSTANTS.ID_EMAIL_BUTTON,
  BY_SBBID_BUTTON: LOCATOR_CONSTANTS.ID_SBBID_BUTTON,
  LOGIN_BUTTON: 'id=button_register',
  REDIRECT_TO_REGISTER: 'text="Зарегистрироваться"',
  FORGOT_PASSWORD: 'text="Забыли пароль?"',
  //USERNAME_INPUT: 'id=input_username',
  EMAIL_INPUT: 'id=input_email',
  PASSWORD_INPUT: 'id=input_password',
  NEW_PASSWORD_SENDING: 'id=button_send',
  REDIRECT_TO_LOGIN: 'text="Вернуться ко входу"',
  REDIRECT_TO_AUTHORIZATION: 'text="Вернуться к авторизации"',
  REPEATED_PASSWORD_SENDING: 'id=button_login', // Кнопка "Отправить еще раз" при восстановлении пароля
};
