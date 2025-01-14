import { Principal } from '@dfinity/principal';
import { TokenStatus } from '@/ic/ICTokens/model';
export interface UpdateSettingsRequest {
  canister_id: Principal;
  settings: CanisterSettings;
}
export interface CanisterSettings {
  controllers: Array<Array<Principal>>;
  freezing_threshold: Array<number>;
  memory_allocation: Array<number>;
  compute_allocation: Array<number>;
}
export default interface Service {
  update_settings(request: UpdateSettingsRequest): Promise<void>;
  canister_status(request: { canister_id: Principal }): Promise<TokenStatus>;
}
