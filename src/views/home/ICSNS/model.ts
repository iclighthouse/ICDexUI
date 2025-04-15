import { TokenInfo, TokenStd } from '@/ic/common/icType';
import {
  ListNervousSystemFunctionsResponse,
  NervousSystemFunction,
  NervousSystemParameters,
  SNSNeuron, TopicInfo
} from '@/ic/SNSGovernance/model';
import {
  BuyerState,
  CfParticipant,
  GetStateResponse, Init,
  Params,
  Participant,
  SnsNeuronRecipe
} from '@/ic/SNSSwap/model';
export interface SNSToken {
  fee?: bigint;
  totalSupply?: bigint;
  tokenStd: TokenStd;
  balance: string;
  symbol: string;
  decimals: number;
  tokenId: string;
  url: Array<string>;
  logo: Array<string>;
  name: Array<string>;
  description: Array<string>;
  state?: GetStateResponse;
  lifecycle: Array<bigint>;
  neuron_recipes?: Array<SnsNeuronRecipe>;
  cf_participants?: Array<CfParticipant>;
  participant?: Array<Participant>;
  buyers?: Array<[string, BuyerState]>;
  params: Array<Params>;
  buyersTotal?: bigint;
  swapId?: string;
  governanceId?: string;
  proposalId?: bigint;
  // In ADOPTED state, the proposal to start decentralization sale
  // has been adopted, and the sale can be opened after a delay
  // specified by params.sale_delay_seconds.
  deadline?: number;
  deadlineLoading?: boolean;
  init?: Init;
  direct_participation_icp_e8s?: bigint;
}
export interface SNSNeuronsInfo {
  SNSNeuronOfSNSTokenInfo: TokenInfo;
  SNSNeuronOfId: string;
  SNSNeuronOfGovernanceId: string;
  SNSNeuronPageSize: number;
  loading: boolean;
  SNSNeurons: Array<SNSNeuron>;
  nervousSystemParameters: NervousSystemParameters;
  listNervousSystemFunctions: ListNervousSystemFunctionsResponse;
  lifecycle?: Array<bigint>;
}
export enum SNSNeuronStatus {
  Unspecified = 'Unspecified',
  Locked = 'Locked',
  Dissolving = 'Dissolving',
  Dissolved = 'Dissolved'
}
export enum NeuronPermissionEnum {
  // Unused, here for PB lint purposes.
  Unspecified = 0,
  // The principal has permission to configure the neuron's dissolve state. This includes
  // start dissolving, stop dissolving, and increasing the dissolve delay for the neuron.
  ConfigureDissolveState = 1,
  // The principal has permission to add additional principals to modify the neuron.
  // The nervous system parameter `NervousSystemParameters::neuron_grantable_permissions`
  // determines the maximum set of privileges that a principal can grant to another principal in
  // the given SNS.
  ManagePrincipals = 2,
  // The principal has permission to submit proposals on behalf of the neuron.
  // Submitting proposals can change a neuron's stake and thus this
  // is potentially a balance changing operation.
  SubmitProposal = 3,
  // The principal has permission to vote and follow other neurons on behalf of the neuron.
  Vote = 4,
  // The principal has permission to disburse the neuron.
  Disburse = 5,
  // The principal has permission to split the neuron.
  Split = 6,
  // The principal has permission to merge the neuron's maturity into
  // the neuron's stake.
  MergeMaturity = 7,
  // The principal has permission to disburse the neuron's maturity to a
  // given ledger account.
  DisburseMaturity = 8,
  // The principal has permission to stake the neuron's maturity.
  StakeMaturity = 9,
  // The principal has permission to grant/revoke permission to vote and submit
  // proposals on behalf of the neuron to other principals.
  ManageVotingPermission = 10
}
export type NeuronPermissionType = keyof typeof NeuronPermissionEnum;
export interface neuronSystemPermissionsType {
  id: number;
  name: NeuronPermissionType;
  description: string;
}
export interface proposalsNeurons {
  tokenId: string;
  governanceId: string;
  url: Array<string>;
  logo: Array<string>;
  name: Array<string>;
  description: Array<string>;
  decimals: number;
  listNervousSystemFunctionsResponse: Array<NervousSystemFunction>;
  allTopics: Array<bigint>;
  listTypes: Array<{ id: number; name: string }>;
  types: { [key: string]: NervousSystemFunction };
  nervousSystemParameters: NervousSystemParameters;
  lifecycle?: Array<bigint>;
}
