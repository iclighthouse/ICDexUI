import Service, {
  ETHEvent,
  MinterInfoDFI,
  RetrieveEthStatus,
  WithdrawalArg,
  WithdrawalResponse,
  WithdrawErc20Arg,
  WithdrawErc20Response
} from '@/ic/ckETHMinter/model';
import { createService } from '@/ic/createService';
import IDL from '@/ic/ckETHMinter/ckETHMinterDfi.did';

export class ckETHMinterDfiService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    return await createService<Service>(canisterId, IDL, renew, isUpdate);
  };
  public smart_contract_address = async (
    ckETHMinterId: string
  ): Promise<string> => {
    const service = await this.check(ckETHMinterId, false, false);
    try {
      return await service.smart_contract_address();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public get_events = async (request: {
    ckETHMinterId: string;
    start: bigint;
    length: bigint;
  }): Promise<{ total_event_count: bigint; events: Array<ETHEvent> }> => {
    const service = await this.check(request.ckETHMinterId, false, false);
    try {
      return await service.get_events(request);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public withdraw_eth = async (
    ckETHMinterId: string,
    withdrawalArg: WithdrawalArg
  ): Promise<WithdrawalResponse> => {
    const service = await this.check(ckETHMinterId);
    try {
      return await service.withdraw_eth(withdrawalArg);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public retrieve_eth_status = async (
    ckETHMinterId: string,
    blockIndex: bigint
  ): Promise<RetrieveEthStatus> => {
    const service = await this.check(ckETHMinterId);
    try {
      return await service.retrieve_eth_status(blockIndex);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public get_minter_info = async (
    ckETHMinterId: string
  ): Promise<MinterInfoDFI> => {
    const service = await this.check(ckETHMinterId, false, false);
    try {
      const res = await service.get_minter_info();
      return res as MinterInfoDFI;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public withdraw_erc20 = async (
    ckETHMinterId: string,
    WithdrawErc20Arg: WithdrawErc20Arg
  ): Promise<WithdrawErc20Response> => {
    const service = await this.check(ckETHMinterId);
    try {
      return await service.withdraw_erc20(WithdrawErc20Arg);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
