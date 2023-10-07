import { Address } from '@/ic/DRC20Token/model';

export default interface Service {
  pushUser(address: Address, principalString: string): Promise<string>;
}
