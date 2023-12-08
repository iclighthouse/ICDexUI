import Service, {
  Amount,
  ClaimOrRefreshResponse,
  GetMetadataResponse,
  GetNeuronResponse,
  GetProposal,
  GetProposalResponse,
  GovernanceError,
  ListNervousSystemFunctionsResponse,
  ListNeurons,
  ListNeuronsResponse,
  ListProposals,
  ListProposalsResponse,
  NervousSystemParameters,
  Proposal,
  ProposalId,
  SNSManageNeuron,
  SNSManageNeuronResponse,
  SNSNeuronId
} from '@/ic/SNSGovernance/model';
import SNSGovernanceIDL from './SNSGovernance.did';
import SNSGovernanceSNS1IDL from './SNSGovernanceSNS1.did';
import { fromSubAccountId, SerializableIC } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { Icrc1Account } from '@/ic/common/icType';
import { createService } from '@/ic/createService';

export class SNSGovernanceService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    let idl = SNSGovernanceIDL;
    if (canisterId === 'zqfso-syaaa-aaaaq-aaafq-cai') {
      idl = SNSGovernanceSNS1IDL;
    }
    return await createService<Service>(canisterId, idl, renew, isUpdate);
  };
  public getMetadata = async (
    canisterId: string
  ): Promise<GetMetadataResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_metadata({});
      return SerializableIC(res);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public listSNSNeurons = async (
    canisterId: string,
    request: ListNeurons
  ): Promise<ListNeuronsResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.list_neurons(request);
      return SerializableIC(res);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getNeuron = async (
    canisterId: string,
    request: Array<SNSNeuronId>
  ): Promise<GetNeuronResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_neuron({ neuron_id: request });
      return SerializableIC(res);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getNervousSystemParameters = async (
    canisterId: string
  ): Promise<NervousSystemParameters> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_nervous_system_parameters(null);
      return SerializableIC(res);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public refreshNeuronByAccount = async (
    canisterId: string,
    controller: Array<Principal>,
    memo: bigint,
    subAccountId = 0
  ): Promise<Array<SNSNeuronId>> => {
    const service = await this.check(canisterId, true, true);
    return new Promise((resolve, reject) => {
      let subAccount = [];
      if (subAccountId || subAccountId === 0) {
        subAccount = fromSubAccountId(subAccountId);
      }
      const request: SNSManageNeuron = {
        subaccount: subAccount,
        command: [
          {
            ClaimOrRefresh: {
              by: [
                { MemoAndController: { controller: controller, memo: memo } }
              ]
            }
          }
        ]
      };
      service
        .manage_neuron(request)
        .then((response: SNSManageNeuronResponse) => {
          response = SerializableIC(response);
          const command = response.command[0];
          if ((command as { Error: GovernanceError }).Error) {
            reject((command as { Error: GovernanceError }).Error);
          } else {
            resolve(
              (command as { ClaimOrRefresh: ClaimOrRefreshResponse })
                .ClaimOrRefresh.refreshed_neuron_id
            );
          }
        });
    });
  };
  public refreshNeuronById = async (
    canisterId: string,
    neuronId: Array<number>
  ): Promise<Array<SNSNeuronId>> => {
    const service = await this.check(canisterId, true, true);
    return new Promise((resolve, reject) => {
      const request: SNSManageNeuron = {
        subaccount: neuronId,
        command: [
          {
            ClaimOrRefresh: {
              by: [{ NeuronId: {} }]
            }
          }
        ]
      };
      service
        .manage_neuron(request)
        .then((response: SNSManageNeuronResponse) => {
          response = SerializableIC(response);
          const command = response.command[0];
          if ((command as { Error: GovernanceError }).Error) {
            reject((command as { Error: GovernanceError }).Error);
          } else {
            resolve(
              (command as { ClaimOrRefresh: ClaimOrRefreshResponse })
                .ClaimOrRefresh.refreshed_neuron_id
            );
          }
        });
    });
  };
  public setDissolveDelay = async (
    canisterId: string,
    dissolveTimestampSeconds: bigint,
    neuronId: Array<number>
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          Configure: {
            operation: [
              {
                IncreaseDissolveDelay: {
                  additional_dissolve_delay_seconds: dissolveTimestampSeconds
                }
              }
            ]
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public startDissolve = async (
    canisterId: string,
    neuronId: Array<number>
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
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
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public stopDissolve = async (
    canisterId: string,
    neuronId: Array<number>
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
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
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public split = async (
    canisterId: string,
    neuronId: Array<number>,
    amount: bigint,
    memo: bigint
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          Split: {
            memo: memo,
            amount_e8s: amount
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public Disburse = async (
    canisterId: string,
    neuronId: Array<number>,
    amount: Array<Amount> = [],
    toAccount: Array<Icrc1Account> = []
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          Disburse: {
            to_account: toAccount,
            amount: amount
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public listNervousSystemFunctions = async (
    canisterId: string
  ): Promise<ListNervousSystemFunctionsResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.list_nervous_system_functions();
      return SerializableIC(res);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public setFollowees = async (
    canisterId: string,
    neuronId: Array<number>,
    functionId: bigint,
    followees: Array<SNSNeuronId>
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          Follow: {
            function_id: functionId,
            followees: followees
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public addNeuronPermissions = async (
    canisterId: string,
    neuronId: Array<number>,
    permissionsPrincipal: Principal,
    permissionsId: Array<bigint>
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          AddNeuronPermissions: {
            permissions_to_add: [{ permissions: permissionsId }],
            principal_id: [permissionsPrincipal]
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public removeNeuronPermissions = async (
    canisterId: string,
    neuronId: Array<number>,
    permissionsPrincipal: Principal,
    permissionsId: Array<bigint>
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          RemoveNeuronPermissions: {
            permissions_to_remove: [{ permissions: permissionsId }],
            principal_id: [permissionsPrincipal]
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public changeAutoStakeMaturity = async (
    canisterId: string,
    autoStakeMaturity: boolean,
    neuronId: Array<number>
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          Configure: {
            operation: [
              {
                ChangeAutoStakeMaturity: {
                  requested_setting_for_auto_stake_maturity: autoStakeMaturity
                }
              }
            ]
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public disburseMaturity = async (
    canisterId: string,
    neuronId: Array<number>,
    toAccount: Array<{
      owner: Array<Principal>;
      subaccount: Array<{ subaccount: Array<number> }>;
    }> = [],
    percentageToDisburse = BigInt(100)
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          DisburseMaturity: {
            to_account: toAccount,
            percentage_to_disburse: percentageToDisburse
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public stakeMaturity = async (
    canisterId: string,
    neuronId: Array<number>,
    percentageToStake = BigInt(100)
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          StakeMaturity: {
            percentage_to_stake: [percentageToStake]
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public listProposals = async (
    canisterId: string,
    request: ListProposals
  ): Promise<ListProposalsResponse> => {
    const service = await this.check(canisterId, true, false);
    const res = await service.list_proposals(request);
    return SerializableIC(res);
  };
  public getProposal = async (
    canisterId: string,
    request: GetProposal
  ): Promise<GetProposalResponse> => {
    const service = await this.check(canisterId, true, false);
    const res = await service.get_proposal(request);
    return SerializableIC(res);
  };
  public vote = async (
    canisterId: string,
    vote: number,
    proposalId: Array<ProposalId>,
    neuronId: Array<number>
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          RegisterVote: {
            vote: vote,
            proposal: proposalId
          }
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
  public makerProposal = async (
    canisterId: string,
    neuronId: Array<number>,
    proposal: Proposal
  ): Promise<SNSManageNeuronResponse> => {
    const service = await this.check(canisterId, true, true);
    const request: SNSManageNeuron = {
      subaccount: neuronId,
      command: [
        {
          MakeProposal: proposal
        }
      ]
    };
    const res = await service.manage_neuron(request);
    return SerializableIC(res);
  };
}
