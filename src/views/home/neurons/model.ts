import { Ballot, Neuron, NeuronState } from '@/ic/governance/model';
import { NeuronId } from '@/ic/common/icType';

export interface Menu {
  path: string;
  value: string;
  name: string;
}
export interface NeuronBallot {
  id: bigint;
  vote: bigint;
  voting_power: string;
}

export interface NeuronFullInfo extends Neuron {
  neuronId: NeuronId;
  dissolveDelaySeconds: BigInt;
  state: NeuronState;
  status: keyof typeof NeuronState;
}
export enum PeriodList {
  Minutes = 'Minutes',
  Hours = 'Hours',
  Days = 'Days',
  // Weeks = 'Weeks',
  Months = 'Months',
  Years = 'Years'
}

export type Period = keyof typeof PeriodList;

export enum Topic {
  Unspecified = 0,
  // ManageNeuron = 1,
  ExchangeRate = 2,
  NetworkEconomics = 3,
  Governance = 4,
  NodeAdmin = 5,
  ParticipantManagement = 6,
  SubnetManagement = 7,
  NetworkCanisterManagement = 8,
  Kyc = 9,
  NodeProviderRewards = 10,
  SubnetReplicaVersionManagement = 12,
  ReplicaVersionManagement = 13,
  SnsAndCommunityFund = 14
}
export const FunctionsName = {
  0: 'All Except Governance, and SNS & Community Fund',
  4: 'Governance',
  14: 'SNS And Community Fund',
  3: 'Network Economics',
  5: 'Node Admin',
  6: 'Participant Management',
  7: 'Subnet Management',
  8: 'Network Canister Management',
  9: 'Kyc',
  10: 'Node Provider Rewards',
  12: 'Subnet Replica Version Management',
  13: 'Replica Version Management',
  2: 'Exchange Rate'
};
export const AllTopicsId = [4, 14, 3, 5, 6, 7, 8, 9, 10, 12, 13, 2];
export const AllTopicsIdExcludeRate = [4, 14, 3, 5, 6, 7, 8, 9, 10, 12, 13];
export const TopicInfo = [
  {
    id: 0,
    info: {
      title: 'All Except Governance, and SNS & Community Fund',
      subtitle:
        'Follow neurons on all proposal topics except the governance topic, and SNS & Community Fund.'
    }
  },
  {
    id: 4,
    info: {
      title: 'Governance',
      subtitle:
        'All proposals that administer governance, for example to freeze malicious canisters that are harming the network.'
    }
  },
  {
    id: 14,
    info: {
      title: 'SNS & Community Fund',
      subtitle: 'Proposals related to SNS and Community Fund'
    }
  },
  {
    id: 3,
    info: {
      title: 'Network Economics',
      subtitle:
        'Proposals that administer network economics, for example, determining what rewards should be paid to node operators.'
    }
  },
  {
    id: 5,
    info: {
      title: 'Node Admin',
      subtitle:
        'All proposals that administer node machines somehow, including, but not limited to, upgrading or configuring the OS, upgrading or configuring the virtual machine framework and upgrading or configuring the node replica software.'
    }
  },
  {
    id: 6,
    info: {
      title: 'Participant Management',
      subtitle:
        'All proposals that administer network participants, for example, granting and revoking DCIDs (data center identities) or NOIDs (node operator identities).'
    }
  },
  {
    id: 7,
    info: {
      title: 'Subnet Management',
      subtitle:
        'All proposals that administer network subnets, for example creating new subnets, adding and removing subnet nodes, and splitting subnets.'
    }
  },
  {
    id: 8,
    info: {
      title: 'Network Canister Management',
      subtitle:
        'Installing and upgrading “system” canisters that belong to the network. For example, upgrading the NNS.'
    }
  },
  {
    id: 9,
    info: {
      title: 'Kyc',
      subtitle:
        'Proposals that update KYC information for regulatory purposes, for example during the initial Genesis distribution of ICP in the form of neurons.'
    }
  },
  {
    id: 10,
    info: {
      title: 'Node Provider Rewards',
      subtitle: 'Proposals that reward node providers.'
    }
  },
  {
    id: 12,
    info: {
      title: 'Subnet Replica Version Management',
      subtitle: "Proposals handling updates of a subnet's replica version"
    }
  },
  {
    id: 13,
    info: {
      title: 'Replica Version Management',
      subtitle:
        'Proposals dealing with blessing and retirement of replica versions'
    }
  },
  {
    id: 2,
    info: {
      title: 'Exchange Rate',
      subtitle:
        'All proposals that provide “real time” information about the value of ICP, as measured by an IMF SDR, which allows the NNS to convert ICP to cycles (which power computation) at a rate which keeps their real world cost constant.'
    }
  }
];
