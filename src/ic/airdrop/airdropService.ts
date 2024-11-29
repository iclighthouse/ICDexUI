import Service, { AirDrop, ClaimLog, ClaimWithNftLog } from '@/ic/airdrop/model';
import airdropIDL from './airdrop.did';
import { AIRDROP_CANISTER_ID } from '@/ic/utils';
import { Principal } from '@dfinity/principal';
import { buildService } from '@/ic/Service';

export class AirdropService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await buildService(null, airdropIDL, AIRDROP_CANISTER_ID);
  };
  public checkAirDrop = async (
    owner: Principal,
    subaccount: Array<Array<number>> = []
  ): Promise<AirDrop> => {
    await this.check();
    return this.service.checkAirDrop(owner, subaccount);
  };
  public claim = async (
    owner: Principal,
    subaccount: Array<Array<number>> = []
  ): Promise<bigint> => {
    await this.check();
    return this.service.claim(owner, subaccount);
  };
  public checkAirDropWithNft = async (
    nftId: string
  ): Promise<AirDrop> => {
    await this.check();
    return this.service.checkAirDropWithNft(nftId);
  };
  public claimWithNft = async (
    nftId: string,
    owner: Principal,
    subaccount: Array<Array<number>> = []
  ): Promise<bigint> => {
    await this.check();
    return this.service.claimWithNft(nftId, owner, subaccount);
  };
  public claimLog = async (
    owner: Principal,
    subaccount: Array<Array<number>> = []
  ): Promise<Array<ClaimLog>> => {
    await this.check();
    return this.service.claimLog(owner, subaccount);
  };
  public claimWithNftLog = async (
    nftId: string
  ): Promise<Array<ClaimWithNftLog>> => {
    await this.check();
    return this.service.claimWithNftLog(nftId);
  };
}
