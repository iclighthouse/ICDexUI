import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import {
  Result,
  Operation
} from '@/ic/ICLighthouse/model';
export const manageAddressBook = async (
  ICLighthouseService: ICLighthouseService,
  operation: Operation,
  address: string,
  encrypt = 'AEC'
): Promise<Result> => {
  return await ICLighthouseService.manageAddressBook(address, encrypt, operation);
};
