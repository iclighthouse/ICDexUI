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
  '2': 'Goerli'
  // '3': 'Sepolia'
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
    name: 'Goerli Testnet',
    logo: require('@/assets/img/goerlieth.svg')
  }
  // {
  //   id: '3',
  //   name: 'Sepolia Testnet',
  //   logo: require('@/assets/img/seth.svg')
  // }
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
    tokenId: 'mxzaz-hqaaa-aaaar-qaada-cai',
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
  | 'retrieveCKETH';
export interface Active {
  claim?: Array<ClaimActive>; // method2 claim step1
  claim2?: Array<ClaimActive>; // method2 claim step2
  mint?: Array<MintActive>; // method1 mint step1
  deposit?: [Wei, Array<TxIndex>, Array<TxStatus>]; // method1 mint step2
  retrieve?: Array<RetrieveActive>; // retrieve step1
  retrieve2?: [TxIndex, TxStatus, Time]; // retrieve step2
  mintCKETH?: Array<ClaimActive>; // ckETH mint
  retrieveCKETH?: Array<RetrieveActive>; // ckETH retrieve
  CKETHResponse?: Array<ClaimCKETHActiveResponse | RetrieveActiveResponse>;
}
export interface RetrieveActive {
  tokenId: string;
  amount: string;
  status?: RetrieveEthStatus;
}
export interface MintActive {
  tokenId: string;
  amount: string;
}
export interface ClaimActive {
  tokenId: string;
  txHash: string;
}
export interface ClaimCKETHActive {
  amount: string;
  txHash: string;
  tokenId: string;
  blockNumber: string;
}
export interface ClaimCKETHActiveResponse {
  amount: string;
  txHash: string;
  tokenId: string;
  blockNumber: string;
  type: string;
}
export interface RetrieveActiveResponse {
  tokenId: string;
  amount: string;
  status?: RetrieveEthStatus;
  type: string;
}
