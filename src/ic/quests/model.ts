import { Principal } from '@dfinity/principal';
export default interface Service {
  putEvent(event: string, principal: Principal, text: Array<string>): Promise<string>;
}
