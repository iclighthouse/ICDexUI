import { TokenItem } from '@/ic/ICLighthouse/model';
import { Txid } from '@/ic/ICLighthouseToken/model';
import {
  IcTokenInfo,
  RetrieveEthStatus,
  TxIndex,
  TxStatus,
  Wei,
  WithdrawErc20Response
} from '@/ic/ckETHMinter/model';
import { Time } from '@/ic/common/icType';
import { CK_BTC_CANISTER_ID } from '@/ic/utils';
import { RetrieveBtcStatus } from '@/ic/ckbtcMinter/model';
export type SettingType = 'Modify' | 'Update';
export interface AddTokenItem extends TokenItem {
  balance: string;
  logo?: string;
  lockedTxns?: {
    txns: Array<Txid>;
    lockedBalance: string;
  };
  approvals?: number;
  transactions?: string;
  coinSeconds?: string;
  balance1?: string;
  lockedTxns1?: {
    txns: Array<Txid>;
    lockedBalance: string;
  };
  approvals1?: number;
  transactions1?: string;
  coinSeconds1?: string;
}
export class AddTokenItemClass {
  public balance = '-';
  public canisterId = null;
  public decimals = 0;
  public name = '';
  public symbol = '';
  public logo = '';
  public standard = '';
  public lockedTxns = {
    txns: [],
    lockedBalance: '0'
  };
  public approvals = 0;
  public transactions = '0';
  public coinSeconds = null;
  public balance1? = '-';
  public lockedTxns1? = {
    txns: [],
    lockedBalance: '0'
  };
  public approvals1? = 0;
  public transactions1? = '0';
  public coinSeconds1? = null;
}
export enum TokenStandard {
  'DRC20' = 'DRC20',
  'DIP20' = 'DIP20',
  'ICRC-1' = 'ICRC-1',
  'ICRC-2' = 'ICRC-2'
}
export enum AddTokenStandard {
  'DRC20' = 'DRC20',
  'DIP20' = 'DIP20',
  'ICRC-1' = 'ICRC-1'
}
export enum BTCTypeEnum {
  'icBTC' = 'icBTC',
  'ckBTC' = 'ckBTC'
}
// export enum ETHTypeEnum {
//   'icBTC' = 'icBTC',
//   'ckBTC' = 'ckBTC'
// }
export const networkIds = {
  '-1': 'IC Network',
  '0': 'Bitcoin',
  '1': 'Ethereum Mainnet',
  '2': 'Sepolia'
};
export const networkList = [
  {
    id: '-1',
    name: 'IC Network',
    logo: require('@/assets/img/dfinity.png')
  },
  {
    id: '0',
    name: 'Bitcoin',
    logo: require('@/assets/img/bitcoin.svg')
  },
  {
    id: '1',
    name: 'Ethereum Mainnet',
    logo: require('@/assets/img/ethereum.svg')
  },
  {
    id: '2',
    name: 'Sepolia Testnet',
    logo: require('@/assets/img/seth.svg')
  }
];
export interface ICNetworkTokensInterface {
  id: string;
  networkId: string;
  networkToIcId: string;
  symbol: string;
  name?: string;
  logo?: '';
  tokenId?: string;
  icTokenInfo?: IcTokenInfo;
}
export const networkTokens: Array<ICNetworkTokensInterface> = [
  {
    id: '0',
    networkId: '0',
    networkToIcId: '-1',
    symbol: 'BTC',
    tokenId: 'btc',
    logo: require('@/assets/img/bitcoin.svg')
  },
  {
    id: '0',
    networkId: '-1',
    networkToIcId: '0',
    symbol: 'ckBTC',
    name: 'ckBTC',
    tokenId: CK_BTC_CANISTER_ID,
    icTokenInfo: null,
    logo: require('@/assets/img/ckBTC.svg')
  },
  {
    id: '0',
    networkId: '-1',
    networkToIcId: '0',
    symbol: 'icBTC',
    name: 'icBTC (PR)',
    tokenId: '3fwop-7iaaa-aaaak-adzca-cai',
    icTokenInfo: null,
    logo: require('@/assets/img/ckBTC.svg')
  }
];
export type ActiveType =
  | 'claim'
  | 'claim2'
  | 'mint'
  | 'deposit'
  | 'retrieve'
  | 'retrieve2'
  | 'dexMint'
  | 'dexRetrieve'
  | 'mintCKETH'
  | 'retrieveCKETH'
  | 'mintCKBTC'
  | 'BTCRetrieve';
export interface Active {
  claim?: Array<ClaimActive>; // method2 claim step1
  claim2?: Array<ClaimActive>; // method2 claim step2
  mint?: Array<MintActive>; // method1 mint step1
  deposit?: Array<TxStatus>; // method1 mint step2
  retrieve?: Array<RetrieveActive>; // retrieve step1
  retrieve2?: Array<RetrieveActive>; // retrieve step2
  mintCKETH?: Array<ClaimActive>; // ckETH mint
  retrieveCKETH?: Array<RetrieveActive>; // ckETH retrieve
  CKETHResponse?: Array<CKETHResponse>;
}
export type CKETHResponse =
  | ClaimCKETHActiveResponse
  | RetrieveActiveResponse
  | MintCKBTCResponse
  | RetrieveCKBTCResponse
  | ClaimActive
  | MintActive
  | TxStatus; // method1
export interface RetrieveActive {
  tokenId: string;
  amount: string;
  status?: RetrieveEthStatus;
  time: number;
  type?: string;
}
export interface MintActive {
  tokenId: string;
  amount: string;
  status?: localStatus;
  time: string;
  type?: string;
}
export interface ClaimActive {
  tokenId: string;
  txHash: string;
  amount?: string;
  status?: localStatus;
  type?: string;
  time: string;
}
export interface ClaimCKETHActive {
  amount: string;
  txHash: string;
  tokenId: string;
  blockNumber: string;
  time: number;
  status?: localStatus;
}
export interface ClaimCKETHActiveResponse {
  amount: string;
  txHash: string;
  tokenId: string;
  blockNumber: string;
  type: string;
  time: number;
  FinalizedTime?: number;
  status?: localStatus;
}
export interface RetrieveActiveResponse {
  tokenId: string;
  amount: string;
  status?: RetrieveEthStatus;
  type: string;
  time: number;
}
export interface RetrieveCKBTCResponse {
  blockIndex: string;
  status: RetrieveBtcStatus;
  time: string;
  BTCBlock?: number;
  tokenId?: string;
  amount?: string;
  type: string;
}
export interface MintCKBTCResponse {
  txid: string;
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      valuecommitment: string;
      assetcommitment: string;
    };
    scriptsig: string;
    scriptsig_asm: string;
    witness: [string, string];
    is_coinbase: boolean;
    sequence: number;
    is_pegin: boolean;
    issuance: {
      asset_id: string;
      is_reissuance: boolean;
      contract_hash: string;
      asset_entropy: string;
      assetamountcommitment: string;
      tokenamountcommitment: string;
    };
  }>;
  vout: Array<
    | {
        scriptpubkey: string;
        scriptpubkey_asm: string;
        scriptpubkey_type: string;
        scriptpubkey_address: string;
        valuecommitment: string;
        assetcommitment: string;
      }
    | {
        scriptpubkey: string;
        scriptpubkey_asm: string;
        scriptpubkey_type: string;
        value: number;
        asset: string;
      }
  >;
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  type: string;
  time: string;
}
export type localStatus =
  | {
      Pending: null;
    }
  | {
      Submitted: null;
    }
  | {
      Confirmed: null;
    };
