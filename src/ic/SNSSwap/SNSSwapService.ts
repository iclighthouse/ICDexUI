import Service, {
  ErrorRefundIcpRequest,
  ErrorRefundIcpResponse,
  GetBuyerStateRequest,
  GetBuyerStateResponse,
  GetBuyersTotalResponse,
  GetDerivedStateResponse,
  GetDerivedStateResponse1,
  GetInitResponse,
  GetLifecycleResponse,
  GetSaleParametersResponse,
  ListCommunityFundParticipantsResponse,
  ListDirectParticipantsResponse,
  ListRequest,
  ListSnsNeuronRecipesResponse,
  RefreshBuyerTokensRequest,
  RefreshBuyerTokensRequest1,
  RefreshBuyerTokensResponse
} from '@/ic/SNSSwap/model';
import { checkAuth } from '@/ic/CheckAuth';
import { buildService } from '@/ic/Service';
import { createIcxActor } from '@/ic/createIcxActor';
import { createPlugActor } from '@/ic/createPlugActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import store from '@/store';
import SNSSwapIDL from './SNSSwap.did';
import SNSSwap1IDL from './SNSSwap1.did';
import { GetStateResponse } from '@/ic/SNSSwap/model';
import { SerializableIC } from '@/ic/converter';

export class SNSSwapService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    let idl = SNSSwapIDL;
    const old = [
      'zcdfx-6iaaa-aaaaq-aaagq-cai',
      '2hx64-daaaa-aaaaq-aaana-cai',
      '7hi6i-7iaaa-aaaaq-aaaqq-cai'
    ];
    if (!old.includes(canisterId)) {
      idl = SNSSwap1IDL;
    }
    let service: Service;
    if (!isUpdate) {
      service = buildService(null, idl, canisterId);
    } else if ((window as any).icx) {
      service = await createIcxActor(idl, canisterId);
    } else if (priList[principal] === 'Plug') {
      service = await createPlugActor(idl, canisterId);
    } else if (priList[principal] === 'Infinity') {
      service = await createInfinityActor(idl, canisterId);
    } else {
      service = buildService(
        store.getters['common/getIdentity'],
        idl,
        canisterId
      );
    }
    return service;
  };
  public getState = async (canisterId: string): Promise<GetStateResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_state({});
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getBuyersTotal = async (
    canisterId: string
  ): Promise<GetBuyersTotalResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_buyers_total({});
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getDerivedState = async (
    canisterId: string
  ): Promise<GetDerivedStateResponse | GetDerivedStateResponse1> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_derived_state({});
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getBuyerState = async (
    canisterId: string,
    request: GetBuyerStateRequest
  ): Promise<GetBuyerStateResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_buyer_state(request);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public refreshBuyerTokens = async (
    canisterId: string,
    request: RefreshBuyerTokensRequest | RefreshBuyerTokensRequest1
  ): Promise<RefreshBuyerTokensResponse> => {
    const service = await this.check(canisterId, true, true);
    const res = await service.refresh_buyer_tokens(request);
    return SerializableIC(res);
  };
  public refundIcp = async (
    canisterId: string,
    request: ErrorRefundIcpRequest
  ): Promise<ErrorRefundIcpResponse> => {
    const service = await this.check(canisterId, true, true);
    try {
      const res = await service.error_refund_icp(request);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getLifecycle = async (
    canisterId: string
  ): Promise<GetLifecycleResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_lifecycle({});
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return { lifecycle: null };
    }
  };
  public getSaleParameters = async (
    canisterId: string
  ): Promise<GetSaleParametersResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_sale_parameters({});
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return { params: null };
    }
  };
  public listCommunityFundParticipants = async (
    canisterId: string,
    request: ListRequest = { offset: [], limit: [] }
  ): Promise<ListCommunityFundParticipantsResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.list_community_fund_participants(request);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return { cf_participants: null };
    }
  };
  public listDirectParticipants = async (
    canisterId: string,
    request: ListRequest = { offset: [], limit: [] }
  ): Promise<ListDirectParticipantsResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.list_direct_participants(request);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return { participants: null };
    }
  };
  public listSnsNeuronRecipes = async (
    canisterId: string,
    request: ListRequest = { offset: [], limit: [] }
  ): Promise<ListSnsNeuronRecipesResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.list_sns_neuron_recipes(request);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return { sns_neuron_recipes: null };
    }
  };
  public getInit = async (canisterId: string): Promise<GetInitResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_init({});
      return SerializableIC(res);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
