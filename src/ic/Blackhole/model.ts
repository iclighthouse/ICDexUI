import { Principal } from '@dfinity/principal';
export interface CanisterStatus {
  status:
    | {
        stopped: null;
      }
    | {
        stopping: null;
      }
    | {
        running: null;
      };
  memory_size: bigint;
  cycles: bigint;
  settings: {
    freezing_threshold: bigint;
    controllers: Array<Principal>;
    memory_allocation: bigint;
    compute_allocation: bigint;
  };
  module_hash: Array<Array<number>>;
}

export default interface Service {
  canister_status(res: { canister_id: Principal }): Promise<CanisterStatus>;
}
