import { Principal } from '@dfinity/principal';
import { TokenIdentifier } from '@/ic/nft/model';
import { AccountId, Icrc1Account, Memo, SubAccount, Time, Txid } from '@/ic/common/icType';
import {
  DexSetting,
  IDORequirement,
  OrderPrice,
  OrderStatus,
  OrderType,
  Setting,
  TradingResult,
  TransferError
} from '@/ic/ICDex/model';
import { Config, PoolBalance } from '@/ic/makerPool/model';

export type NFT = [User, TokenIdentifier, BigInt, NFTType];
export type User = { principal: Principal; address: string };
export type NFTType =
  | { MARS: null }
  | {
      JUPITER: null;
    }
  | {
      URANUS: null;
    }
  | {
      UNKNOWN: null;
    }
  | {
      MERCURY: null;
    }
  | {
      NEPTUNE: null;
    }
  | {
      VENUS: null;
    }
  | {
      SATURN: null;
    }
  | {
      EARTH: null;
    };
export interface MakerCreateArg {
  creator: Array<AccountId>;
  spreadRate: bigint;
  allow:
    | {
        Private: null;
      }
    | {
        Public: null;
      };
  lowerLimit: bigint;
  threshold: bigint;
  upperLimit: bigint;
  name: string;
  pair: Principal;
  volFactor: bigint;
}
export interface TrieList {
  total: bigint;
  totalPage: bigint;
  data: Array<[Principal, Array<[Principal, AccountId]>]>;
}
export interface SysConfig {
  blackhole: Principal;
  creatingPairFee: bigint;
  aggregator: Principal;
  sysTokenFee: bigint;
  icDao: Principal;
  nftPlanetCards: Principal;
  creatingMakerFee: bigint;
  sysToken: Principal;
}
export interface EventTrieList {
  total: bigint;
  data: Array<[BlockHeight, [ICDexEvent, Time]]>;
  totalPage: bigint;
}
export type ICDexEvent =
  | {
      removeMaker: { maker: Principal; pair: Principal };
    }
  | {
      pairConfig: {
        setting: [] | [DexSetting];
        pair: Principal;
        drc205config: [] | [Setting];
      };
    }
  | { setICDexPairWasm: { size: bigint; version: string } }
  | {
      pairICTCDoneTO: {
        app: Principal;
        status: OrderStatus;
        callbacked: boolean;
        toid: bigint;
        completed: boolean;
      };
    }
  | {
      pairICTCDoneTT: {
        app: Principal;
        callbacked: boolean;
        toid: bigint;
        ttid: bigint;
        completed: boolean;
      };
    }
  | {
      makerTransactionLock: {
        act: { lock: null } | { unlock: null };
        maker: Principal;
      };
    }
  | { timerStart: { intervalSeconds: bigint } }
  | { pairChangeOwner: { pair: Principal; newOwner: Principal } }
  | {
      nftSetVipMaker: {
        rebateRate: bigint;
        pair: Principal;
        nftId: TokenIdentifier;
        vipMaker: string;
      };
    }
  | {
      nftTransferFrom: {
        result: TransferResponse;
        args: TransferRequest;
        nftId: TokenIdentifier;
        collId: Principal;
      };
    }
  | { pairCancelByTxid: { pair: Principal; txid: Txid } }
  | { addPairToList: { pair: Principal } }
  | {
      pairICTCBlockTO: {
        app: Principal;
        toid: bigint;
        completed: boolean;
      };
    }
  | {
      createMaker: {
        arg: {
          spreadRate: bigint;
          allow: { Private: null } | { Public: null };
          lowerLimit: bigint;
          threshold: bigint;
          upperLimit: bigint;
          name: string;
          pair: Principal;
          volFactor: bigint;
        };
        version: string;
        makerCanisterId: Principal;
      };
    }
  | { removePairFromList: { pair: Principal } }
  | {
      pairSetAuctionMode: {
        result: [boolean, AccountId];
        pair: Principal;
      };
    }
  | {
      makerSetControllers: {
        maker: Principal;
        controllers: Array<Principal>;
        pair: Principal;
      };
    }
  | {
      pairICTCSetAdmin: {
        act: { Add: null } | { Remove: null };
        app: Principal;
        admin: Principal;
      };
    }
  | {
      pairICTCClearLog: {
        app: Principal;
        expiration: [] | [bigint];
        forced: boolean;
      };
    }
  | {
      createPair: {
        initCycles: [] | [bigint];
        token0: Principal;
        token1: Principal;
        pairCanisterId: Principal;
        unitSize: [] | [bigint];
      };
    }
  | { makerDeleteGridOrder: { maker: Principal } }
  | { changeOwner: { newOwner: Principal } }
  | { nftRemoveVipMaker: { pair: Principal; vipMaker: string } }
  | { makerCancelAllOrders: { maker: Principal } }
  | {
      setPairControllers: {
        controllers: Array<Principal>;
        pair: Principal;
      };
    }
  | {
      makerDexWithdraw: {
        maker: Principal;
        result: [Amount, Amount];
        token0: Amount;
        token1: Amount;
      };
    }
  | {
      dexAddCompetition: {
        id: [] | [bigint];
        end: bigint;
        addPairs: Array<{
          dex: string;
          minCapital: bigint;
          canisterId: Principal;
          quoteToken: { token0: null } | { token1: null };
        }>;
        name: string;
        start: bigint;
      };
    }
  | {
      refundFee: {
        arg: TransferArgs;
        result: { Ok: bigint } | { Err: TransferError };
        token: Principal;
      };
    }
  | { pairTASetDescription: { desc: string; pair: Principal } }
  | {
      sysCall: {
        method: string;
        args: Uint8Array | number[];
        canister: Principal;
        reply: Uint8Array | number[];
      };
    }
  | {
      sysConfig: {
        blackhole: [] | [Principal];
        creatingPairFee: [] | [bigint];
        aggregator: [] | [Principal];
        sysTokenFee: [] | [bigint];
        icDao: [] | [Principal];
        nftPlanetCards: [] | [Principal];
        creatingMakerFee: [] | [bigint];
        sysToken: [] | [Principal];
      };
    }
  | {
      upgradePair: {
        pair: Principal;
        version: string;
        success: boolean;
      };
    }
  | {
      pairSetUpgradeMode: {
        mode: { All: null } | { Base: null };
        pair: Principal;
      };
    }
  | {
      reinstallPair: {
        pair: Principal;
        version: string;
        success: boolean;
      };
    }
  | {
      reinstallMaker: {
        maker: Principal;
        pair: Principal;
        completed: boolean;
        version: string;
      };
    }
  | {
      makerResetLocalBalance: { maker: Principal; balance: PoolBalance };
    }
  | {
      createPairByUser: {
        token0: Principal;
        token1: Principal;
        pairCanisterId: Principal;
      };
    }
  | {
      sysWithdraw: {
        to: Principal;
        token: Principal;
        value: bigint;
        txid: { txid: Txid } | { index: bigint };
      };
    }
  | {
      nftWithdraw: {
        result: TransferResponse;
        args: TransferRequest;
        nftId: TokenIdentifier;
        collId: Principal;
      };
    }
  | { initOrUpgrade: { version: string } }
  | { pairSync: { pair: Principal } }
  | {
      upgradeMaker: {
        maker: Principal;
        name: [] | [string];
        pair: Principal;
        completed: boolean;
        version: string;
      };
    }
  | {
      pairEnableStratOrder: {
        arg: { Enable: null } | { Disable: null };
        pair: Principal;
      };
    }
  | { makerSuspend: { maker: Principal } }
  | { sysCancelOrder: { pair: Principal; txid: [] | [Txid] } }
  | { pairStart: { pair: Principal; message: [] | [string] } }
  | {
      pairSetVipMaker: {
        rebateRate: bigint;
        pair: Principal;
        account: string;
      };
    }
  | {
      chargeFee: {
        arg: TransferFromArgs;
        result: { Ok: bigint } | { Err: TransferError };
        token: Principal;
      };
    }
  | {
      pairEnableIDOAndSetFunder: {
        pair: Principal;
        funder: [] | [Principal];
        _requirement: [] | [IDORequirement];
      };
    }
  | { makerCreateGridOrder: { maker: Principal } }
  | {
      pairICTCCompleteTO: {
        app: Principal;
        status: OrderStatus;
        toid: bigint;
        completed: boolean;
      };
    }
  | { makerStart: { maker: Principal } }
  | {
      pairFallbackByTxid: {
        result: boolean;
        pair: Principal;
        txid: Txid;
      };
    }
  | {
      pairSetOrderFail: {
        pair: Principal;
        txidHex: string;
        refundToken0: Amount;
        refundToken1: Amount;
      };
    }
  | { backupPairData: { pair: Principal; timestamp: Time } }
  | {
      pairICTCRedoTT: {
        app: Principal;
        toid: bigint;
        ttid: bigint;
        completed: boolean;
      };
    }
  | { setICDexMakerWasm: { size: bigint; version: string } }
  | {
      removePairDataSnapshot: {
        timeBefore: Time;
        pair: Principal;
      };
    }
  | {
      makerGlobalLock: {
        act: { lock: null } | { unlock: null };
        maker: Principal;
      };
    }
  | {
      pairSTOConfig: {
        pair: Principal;
        config: {
          gridMaxPerSide: [] | [bigint];
          stopLossCountMax: [] | [bigint];
          poFee1: [] | [bigint];
          poFee2: [] | [number];
          proCountMax: [] | [bigint];
          sloFee1: [] | [bigint];
          sloFee2: [] | [number];
        };
      };
    }
  | { recoveryPairData: { pair: Principal; timestamp: Time } }
  | { pairRemoveVipMaker: { pair: Principal; account: string } }
  | { makerConfig: { maker: Principal; config: Config } }
  | { timerStop: null }
  | {
      pairICTCRunTO: {
        app: Principal;
        result: [] | [OrderStatus];
        toid: bigint;
      };
    }
  | {
      sysTrade: {
        result: TradingResult;
        order: OrderPrice;
        pair: Principal;
        orderType: OrderType;
        tokenTxid: { txid: Txid } | { index: bigint };
      };
    }
  | {
      makerDexDeposit: {
        maker: Principal;
        result: [Amount, Amount];
        token0: Amount;
        token1: Amount;
      };
    }
  | { pairSuspend: { pair: Principal; message: [] | [string] } };
export interface TransferArgs {
  to: Icrc1Account;
  fee: [] | [bigint];
  memo: [] | [Uint8Array | number[]];
  from_subaccount: [] | [SubAccount];
  created_at_time: [] | [Time];
  amount: bigint;
}
export type TransferResponse =
  | { ok: bigint }
  | {
      err:
        | { CannotNotify: string }
        | { InsufficientBalance: null }
        | { InvalidToken: TokenIdentifier }
        | { Rejected: null }
        | { Unauthorized: string }
        | { Other: string };
    };
export type Amount = bigint;
export type BlockHeight = bigint;
export interface TransferRequest {
  to: User;
  token: TokenIdentifier;
  notify: boolean;
  from: User;
  memo: Memo;
  subaccount: [] | [SubAccount];
  amount: bigint;
}
export interface TransferFromArgs {
  to: Icrc1Account;
  fee: [] | [bigint];
  spender_subaccount: [] | [Uint8Array | number[]];
  from: Icrc1Account;
  memo: [] | [Uint8Array | number[]];
  created_at_time: [] | [bigint];
  amount: bigint;
}

export default interface Service {
  NFTDeposit(
    principal: Principal,
    tokenIdentifier: string,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  NFTBindMaker(
    tokenIdentifier: string,
    principal: Principal,
    accountId: Array<number>,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  NFTBalance(address: string): Promise<Array<NFT>>;
  maker_create(makerCreateArg: MakerCreateArg): Promise<Principal>;
  NFTWithdraw(
    tokenIdentifier: Array<TokenIdentifier>,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  NFTBindingMakers(
    tokenIdentifier: TokenIdentifier
  ): Promise<Array<[Principal, AccountId]>>;
  NFTUnbindMaker(
    tokenIdentifier: TokenIdentifier,
    principal: Principal,
    accountId: Array<number>,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  maker_getPublicMakers(
    pair: Array<Principal>,
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<TrieList>;
  maker_getPrivateMakers(
    AccountId: Array<number>,
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<TrieList>;
  sys_getConfig(): Promise<SysConfig>;
  pubCreate(
    token0: Principal,
    token1: Principal,
    time: Time
  ): Promise<Principal>;
  version(): Promise<string>;
  getICDexPairWasmVersion(): Promise<[string, bigint]>;
  getICDexMakerWasmVersion(): Promise<[string, bigint]>;
  getVipMakers(
    account: Array<Principal>
  ): Promise<Array<[Principal, AccountId]>>;
  get_events(page: Array<bigint>, size: Array<bigint>): Promise<EventTrieList>;
}
