import { EOrganizatoinType } from '../../common/models/organization-type';
import { CONSTANTS } from '../constants/constants';

/**
 * @returns Возвращает название типа организации
 */
export function getOrganizationTypeName(organizationType: EOrganizatoinType): string {
  if (organizationType == EOrganizatoinType.INDIVIDUAL) {
    return CONSTANTS.INDIVIDUAL_ORG_TYPE_NAME;
  }
  //EOrganizatoinType.LEGAL:
  return CONSTANTS.LEGAL_ORG_TYPE_NAME;
}
