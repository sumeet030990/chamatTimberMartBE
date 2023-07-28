import { fetchQueryParamsType } from './commons';

export type fetchUserByUserNameFilterParams = {
  selfUserId?: number | undefined;
  allowLogin?: boolean | undefined;
};

export interface fetchUserQueryParamsType extends fetchQueryParamsType {
  userType: string;
}
