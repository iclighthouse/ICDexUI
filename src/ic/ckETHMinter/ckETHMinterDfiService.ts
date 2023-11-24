import Service, {
  ETHEvent,
  RetrieveEthStatus,
  WithdrawalArg,
  WithdrawalResponse
} from '@/ic/ckETHMinter/model';
import { checkService } from '@/ic/checkService';
import { CK_ETH_MINTER_CANISTER_ID } from '@/ic/utils';
import IDL from '@/ic/ckETHMinter/ckETHMinterDfi.did';

export class ckETHMinterDfiService {
  private check = async (renew = true, isUpdate = true): Promise<Service> => {
    return await checkService<Service>(
      CK_ETH_MINTER_CANISTER_ID,
      IDL,
      renew,
      isUpdate
    );
  };
  public smart_contract_address = async (): Promise<string> => {
    const service = await this.check(false, false);
    try {
      return await service.smart_contract_address();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public get_events = async (request: {
    start: bigint;
    length: bigint;
  }): Promise<{ total_event_count: bigint; events: Array<ETHEvent> }> => {
    const service = await this.check(false, false);
    try {
      return await service.get_events(request);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public withdraw_eth = async (
    withdrawalArg: WithdrawalArg
  ): Promise<WithdrawalResponse> => {
    const service = await this.check();
    try {
      return await service.withdraw_eth(withdrawalArg);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public retrieve_eth_status = async (
    blockIndex: bigint
  ): Promise<RetrieveEthStatus> => {
    const service = await this.check();
    try {
      return await service.retrieve_eth_status(blockIndex);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
