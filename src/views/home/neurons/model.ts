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
  /// The `Unspecified` topic is used as a fallback when
  /// following. That is, if no followees are specified for a given
  /// topic, the followees for this topic are used instead.
  Unspecified = 0,
  /// A special topic by means of which a neuron can be managed by the
  /// followees for this topic (in this case, there is no fallback to
  /// 'unspecified'). Votes on this topic are not included in the
  /// voting history of the neuron (cf., `recent_ballots` in `Neuron`).
  ///
  /// For proposals on this topic, only followees on the 'neuron
  /// management' topic of the neuron that the proposals pertains to
  /// are allowed to vote.
  ///
  /// As the set of eligible voters on this topic is restricted,
  /// proposals on this topic have a *short voting period*.
  NeuronManagement = 1,
  /// All proposals that provide “real time” information about the
  /// value of ICP, as measured by an IMF SDR, which allows the NNS to
  /// convert ICP to cycles (which power computation) at a rate which
  /// keeps their real world cost constant. Votes on this topic are not
  /// included in the voting history of the neuron (cf.,
  /// `recent_ballots` in `Neuron`).
  ///
  /// Proposals on this topic have a *short voting period* due to their
  /// frequency.
  ExchangeRate = 2,
  /// All proposals that administer network economics, for example,
  /// determining what rewards should be paid to node operators.
  NetworkEconomics = 3,
  /// All proposals that administer governance, for example to freeze
  /// malicious canisters that are harming the network.
  Governance = 4,
  /// All proposals that administer node machines, including, but not
  /// limited to, upgrading or configuring the OS, upgrading or
  /// configuring the virtual machine framework and upgrading or
  /// configuring the node replica software.
  NodeAdmin = 5,
  /// All proposals that administer network participants, for example,
  /// granting and revoking DCIDs (data center identities) or NOIDs
  /// (node operator identities).
  ParticipantManagement = 6,
  /// All proposals that administer network subnets, for example
  /// creating new subnets, adding and removing subnet nodes, and
  /// splitting subnets.
  SubnetManagement = 7,
  /// Installing and upgrading “system” canisters that belong to the network.
  /// For example, upgrading the NNS.
  NetworkCanisterManagement = 8,
  /// Proposals that update KYC information for regulatory purposes,
  /// for example during the initial Genesis distribution of ICP in the
  /// form of neurons.
  Kyc = 9,
  /// Topic for proposals to reward node providers.
  NodeProviderRewards = 10,
  /// IC OS upgrade proposals
  /// -----------------------
  /// ICP runs on a distributed network of nodes grouped into subnets. Each node runs a stack of
  /// operating systems, including HostOS (runs on bare metal) and GuestOS (runs inside HostOS;
  /// contains, e.g., the ICP replica process). HostOS and GuestOS are distributed via separate disk
  /// images. The umbrella term IC OS refers to the whole stack.
  ///
  /// The IC OS upgrade process involves two phases, where the first phase is the election of a new
  /// IC OS version and the second phase is the deployment of a previously elected IC OS version on
  /// all nodes of a subnet or on some number of nodes (including nodes comprising subnets and
  /// unassigned nodes).
  ///
  /// A special case is for API boundary nodes, special nodes that route API requests to a replica
  /// of the right subnet. API boundary nodes run a different process than the replica, but their
  /// executable is distributed via the same disk image as GuestOS. Therefore, electing a new GuestOS
  /// version also results in a new version of boundary node software being elected.
  ///
  /// Proposals handling the deployment of IC OS to some nodes. It is possible to deploy only
  /// the versions of IC OS that are in the set of elected IC OS versions.
  IcOsVersionDeployment = 12,
  /// Proposals for changing the set of elected IC OS versions.
  IcOsVersionElection = 13,
  /// Proposals related to SNS and Community Fund.
  SnsAndCommunityFund = 14,
  /// Proposals related to the management of API Boundary Nodes
  ApiBoundaryNodeManagement = 15,
  /// Proposals related to subnet rental.
  SubnetRental = 16,
  /// Proposals to manage protocol canisters. Those are canisters that are considered part of the IC
  /// protocol, without which the IC will not be able to function properly.
  ProtocolCanisterManagement = 17,
  /// Proposals related to Service Nervous System (SNS) - (1) upgrading SNS-W, (2) upgrading SNS
  /// Aggregator, and (3) adding WASM's or custom upgrade paths to SNS-W.
  ServiceNervousSystemManagement = 18
}
export const FunctionsName = {
  0: 'All Except Governance, and SNS & Community Fund',
  4: 'Governance',
  14: "SNS & Neurons' Fund",
  3: 'Network Economics',
  5: 'Node Admin',
  6: 'Participant Management',
  7: 'Subnet Management',
  8: 'System Canister Management',
  9: 'Kyc',
  10: 'Node Provider Rewards',
  12: 'IC OS Version Deployment',
  13: 'IC OS Version Election',
  15: 'API Boundary Node Management',
  16: 'Subnet Rental',
  1: 'Neuron Management',
  17: 'Protocol Canister Management',
  18: 'Service Nervous System Management',
  2: 'Exchange Rate'
};
export const AllTopicsId = [
  4, 14, 3, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 1, 17, 18, 2
];
export const AllTopicsIdExcludeRate = [
  4, 14, 3, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 17, 18
];
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
      title: 'System Canister Management',
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
      title: 'IC OS Version Deployment',
      subtitle: "Proposals handling updates of a subnet's replica version"
    }
  },
  {
    id: 13,
    info: {
      title: 'IC OS Version Election',
      subtitle:
        'Proposals dealing with blessing and retirement of replica versions'
    }
  },
  {
    id: 15,
    info: {
      title: 'API Boundary Node Management',
      subtitle: 'Proposals related to the management of API Boundary Nodes'
    }
  },
  {
    id: 16,
    info: {
      title: 'Subnet Rental',
      subtitle:
        'All proposals related to renting a subnet, for example a subnet rental request.'
    }
  },
  {
    id: 1,
    info: {
      title: 'Neuron Management',
      subtitle:
        "A special topic by means of which a neuron can be managed by the followees for this topic (in this case, there is no fallback to 'unspecified')."
    }
  },
  {
    id: 17,
    info: {
      title: 'Protocol Canister Management',
      subtitle:
        'Proposals to manage protocol canisters. Those are canisters that are considered part of the IC protocol, without which the IC will not be able to function properly.'
    }
  },
  {
    id: 18,
    info: {
      title: 'Service Nervous System Management',
      subtitle:
        "Proposals related to Service Nervous System (SNS) - (1) upgrading SNS-W, (2) upgrading SNS Aggregator, and (3) adding WASM's or custom upgrade paths to SNS-W."
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
