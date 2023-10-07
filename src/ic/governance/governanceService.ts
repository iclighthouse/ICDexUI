import Service, {
  Result_2,
  Result_3,
  ManageNeuron,
  GovernanceError,
  ClaimOrRefreshResponse,
  IncreaseDissolveDelayRequest,
  DisburseRequest,
  DisburseResponse,
  ClaimOrRefreshNeuronFromAccount,
  SplitRequest,
  SpawnResponse,
  ProposalInfo,
  listProposalsReq,
  ListProposalInfoResponse,
  ListNeurons,
  ListNeuronsResponse,
  NetworkEconomics,
  StakeMaturityResponse,
  ManageNeuronResponse,
  ListKnownNeuronsResponse,
  Proposal
} from './model';
// @ts-ignore
import governanceIDL from './governance.did';
import { GOVERNANCE_CANISTER_ID } from '@/ic/utils';
import { NeuronId } from '@/ic/common/icType';
import { buildService } from '../Service';
import { checkAuth } from '@/ic/CheckAuth';
import store from '@/store';
import { createPlugActor } from '@/ic/createPlugActor';
import { createIcxActor } from '@/ic/createIcxActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { Principal } from '@dfinity/principal/lib/cjs';
import { SerializableIC } from '@/ic/converter';

export class GovernanceService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth();
    }
    if ((window as any).icx) {
      this.service = await createIcxActor(
        governanceIDL,
        GOVERNANCE_CANISTER_ID
      );
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(
        governanceIDL,
        GOVERNANCE_CANISTER_ID
      );
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(
        governanceIDL,
        GOVERNANCE_CANISTER_ID
      );
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        governanceIDL,
        GOVERNANCE_CANISTER_ID
      );
    }
  };
  public getFullNeuron = async (request: NeuronId): Promise<Result_2> => {
    await this.check();
    const res = await this.service.get_full_neuron(request);
    return SerializableIC(res);
  };
  public getNeuronIds = async (): Promise<Array<NeuronId>> => {
    await this.check();
    const res = await this.service.get_neuron_ids();
    return SerializableIC(res);
  };
  public getNeuronInfo = async (request: NeuronId): Promise<Result_3> => {
    await this.check();
    const res = await this.service.get_neuron_info(request);
    return SerializableIC(res);
  };
  public refreshNeuronById = (
    neuronId: bigint
  ): Promise<ClaimOrRefreshResponse> => {
    return new Promise((resolve, reject) => {
      this.check().then(() => {
        const request: ManageNeuron = {
          id: [{ id: neuronId }],
          command: [
            {
              ClaimOrRefresh: { by: [{ NeuronIdOrSubaccount: {} }] }
            }
          ],
          neuron_id_or_subaccount: []
        };
        this.service.manage_neuron(request).then((response) => {
          response = SerializableIC(response);
          const command = response.command[0];
          if ((command as { Error: GovernanceError }).Error) {
            reject((command as { Error: GovernanceError }).Error);
          } else {
            resolve(
              (command as { ClaimOrRefresh: ClaimOrRefreshResponse })
                .ClaimOrRefresh
            );
          }
        });
      });
    });
  };
  public increaseDissolveDelay = async (
    increaseDissolveDelayRequest: IncreaseDissolveDelayRequest
  ): Promise<{}> => {
    await this.check();
    const request: ManageNeuron = {
      id: [{ id: increaseDissolveDelayRequest.neuronId }],
      command: [
        {
          Configure: {
            operation: [
              {
                IncreaseDissolveDelay: {
                  additional_dissolve_delay_seconds:
                    increaseDissolveDelayRequest.additionalDissolveDelaySeconds
                }
              }
            ]
          }
        }
      ],
      neuron_id_or_subaccount: []
    };
    return this.service.manage_neuron(request);
  };
  public startDissolving = async (neuronId: bigint): Promise<{}> => {
    await this.check();
    const request: ManageNeuron = {
      id: [{ id: neuronId }],
      command: [
        {
          Configure: {
            operation: [
              {
                StartDissolving: {}
              }
            ]
          }
        }
      ],
      neuron_id_or_subaccount: []
    };
    return this.service.manage_neuron(request);
  };
  public stopDissolving = async (neuronId: bigint): Promise<{}> => {
    await this.check();
    const request: ManageNeuron = {
      id: [{ id: neuronId }],
      command: [
        {
          Configure: {
            operation: [
              {
                StopDissolving: {}
              }
            ]
          }
        }
      ],
      neuron_id_or_subaccount: []
    };
    return this.service.manage_neuron(request);
  };
  public disburse = async (
    disburseRequest: DisburseRequest
  ): Promise<DisburseResponse> => {
    return new Promise((resolve, reject) => {
      this.check().then(() => {
        const request: ManageNeuron = {
          id: [{ id: disburseRequest.neuronId }],
          command: [
            {
              Disburse: {
                to_account: [
                  {
                    hash: disburseRequest.toAccount
                  }
                ],
                amount: []
              }
            }
          ],
          neuron_id_or_subaccount: []
        };
        this.service.manage_neuron(request).then((response) => {
          const command = response.command[0];
          if ((command as { Error: GovernanceError }).Error) {
            reject((command as { Error: GovernanceError }).Error);
          } else {
            resolve((command as { Disburse: DisburseResponse }).Disburse);
          }
        });
      });
    });
  };
  public refreshNeuronFromAccount = async (
    request: ClaimOrRefreshNeuronFromAccount
  ): Promise<bigint> => {
    return new Promise((resolve, reject) => {
      this.check().then(() => {
        this.service
          .claim_or_refresh_neuron_from_account(request)
          .then((response) => {
            const result = response.result[0];
            if ((result as { Error: GovernanceError }).Error) {
              reject((result as { Error: GovernanceError }).Error);
            } else {
              resolve((result as { NeuronId: { id: bigint } }).NeuronId.id);
            }
          });
      });
    });
  };
  public splitNeuron = async (
    splitRequest: SplitRequest
  ): Promise<SpawnResponse> => {
    return new Promise((resolve, reject) => {
      this.check().then(() => {
        const request: ManageNeuron = {
          id: [{ id: splitRequest.neuronId }],
          command: [
            {
              Split: {
                amount_e8s: splitRequest.amount
              }
            }
          ],
          neuron_id_or_subaccount: []
        };
        this.service.manage_neuron(request).then((response) => {
          const command = response.command[0];
          if ((command as { Error: GovernanceError }).Error) {
            reject((command as { Error: GovernanceError }).Error);
          } else {
            resolve((command as { Split: SpawnResponse }).Split);
          }
        });
      });
    });
  };
  public spawn = async (neuronId): Promise<SpawnResponse> => {
    return new Promise((resolve, reject) => {
      this.check().then(() => {
        const request: ManageNeuron = {
          id: [{ id: neuronId }],
          command: [
            {
              Spawn: {
                new_controller: [],
                percentage_to_spawn: [],
                nonce: []
              }
            }
          ],
          neuron_id_or_subaccount: []
        };
        this.service.manage_neuron(request).then((response) => {
          const command = response.command[0];
          if ((command as { Error: GovernanceError }).Error) {
            reject((command as { Error: GovernanceError }).Error);
          } else {
            resolve((command as { Spawn: SpawnResponse }).Spawn);
          }
        });
      });
    });
  };
  public getProposalInfo = async (
    proposalId: bigint
  ): Promise<Array<ProposalInfo>> => {
    await this.check();
    const res = await this.service.get_proposal_info(proposalId);
    return SerializableIC(res);
  };
  public listProposals = async (
    request: listProposalsReq
  ): Promise<ListProposalInfoResponse> => {
    if (!request.omit_large_fields) {
      request.omit_large_fields = [];
    }
    await this.check();
    const res = await this.service.list_proposals(request);
    return SerializableIC(res);
  };
  public listNeurons = async (
    request: ListNeurons
  ): Promise<ListNeuronsResponse> => {
    await this.check();
    try {
      const res = await this.service.list_neurons(request);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
    }
    return null;
  };
  public getNetworkEconomicsParameters =
    async (): Promise<NetworkEconomics> => {
      await this.check();
      try {
        const res = await this.service.get_network_economics_parameters();
        return SerializableIC(res);
      } catch (e) {
        console.log(e);
      }
      return null;
    };
  public stakeMaturity = async (
    neuronId: bigint,
    percentageToStake = BigInt(100)
  ): Promise<StakeMaturityResponse> => {
    console.log(neuronId, percentageToStake);
    return new Promise((resolve, reject) => {
      this.check().then(() => {
        const request: ManageNeuron = {
          id: [{ id: neuronId }],
          command: [
            {
              StakeMaturity: {
                percentage_to_stake: [percentageToStake]
              }
            }
          ],
          neuron_id_or_subaccount: []
        };
        console.log(request);
        this.service.manage_neuron(request).then((response) => {
          const command = response.command[0];
          if ((command as { Error: GovernanceError }).Error) {
            reject((command as { Error: GovernanceError }).Error);
          } else {
            resolve(
              (command as { StakeMaturity: StakeMaturityResponse })
                .StakeMaturity
            );
          }
        });
      });
    });
  };
  public changeAutoStakeMaturity = async (
    neuronId: bigint,
    changeAutoStakeMaturity: boolean
  ): Promise<ManageNeuronResponse> => {
    await this.check();
    const request: ManageNeuron = {
      id: [{ id: neuronId }],
      command: [
        {
          Configure: {
            operation: [
              {
                ChangeAutoStakeMaturity: {
                  requested_setting_for_auto_stake_maturity:
                    changeAutoStakeMaturity
                }
              }
            ]
          }
        }
      ],
      neuron_id_or_subaccount: []
    };
    try {
      return await this.service.manage_neuron(request);
    } catch (e) {
      return null;
    }
  };
  public listKnownNeurons = async (): Promise<ListKnownNeuronsResponse> => {
    await this.check();
    try {
      const res = await this.service.list_known_neurons();
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public setFollow = async (
    neuronId: bigint,
    topic: bigint,
    followees: Array<{ id: bigint }>
  ): Promise<ManageNeuronResponse> => {
    await this.check();
    try {
      const request: ManageNeuron = {
        id: [{ id: neuronId }],
        command: [
          {
            Follow: {
              topic: topic,
              followees: followees
            }
          }
        ],
        neuron_id_or_subaccount: []
      };
      return await this.service.manage_neuron(request);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public addHotKey = async (
    neuronId: bigint,
    principal: string
  ): Promise<ManageNeuronResponse> => {
    await this.check();
    try {
      const request: ManageNeuron = {
        id: [{ id: neuronId }],
        command: [
          {
            Configure: {
              operation: [
                {
                  AddHotKey: {
                    new_hot_key: [Principal.from(principal)]
                  }
                }
              ]
            }
          }
        ],
        neuron_id_or_subaccount: []
      };
      const res = await this.service.manage_neuron(request);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public removeHotKey = async (
    neuronId: bigint,
    principal: string
  ): Promise<ManageNeuronResponse> => {
    await this.check();
    try {
      const request: ManageNeuron = {
        id: [{ id: neuronId }],
        command: [
          {
            Configure: {
              operation: [
                {
                  RemoveHotKey: {
                    hot_key_to_remove: [Principal.from(principal)]
                  }
                }
              ]
            }
          }
        ],
        neuron_id_or_subaccount: []
      };
      const res = await this.service.manage_neuron(request);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public vote = async (
    neuronId: bigint,
    vote: number,
    proposalId: Array<{ id: bigint }>
  ): Promise<ManageNeuronResponse> => {
    await this.check();
    try {
      const request: ManageNeuron = {
        id: [{ id: neuronId }],
        command: [
          {
            RegisterVote: {
              vote: vote,
              proposal: proposalId
            }
          }
        ],
        neuron_id_or_subaccount: []
      };
      const res = await this.service.manage_neuron(request);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public makeProposal = async (
    neuronId: bigint,
    proposal: Proposal
  ): Promise<ManageNeuronResponse> => {
    await this.check();
    try {
      const request: ManageNeuron = {
        id: [{ id: neuronId }],
        command: [
          {
            MakeProposal: proposal
          }
        ],
        neuron_id_or_subaccount: []
      };
      const res = await this.service.manage_neuron(request);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
