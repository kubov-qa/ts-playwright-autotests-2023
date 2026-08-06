import { LOCATOR_CONSTANTS } from './two-buttons';

export const REGISTER_PAGE_URL_PATH = '/register';
export const FORGOT_COMPLETE_URL = '/forgot-complete';
export const FORGOT_URL = '/forgot';
export const OFERTA_URL = '/oferta';
export const CONF_URL = '/conf';

export const REGISTER_LOCATORS = {
  BY_EMAIL_BUTTON: LOCATOR_CONSTANTS.ID_EMAIL_BUTTON,
  BY_SBBID_BUTTON: LOCATOR_CONSTANTS.ID_SBBID_BUTTON,
  SBBID_MODAL_BUTTON: 'id=button_sbbid_modal_button',
  REGISTER_BUTTON: 'id=button_register',
  REDIRECT_TO_LOGIN: 'text="Войти"',
  REDIRECT_TO_OFERTA: 'text="публичной оферты"',
  REDIRECT_TO_CONFIDENTIAL: 'text="Политикой обработки персональных данных"',
  EMAIL_INPUT: 'id=input_email',
  TEL_INPUT: 'id=input_phone',
  PASSWORD_INPUT: 'id=input_password',
  PHONE_SUBMIT_BUTTON: 'id=button_phone_submit',
  SMS_INPUT: 'id=input_code',
  SMS_SUBMIT_BUTTON: 'id=button_submit_code',
  RESEND_SMS_BUTTON: 'id=button_resend_code',
};
