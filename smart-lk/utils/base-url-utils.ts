import { ESTAGES } from '../../common/constants/stages';
import { getValidatedStage } from '../../common/utils/stage-utils';
import { CONSTANTS } from '../constants/constants';

/**
 * @returns Возвращает SmartLK Base URL для stage-окружения, заданного через переменные окружения
 */
export function getBaseUrl(): string {
  const validatedStage = getValidatedStage();
  if (validatedStage == ESTAGES.DEV1) {
    return CONSTANTS.dev1BaseURL;
  }
  if (validatedStage == ESTAGES.DEV2) {
    return CONSTANTS.dev2BaseURL;
  }
  if (validatedStage == ESTAGES.DEV3) {
    return CONSTANTS.dev3BaseURL;
  }
  if (validatedStage == ESTAGES.DEV4) {
    return CONSTANTS.dev4BaseURL;
  }
  //ESTAGES.STAGE:
  return CONSTANTS.stageBaseURL;
}
