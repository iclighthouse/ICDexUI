import { Principal } from '@dfinity/principal';
import { Icrc1Account, Time } from '@/ic/common/icType';
export interface ClaimLog {
  status:
    | {
        Claiming: null;
      }
    | { Completed: null };
  value: bigint;
  time: Time;
}
export interface ClaimWithNftLog {
  to: Icrc1Account;
  status:
    | {
        Claiming: null;
      }
    | { Completed: null };
  value: bigint;
  time: Time;
}
export interface AirDrop {
  available: bigint;
  credit: bigint;
  message: string;
}
export default interface Service {
  checkAirDrop(
    owner: Principal,
    subaccount: Array<Array<number>>
  ): Promise<AirDrop>;
  claim(owner: Principal, subaccount: Array<Array<number>>): Promise<bigint>;
  checkAirDropWithNft(nftId: string): Promise<AirDrop>;
  claimWithNft(
    nftId: string,
    owner: Principal,
    subaccount: Array<Array<number>>
  ): Promise<bigint>;
  claimLog(
    owner: Principal,
    subaccount: Array<Array<number>>
  ): Promise<Array<ClaimLog>>;
  claimWithNftLog(nftId: string): Promise<Array<ClaimWithNftLog>>;
}
