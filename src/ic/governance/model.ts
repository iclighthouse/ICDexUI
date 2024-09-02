import { E8s } from '../common/icType';

import { Principal } from '@dfinity/principal';
export interface NeuronId {
  id: bigint;
}
export interface ClaimOrRefreshNeuronFromAccount {
  controller: Principal[];
  memo: bigint;
}
export interface Neuron {
  id: [] | [NeuronId];
  staked_maturity_e8s_equivalent: Array<bigint>;
  controller: [] | [Principal];
  recent_ballots: Array<BallotInfo>;
  kyc_verified: boolean;
  not_for_profit: boolean;
  maturity_e8s_equivalent: bigint;
  cached_neuron_stake_e8s: bigint;
  created_timestamp_seconds: bigint;
  auto_stake_maturity: Array<boolean>;
  aging_since_timestamp_seconds: bigint;
  hot_keys: Array<Principal>;
  account: Array<number>;
  joined_community_fund_timestamp_seconds: Array<bigint>;
  dissolve_state: [] | [DissolveState];
  followees: Array<[number, Followees]>;
  neuron_fees_e8s: bigint;
  transfer: [] | [NeuronStakeTransfer];
  known_neuron_data: Array<KnownNeuronData>;
  spawn_at_timestamp_seconds: Array<bigint>;
  neuron_type: bigint[];
  visibility: bigint[];
}
export type DissolveState =
  | { DissolveDelaySeconds: bigint }
  | { WhenDissolvedTimestampSeconds: bigint };
export interface Followees {
  followees: Array<NeuronId>;
}
export interface NeuronStakeTransfer {
  to_subaccount: Array<number>;
  neuron_stake_e8s: bigint;
  from: [] | [Principal];
  memo: bigint;
  from_subaccount: Array<number>;
  transfer_timestamp: bigint;
  block_height: bigint;
}
export type Result_2 = { Ok: Neuron } | { Err: GovernanceError };
export type Result_3 = { Ok: NeuronInfo } | { Err: GovernanceError };
export interface NeuronInfo {
  dissolve_delay_seconds: bigint;
  recent_ballots: Array<BallotInfo>;
  created_timestamp_seconds: bigint;
  state: number;
  stake_e8s: bigint;
  joined_community_fund_timestamp_seconds: Array<bigint>;
  retrieved_at_timestamp_seconds: bigint;
  known_neuron_data: Array<KnownNeuronData>;
  voting_power: bigint;
  age_seconds: bigint;
  neuron_type: bigint[];
  visibility: bigint[];
}
export enum NeuronState {
  UNSPECIFIED = 0,
  LOCKED = 1,
  DISSOLVING = 2,
  DISSOLVED = 3
}
export interface BallotInfo {
  vote: Vote;
  proposal_id: [{ id: bigint }];
}
export enum Vote {
  UNSPECIFIED = 0,
  YES = 1,
  NO = 2
}
export interface GovernanceError {
  error_message: string;
  error_type: number;
}
export interface ManageNeuron {
  id: Array<NeuronId>;
  command: Array<Command>;
  neuron_id_or_subaccount: Array<NeuronIdOrSubaccount>;
}
export type NeuronIdOrSubaccount =
  | { Subaccount: Array<number> }
  | { NeuronId: NeuronId };
export type Command =
  | { Spawn: Spawn }
  | { Split: Split }
  | { Follow: Follow }
  | { ClaimOrRefresh: ClaimOrRefresh }
  | { Configure: Configure }
  | { RegisterVote: RegisterVote }
  | { Merge: Merge }
  | { DisburseToNeuron: DisburseToNeuron }
  | { MakeProposal: Proposal }
  | { StakeMaturity: StakeMaturity }
  | { MergeMaturity: MergeMaturity }
  | { Disburse: Disburse };
export interface StakeMaturity {
  percentage_to_stake: Array<bigint>;
}
export interface Disburse {
  to_account: Array<{ hash: number[] }>;
  amount: Array<{ e8s: E8s }>;
}
export interface Proposal {
  url: string;
  title: Array<string>;
  action: Array<Action>;
  summary: string;
}
export type Action =
  | { RegisterKnownNeuron: KnownNeuron }
  | { CreateServiceNervousSystem: CreateServiceNervousSystem }
  | {
      OpenSnsTokenSwap: OpenSnsTokenSwap;
    }
  | {
      SetSnsTokenSwapOpenTimeWindow: SetSnsTokenSwapOpenTimeWindow;
    }
  | { ExecuteNnsFunction: ExecuteNnsFunction }
  | { ManageNeuron: ManageNeuron }
  | { ApproveGenesisKyc: ApproveGenesisKyc }
  | { ManageNetworkEconomics: NetworkEconomics }
  | { RewardNodeProvider: RewardNodeProvider }
  | { RewardNodeProviders: RewardNodeProviders }
  | { AddOrRemoveNodeProvider: AddOrRemoveNodeProvider }
  | { SetDefaultFollowees: SetDefaultFollowees }
  | { Motion: Motion };
export interface CreateServiceNervousSystem {
  url: Array<string>;
  governance_parameters: Array<GovernanceParameters>;
  fallback_controller_principal_ids: Array<Principal>;
  logo: Array<Image>;
  name: Array<string>;
  ledger_parameters: Array<LedgerParameters>;
  description: Array<string>;
  dapp_canisters: Array<Canister>;
  swap_parameters: Array<SwapParameters>;
  initial_token_distribution: Array<InitialTokenDistribution>;
}
export interface InitialTokenDistribution {
  treasury_distribution: Array<SwapDistribution>;
  developer_distribution: Array<DeveloperDistribution>;
  swap_distribution: Array<SwapDistribution>;
}
export interface DeveloperDistribution {
  developer_neurons: Array<NeuronDistribution>;
}
export interface NeuronDistribution {
  controller: Array<Principal>;
  dissolve_delay: Array<Duration>;
  memo: Array<bigint>;
  vesting_period: Array<Duration>;
  stake: Array<Tokens>;
}
export interface SwapDistribution {
  total: Array<Tokens>;
}
export interface SwapParameters {
  minimum_participants: Array<bigint>;
  neurons_fund_participation: Array<boolean>;
  duration: Array<Duration>;
  neuron_basket_construction_parameters: Array<NeuronBasketConstructionParameters1>;
  confirmation_text: Array<string>;
  maximum_participant_icp: Array<Tokens>;
  minimum_icp: Array<Tokens>;
  minimum_direct_participation_icp: Array<Tokens>;
  minimum_participant_icp: Array<Tokens>;
  start_time: Array<GlobalTimeOfDay>;
  maximum_direct_participation_icp: Array<Tokens>;
  maximum_icp: Array<Tokens>;
  neurons_fund_investment_icp: Array<Tokens>;
  restricted_countries: Array<Countries>;
}
export interface GlobalTimeOfDay {
  seconds_after_utc_midnight: Array<bigint>;
}
export interface Countries {
  iso_codes: Array<string>;
}
export interface Canister {
  id: Array<Principal>;
}
export interface LedgerParameters {
  transaction_fee: Array<Tokens>;
  token_symbol: Array<string>;
  token_logo: Array<Image>;
  token_name: Array<string>;
}
export interface Image {
  base64_encoding: Array<string>;
}
export interface GovernanceParameters {
  neuron_maximum_dissolve_delay_bonus: Array<Percentage>;
  neuron_maximum_age_for_age_bonus: Array<Duration>;
  neuron_maximum_dissolve_delay: Array<Duration>;
  neuron_minimum_dissolve_delay_to_vote: Array<Duration>;
  neuron_maximum_age_bonus: Array<Percentage>;
  neuron_minimum_stake: Array<Tokens>;
  proposal_wait_for_quiet_deadline_increase: Array<Duration>;
  proposal_initial_voting_period: Array<Duration>;
  proposal_rejection_fee: Array<Tokens>;
  voting_reward_parameters: Array<VotingRewardParameters>;
}
export interface Percentage {
  basis_points: Array<bigint>;
}
export interface Duration {
  seconds: Array<bigint>;
}
export interface Tokens {
  e8s: Array<bigint>;
}
export interface VotingRewardParameters {
  reward_rate_transition_duration: Array<Duration>;
  initial_reward_rate: Array<Percentage>;
  final_reward_rate: Array<Percentage>;
}
export interface SetSnsTokenSwapOpenTimeWindow {
  request: Array<SetOpenTimeWindowRequest>;
  swap_canister_id: Array<Principal>;
}
export interface SetOpenTimeWindowRequest {
  open_time_window: Array<TimeWindow>;
}
export interface TimeWindow {
  start_timestamp_seconds: bigint;
  end_timestamp_seconds: bigint;
}
export interface OpenSnsTokenSwap {
  community_fund_investment_e8s: Array<bigint>;
  target_swap_canister_id: Array<Principal>;
  params: Array<Params>;
}
export interface Params {
  min_participant_icp_e8s: bigint;
  neuron_basket_construction_parameters: Array<NeuronBasketConstructionParameters>;
  max_icp_e8s: bigint;
  swap_due_timestamp_seconds: bigint;
  min_participants: bigint;
  sns_token_e8s: bigint;
  sale_delay_seconds: Array<bigint>;
  max_participant_icp_e8s: bigint;
  min_direct_participation_icp_e8s: Array<bigint>;
  min_icp_e8s: bigint;
  max_direct_participation_icp_e8s: Array<bigint>;
}
export interface NeuronBasketConstructionParameters1 {
  dissolve_delay_interval: Array<Duration>;
  count: Array<bigint>;
}
export interface NeuronBasketConstructionParameters {
  dissolve_delay_interval_seconds: bigint;
  count: bigint;
}
export interface KnownNeuron {
  id: Array<NeuronId>;
  known_neuron_data: Array<KnownNeuronData>;
}
export interface KnownNeuronData {
  name: string;
  description: Array<string>;
}
export interface Motion {
  motion_text: string;
}
export interface SetDefaultFollowees {
  default_followees: Array<[bigint, Followees]>;
}
export interface AddOrRemoveNodeProvider {
  change: Array<Change>;
}
export type Change = { ToRemove: NodeProvider } | { ToAdd: NodeProvider };
export type RewardNodeProviders = {
  use_registry_derived_rewards: Array<boolean>;
  rewards: Array<RewardNodeProvider>;
};
export interface RewardNodeProvider {
  node_provider: Array<NodeProvider>;
  reward_mode: Array<RewardMode>;
  amount_e8s: bigint;
}
export type RewardMode =
  | { RewardToNeuron: RewardToNeuron }
  | { RewardToAccount: RewardToAccount };
export interface RewardToAccount {
  to_account: Array<{ hash: Array<number> }>;
}
export interface RewardToNeuron {
  dissolve_delay_seconds: bigint;
}
export interface NodeProvider {
  id: Array<Principal>;
  reward_account: Array<{ hash: Array<number> }>;
}
export interface NetworkEconomics {
  neuron_minimum_stake_e8s: E8s;
  max_proposals_to_keep_per_topic: bigint;
  neuron_management_fee_per_proposal_e8s: E8s;
  reject_cost_e8s: E8s;
  transaction_fee_e8s: E8s;
  neuron_spawn_dissolve_delay_seconds: bigint;
  minimum_icp_xdr_rate: bigint;
  maximum_node_provider_rewards_e8s: bigint;
}
export interface ApproveGenesisKyc {
  principals: Array<Principal>;
}
export interface ExecuteNnsFunction {
  nnsFunction: number;
  payload: Array<number>;
}
export interface MergeMaturity {
  percentage_to_merge: bigint;
}
export interface DisburseToNeuron {
  dissolve_delay_seconds: bigint;
  kyc_verified: boolean;
  amount_e8s: E8s;
  new_controller: Array<Principal>;
  nonce: bigint;
}
export interface RegisterVote {
  vote: Vote;
  proposal: Array<{ id: bigint }>;
}
export interface Configure {
  operation: Array<Operation>;
}
export type Operation =
  | { RemoveHotKey: RemoveHotKey }
  | { AddHotKey: AddHotKey }
  | { ChangeAutoStakeMaturity: ChangeAutoStakeMaturity }
  | { StopDissolving: {} }
  | { StartDissolving: {} }
  | { IncreaseDissolveDelay: IncreaseDissolveDelay }
  | { JoinCommunityFund: {} }
  | { LeaveCommunityFund: {} }
  | { SetDissolveTimestamp: SetDissolveTimestamp };
export interface ChangeAutoStakeMaturity {
  requested_setting_for_auto_stake_maturity: boolean;
}
export interface SetDissolveTimestamp {
  dissolve_timestamp_seconds: bigint;
}
export interface IncreaseDissolveDelay {
  additional_dissolve_delay_seconds: bigint;
}
export interface RemoveHotKey {
  hot_key_to_remove: Array<Principal>;
}
export interface AddHotKey {
  new_hot_key: Array<Principal>;
}
export interface Spawn {
  'percentage_to_spawn' : [] | [number],
  'new_controller' : [] | [Principal],
  'nonce' : [] | [bigint],
}
export interface Split {
  amount_e8s: E8s;
}
export interface Follow {
  topic: bigint;
  followees: Array<NeuronId>;
}
export type ClaimOrRefresh = { by: Array<By> };
export type By =
  | { NeuronIdOrSubaccount: {} }
  | { MemoAndController: ClaimOrRefreshNeuronFromAccount }
  | { Memo: bigint };
export interface ManageNeuronResponse {
  command: Array<Command_1>;
}
export type Command_1 =
  | { Error: GovernanceError }
  | { Spawn: SpawnResponse }
  | { Split: SpawnResponse }
  | { Follow: {} }
  | { ClaimOrRefresh: ClaimOrRefreshResponse }
  | { Configure: {} }
  | { RegisterVote: {} }
  | { Merge: MergeResponse }
  | { DisburseToNeuron: SpawnResponse }
  | { StakeMaturity: StakeMaturityResponse }
  | { MakeProposal: MakeProposalResponse }
  | { MergeMaturity: MergeMaturityResponse }
  | { Disburse: DisburseResponse };
export interface MergeResponse {
  target_neuron: Array<Neuron>;
  source_neuron: Array<Neuron>;
  target_neuron_info: Array<NeuronInfo>;
  source_neuron_info: Array<NeuronInfo>;
}
export interface Merge {
  source_neuron_id: Array<NeuronId>;
}
export interface StakeMaturityResponse {
  maturity_e8s: bigint;
  staked_maturity_e8s: bigint;
}
export interface ClaimOrRefreshNeuronFromAccountResponse {
  result: Array<Result_1>;
}
export interface Result_1 {
  Error: GovernanceError;
  NeuronId: NeuronId;
}
export interface SpawnResponse {
  created_neuron_id: [NeuronId];
}
export interface ClaimOrRefreshResponse {
  refreshed_neuron_id: Array<NeuronId>;
}
export interface MakeProposalResponse {
  proposal_id: Array<NeuronId>;
}
export interface MergeMaturityResponse {
  merged_maturity_e8s: bigint;
  new_stake_e8s: bigint;
}
export interface DisburseResponse {
  transfer_block_height: bigint;
}
export interface IncreaseDissolveDelayRequest {
  neuronId: bigint;
  additionalDissolveDelaySeconds: bigint;
}
export interface DisburseRequest {
  neuronId: bigint;
  toAccount: number[];
  amount: Array<bigint>;
}
export interface SplitRequest {
  neuronId: bigint;
  amount: bigint;
}
export interface SpawnRequest {
  neuronId: bigint;
  newController: Principal;
}
export interface ProposalInfo {
  id: Array<NeuronId>;
  status: bigint;
  topic: bigint;
  failure_reason: Array<GovernanceError>;
  ballots: Array<[bigint, Ballot]>;
  proposal_timestamp_seconds: bigint;
  reward_event_round: bigint;
  deadline_timestamp_seconds: Array<bigint>;
  failed_timestamp_seconds: bigint;
  reject_cost_e8s: bigint;
  derived_proposal_information: Array<DerivedProposalInformation>;
  latest_tally: Array<Tally>;
  reward_status: bigint;
  decided_timestamp_seconds: bigint;
  proposal: Array<Proposal>;
  proposer: Array<NeuronId>;
  executed_timestamp_seconds: bigint;
}
export interface Tally {
  no: bigint;
  yes: bigint;
  total: bigint;
  timestamp_seconds: bigint;
}
export interface Ballot {
  vote: bigint;
  voting_power: bigint;
}
export interface DerivedProposalInformation {
  swap_background_information: Array<SwapBackgroundInformation>;
}
export interface SwapBackgroundInformation {
  ledger_index_canister_summary: Array<CanisterSummary>;
  fallback_controller_principal_ids: Array<Principal>;
  ledger_archive_canister_summaries: Array<CanisterSummary>;
  ledger_canister_summary: Array<CanisterSummary>;
  swap_canister_summary: Array<CanisterSummary>;
  governance_canister_summary: Array<CanisterSummary>;
  root_canister_summary: Array<CanisterSummary>;
  dapp_canister_summaries: Array<CanisterSummary>;
}
export interface CanisterSummary {
  status: Array<CanisterStatusResultV2>;
  canister_id: Array<Principal>;
}
export interface CanisterStatusResultV2 {
  status: Array<bigint>;
  freezing_threshold: Array<bigint>;
  controllers: Array<Principal>;
  memory_size: Array<bigint>;
  cycles: Array<bigint>;
  idle_cycles_burned_per_day: Array<bigint>;
  module_hash: Array<bigint>;
}
export interface listProposalsReq {
  include_reward_status: Array<number>;
  omit_large_fields?: Array<boolean>;
  before_proposal: Array<NeuronId>;
  limit: bigint;
  exclude_topic: Array<number>;
  include_all_manage_neuron_proposals: Array<boolean>;
  include_status: Array<number>;
}
export interface ListProposalInfoResponse {
  proposal_info: Array<ProposalInfo>;
}
export interface ListNeurons {
  include_public_neurons_in_full_neurons: boolean[];
  include_empty_neurons_readable_by_caller: boolean[];
  neuron_ids: Array<bigint>;
  include_neurons_readable_by_caller: boolean;
}
export interface ListNeuronsResponse {
  neuron_infos: Array<[bigint, NeuronInfo]>;
  full_neurons: Array<Neuron>;
}
export interface ListKnownNeuronsResponse {
  known_neurons: Array<KnownNeuron>;
}
export interface KnownNeuron {
  id: Array<NeuronId>;
  known_neuron_data: Array<KnownNeuronData>;
}

export default interface Service {
  'claim_or_refresh_neuron_from_account'(
    request: ClaimOrRefreshNeuronFromAccount
  ): Promise<ClaimOrRefreshNeuronFromAccountResponse>;
  'get_full_neuron'(request: bigint): Promise<Result_2>;
  'get_neuron_info'(request: bigint): Promise<Result_3>;
  'get_neuron_ids'(): Promise<Array<bigint>>;
  list_neurons(request: ListNeurons): Promise<ListNeuronsResponse>;
  'manage_neuron'(request: ManageNeuron): Promise<ManageNeuronResponse>;
  get_proposal_info(proposalId: bigint): Promise<Array<ProposalInfo>>;
  list_proposals(request: listProposalsReq): Promise<ListProposalInfoResponse>;
  get_network_economics_parameters(): Promise<NetworkEconomics>;
  list_known_neurons(): Promise<ListKnownNeuronsResponse>;
}
