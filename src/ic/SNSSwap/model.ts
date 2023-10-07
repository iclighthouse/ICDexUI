import { Principal } from '@dfinity/principal';
import { Icrc1Account } from '@/ic/common/icType';

export interface GetStateResponse {
  swap: Array<Swap>;
  derived: Array<DerivedState>;
}
export interface Swap {
  neuron_recipes: Array<SnsNeuronRecipe>;
  next_ticket_id?: Array<bigint>;
  decentralization_sale_open_timestamp_seconds?: Array<bigint>;
  finalize_swap_in_progress?: Array<boolean>;
  cf_participants: Array<CfParticipant>;
  init: Array<bigint>;
  purge_old_tickets_last_completion_timestamp_nanoseconds?: Array<bigint>;
  lifecycle: bigint;
  purge_old_tickets_next_principal?: Array<Array<number>>
  buyers: Array<[string, BuyerState]>;
  params: Array<Params>;
  open_sns_token_swap_proposal_id: Array<bigint>;
}
export interface SnsNeuronRecipe {
  sns: Array<TransferableAmount>;
  claimed_status?: Array<bigint>;
  neuron_attributes: Array<NeuronAttributes>;
  investor: Array<Investor>;
}
export interface TransferableAmount {
  transfer_fee_paid_e8s?: Array<bigint>;
  transfer_start_timestamp_seconds: bigint;
  amount_e8s: bigint;
  amount_transferred_e8s?: Array<bigint>;
  transfer_success_timestamp_seconds: bigint;
}
export interface NeuronAttributes {
  dissolve_delay_seconds: bigint;
  memo: bigint;
  followees?: Array<{id: Array<number>}>
}
export type Investor =
  | { CommunityFund: CfInvestment }
  | {
      Direct: DirectInvestment;
    };
export interface CfInvestment {
  hotkey_principal: string;
  nns_neuron_id: bigint;
}
export interface DirectInvestment {
  buyer_principal: string;
}
export interface CfParticipant {
  hotkey_principal: string;
  cf_neurons: Array<CfNeuron>;
}
export interface CfNeuron {
  nns_neuron_id: bigint;
  amount_icp_e8s: bigint;
}
export interface BuyerState {
  icp: Array<TransferableAmount>;
}
export interface Params {
  min_participant_icp_e8s: bigint;
  neuron_basket_construction_parameters: Array<NeuronBasketConstructionParameters>;
  max_icp_e8s: bigint;
  swap_due_timestamp_seconds: bigint;
  min_participants: bigint;
  sns_token_e8s: bigint;
  max_participant_icp_e8s: bigint;
  sale_delay_seconds: Array<bigint>;
  min_icp_e8s: bigint;
  neurons_fund_investment_icp?: bigint;
}
export interface NeuronBasketConstructionParameters {
  dissolve_delay_interval_seconds: bigint;
  count: bigint;
}
export interface DerivedState {
  sns_tokens_per_icp: string;
  buyer_total_icp_e8s: bigint;
  cf_participant_count?: Array<bigint>;
  direct_participant_count?: Array<bigint>;
  cf_neuron_count?: Array<bigint>;
}

export interface GetBuyersTotalResponse {
  buyers_total: bigint;
}
export interface GetBuyerStateRequest {
  principal_id: Array<Principal>;
}
export interface GetBuyerStateResponse {
  buyer_state: Array<BuyerState>;
}
export interface RefreshBuyerTokensRequest {
  buyer: string;
}
export interface RefreshBuyerTokensRequest1 {
  confirmation_text: Array<string>;
  buyer: string;
}
export interface RefreshBuyerTokensResponse {
  icp_accepted_participation_e8s: bigint;
  icp_ledger_account_balance_e8s: bigint;
}
export interface ErrorRefundIcpRequest {
  source_principal_id: Array<Principal>;
}
export interface ErrorRefundIcpResponse {
  result: Array<Result>;
}
export type Result = { Ok: Ok } | { Err: Err };
export interface Ok {
  block_height: Array<bigint>;
}
export interface Err {
  description: Array<string>;
  error_type: Array<bigint>;
}
export interface GetLifecycleResponse {
  decentralization_sale_open_timestamp_seconds?: Array<bigint>;
  lifecycle: Array<bigint>;
}
export interface GetSaleParametersResponse {
  params: Array<Params>;
}
export interface GetDerivedStateResponse {
  sns_tokens_per_icp: string;
  buyer_total_icp_e8s: bigint;
}
export interface GetDerivedStateResponse1 {
  sns_tokens_per_icp: Array<string>;
  buyer_total_icp_e8s: Array<bigint>;
  cf_participant_count: Array<bigint>;
  direct_participant_count: Array<bigint>;
  cf_neuron_count: Array<bigint>;
}
export interface ListRequest {
  offset: Array<bigint>;
  limit: Array<bigint>;
}
export interface ListCommunityFundParticipantsResponse {
  cf_participants: Array<CfParticipant>;
}
export interface ListDirectParticipantsResponse {
  participants: Array<Participant>;
}
export interface Participant {
  participation: Array<BuyerState>;
  participant_id: Array<Principal>;
}
export interface ListSnsNeuronRecipesResponse {
  sns_neuron_recipes: Array<SnsNeuronRecipe>;
}
export interface GetOpenTicketResponse {
  result: Array<Result_1>;
}
export type Result_1 =
  | {
      Ok: Ok_1;
    }
  | { Err: Err_1 };
export interface Ok_1 {
  ticket: Array<Ticket>;
}
export interface Ticket {
  creation_time: bigint;
  ticket_id: bigint;
  account: Array<Icrc1Account>;
  amount_icp_e8s: bigint;
}
export interface Err_1 {
  error_type: Array<bigint>;
}
export interface NewSaleTicketRequest {
  subaccount: Array<Array<number>>;
  amount_icp_e8s: bigint;
}
export interface NewSaleTicketResponse {
  result: Array<Result_2>;
}
export type Result_2 = { Ok: Ok_1 } | { Err: Err_2 };
export interface Err_2 {
  invalid_user_amount: Array<InvalidUserAmount>;
  existing_ticket: Array<Ticket>;
  error_type: bigint;
}
export interface InvalidUserAmount {
  min_amount_icp_e8s_included: bigint;
  max_amount_icp_e8s_included: bigint;
}
export interface GetInitResponse {
  init: Array<Init>
}
export interface Init {
  sns_root_canister_id: string;
  fallback_controller_principal_ids: Array<string>;
  neuron_minimum_stake_e8s: Array<bigint>;
  confirmation_text: Array<string>;
  nns_governance_canister_id: string;
  transaction_fee_e8s: Array<bigint>;
  icp_ledger_canister_id: string;
  sns_ledger_canister_id: string;
  sns_governance_canister_id: string;
  restricted_countries: Array<Countries>
}
export interface Countries {
  iso_codes: Array<string>;
}

export default interface Service {
  get_state({}): Promise<GetStateResponse>;
  get_buyers_total({}): Promise<GetBuyersTotalResponse>;
  get_buyer_state(
    request: GetBuyerStateRequest
  ): Promise<GetBuyerStateResponse>;
  get_lifecycle({}): Promise<GetLifecycleResponse>;
  get_sale_parameters({}): Promise<GetSaleParametersResponse>;
  get_derived_state({}): Promise<GetDerivedStateResponse | GetDerivedStateResponse1>;
  list_community_fund_participants(
    request: ListRequest
  ): Promise<ListCommunityFundParticipantsResponse>;
  list_direct_participants(
    request: ListRequest
  ): Promise<ListDirectParticipantsResponse>;
  list_sns_neuron_recipes(
    request: ListRequest
  ): Promise<ListSnsNeuronRecipesResponse>;
  refresh_buyer_tokens(
    request: RefreshBuyerTokensRequest | RefreshBuyerTokensRequest1
  ): Promise<RefreshBuyerTokensResponse>;
  error_refund_icp(
    request: ErrorRefundIcpRequest
  ): Promise<ErrorRefundIcpResponse>;
  get_open_ticket({}): Promise<GetOpenTicketResponse>;
  new_sale_ticket(
    request: NewSaleTicketRequest
  ): Promise<NewSaleTicketResponse>;
  notify_payment_failure({}): Promise<Ok_1>;
  get_init({}): Promise<GetInitResponse>;
}
