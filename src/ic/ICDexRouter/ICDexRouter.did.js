export default ({ IDL }) => {
  const Address = IDL.Text;
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier
  });
  const TokenIdentifier = IDL.Text;
  const Balance = IDL.Nat;
  const NFTType = IDL.Variant({
    MARS: IDL.Null,
    JUPITER: IDL.Null,
    URANUS: IDL.Null,
    UNKNOWN: IDL.Null,
    MERCURY: IDL.Null,
    NEPTUNE: IDL.Null,
    VENUS: IDL.Null,
    SATURN: IDL.Null,
    EARTH: IDL.Null
  });
  const CollectionId = IDL.Principal;
  const NFT = IDL.Tuple(User, TokenIdentifier, Balance, NFTType, CollectionId);
  const AccountId = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat;
  const Time = IDL.Int;
  const PairCanister = IDL.Principal;
  const definite_canister_settings = IDL.Record({
    freezing_threshold: IDL.Nat,
    controllers: IDL.Vec(IDL.Principal),
    memory_allocation: IDL.Nat,
    compute_allocation: IDL.Nat
  });
  const canister_status = IDL.Record({
    status: IDL.Variant({
      stopped: IDL.Null,
      stopping: IDL.Null,
      running: IDL.Null
    }),
    memory_size: IDL.Nat,
    cycles: IDL.Nat,
    settings: definite_canister_settings,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const DRC207Support = IDL.Record({
    timer: IDL.Record({
      interval_seconds: IDL.Opt(IDL.Nat),
      enable: IDL.Bool
    }),
    monitorable_by_self: IDL.Bool,
    monitorable_by_blackhole: IDL.Record({
      canister_id: IDL.Opt(IDL.Principal),
      allowed: IDL.Bool
    }),
    cycles_receivable: IDL.Bool
  });
  const TokenSymbol = IDL.Text;
  const TokenStd__1 = IDL.Variant({
    dft: IDL.Null,
    ext: IDL.Null,
    icp: IDL.Null,
    other: IDL.Text,
    cycles: IDL.Null,
    ledger: IDL.Null,
    icrc1: IDL.Null,
    dip20: IDL.Null,
    drc20: IDL.Null
  });
  const TokenInfo = IDL.Tuple(IDL.Principal, TokenSymbol, TokenStd__1);
  const DexName = IDL.Text;
  const PairCanister__1 = IDL.Principal;
  const SwapPair = IDL.Record({
    feeRate: IDL.Float64,
    token0: TokenInfo,
    token1: TokenInfo,
    dexName: DexName,
    canisterId: PairCanister__1
  });
  const TrieList__1_2 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(PairCanister, SwapPair)),
    totalPage: IDL.Nat
  });
  const TokenInfo__1 = IDL.Tuple(IDL.Principal, TokenSymbol, TokenStd__1);
  const IcpE8s = IDL.Nat;
  const DexConfig = IDL.Record({
    MAX_TPS: IDL.Opt(IDL.Nat),
    ICTC_RUN_INTERVAL: IDL.Opt(IDL.Nat),
    MAKER_BONUS_RATE: IDL.Opt(IDL.Nat),
    MAX_PENDINGS: IDL.Opt(IDL.Nat),
    ORDER_EXPIRATION_DURATION: IDL.Opt(IDL.Int),
    TRADING_FEE: IDL.Opt(IDL.Nat),
    UNIT_SIZE: IDL.Opt(IDL.Nat),
    STORAGE_INTERVAL: IDL.Opt(IDL.Nat),
    ICP_FEE: IDL.Opt(IcpE8s)
  });
  const Config = IDL.Record({
    MAX_STORAGE_TRIES: IDL.Opt(IDL.Nat),
    EN_DEBUG: IDL.Opt(IDL.Bool),
    MAX_CACHE_NUMBER_PER: IDL.Opt(IDL.Nat),
    MAX_CACHE_TIME: IDL.Opt(IDL.Nat)
  });
  const OrderStatus = IDL.Variant({
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Recovered: IDL.Null,
    Compensating: IDL.Null,
    Blocking: IDL.Null
  });
  const TransferResponse = IDL.Variant({
    ok: Balance,
    err: IDL.Variant({
      CannotNotify: AccountIdentifier,
      InsufficientBalance: IDL.Null,
      InvalidToken: TokenIdentifier,
      Rejected: IDL.Null,
      Unauthorized: AccountIdentifier,
      Other: IDL.Text
    })
  });
  const Memo = IDL.Vec(IDL.Nat8);
  const SubAccount = IDL.Vec(IDL.Nat8);
  const TransferRequest = IDL.Record({
    to: User,
    token: TokenIdentifier,
    notify: IDL.Bool,
    from: User,
    memo: Memo,
    subaccount: IDL.Opt(SubAccount),
    amount: Balance
  });
  const Txid__2 = IDL.Vec(IDL.Nat8);
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const Amount__2 = IDL.Nat;
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount)
  });
  const Timestamp__4 = IDL.Nat64;
  const TransferArgs = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(Subaccount),
    created_at_time: IDL.Opt(Timestamp__4),
    amount: IDL.Nat
  });
  const TransferError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat
    }),
    TemporarilyUnavailable: IDL.Null,
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat })
  });
  const Timestamp__2 = IDL.Nat;
  const Amount__1 = IDL.Nat;
  const PoolBalance = IDL.Record({
    ts: Timestamp__2,
    balance0: Amount__1,
    balance1: Amount__1
  });
  const Address__1 = IDL.Text;
  const TransferFromArgs = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    spender_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: Account,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat
  });
  const TransferFromError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat
    }),
    TemporarilyUnavailable: IDL.Null,
    InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat })
  });
  const IDORequirement = IDL.Record({
    threshold: IDL.Float64,
    pairs: IDL.Vec(
      IDL.Record({ pair: IDL.Principal, token1ToUsdRatio: IDL.Float64 })
    )
  });
  const Timestamp__3 = IDL.Nat;
  const Config__1 = IDL.Record({
    lowerLimit: IDL.Opt(IDL.Nat),
    threshold: IDL.Opt(Amount__1),
    upperLimit: IDL.Opt(IDL.Nat),
    volFactor: IDL.Opt(IDL.Nat),
    spreadRatePpm: IDL.Opt(IDL.Nat),
    withdrawalFeePpm: IDL.Opt(IDL.Nat)
  });
  const TradingStatus = IDL.Variant({
    Todo: IDL.Null,
    Closed: IDL.Null,
    Cancelled: IDL.Null,
    Pending: IDL.Null
  });
  const Txid = IDL.Vec(IDL.Nat8);
  const BalanceChange = IDL.Variant({
    DebitRecord: IDL.Nat,
    CreditRecord: IDL.Nat,
    NoChange: IDL.Null
  });
  const OrderFilled = IDL.Record({
    time: Time,
    token0Value: BalanceChange,
    counterparty: Txid,
    token1Value: BalanceChange
  });
  const TradingResult = IDL.Variant({
    ok: IDL.Record({
      status: TradingStatus,
      txid: Txid,
      filled: IDL.Vec(OrderFilled)
    }),
    err: IDL.Record({
      code: IDL.Variant({
        NonceError: IDL.Null,
        InvalidAmount: IDL.Null,
        UndefinedError: IDL.Null,
        UnacceptableVolatility: IDL.Null,
        TransactionBlocking: IDL.Null,
        InsufficientBalance: IDL.Null,
        TransferException: IDL.Null
      }),
      message: IDL.Text
    })
  });
  const Quantity = IDL.Nat;
  const Amount = IDL.Nat;
  const Price = IDL.Nat;
  const OrderPrice = IDL.Record({
    quantity: IDL.Variant({
      Buy: IDL.Tuple(Quantity, Amount),
      Sell: Quantity
    }),
    price: Price
  });
  const OrderType = IDL.Variant({
    FAK: IDL.Null,
    FOK: IDL.Null,
    LMT: IDL.Null,
    MKT: IDL.Null
  });
  const Event = IDL.Variant({
    removeMaker: IDL.Record({
      maker: IDL.Principal,
      pair: IDL.Principal
    }),
    pairConfig: IDL.Record({
      setting: IDL.Opt(DexConfig),
      pair: IDL.Principal,
      drc205config: IDL.Opt(Config)
    }),
    setICDexPairWasm: IDL.Record({ size: IDL.Nat, version: IDL.Text }),
    pairICTCDoneTO: IDL.Record({
      app: IDL.Principal,
      status: OrderStatus,
      callbacked: IDL.Bool,
      toid: IDL.Nat,
      completed: IDL.Bool
    }),
    pairICTCDoneTT: IDL.Record({
      app: IDL.Principal,
      callbacked: IDL.Bool,
      toid: IDL.Nat,
      ttid: IDL.Nat,
      completed: IDL.Bool
    }),
    makerTransactionLock: IDL.Record({
      act: IDL.Variant({ lock: IDL.Null, unlock: IDL.Null }),
      maker: IDL.Principal
    }),
    timerStart: IDL.Record({ intervalSeconds: IDL.Nat }),
    pairChangeOwner: IDL.Record({
      pair: IDL.Principal,
      newOwner: IDL.Principal
    }),
    nftSetVipMaker: IDL.Record({
      rebateRate: IDL.Nat,
      pair: IDL.Principal,
      nftId: TokenIdentifier,
      vipMaker: IDL.Text
    }),
    nftTransferFrom: IDL.Record({
      result: TransferResponse,
      args: TransferRequest,
      nftId: TokenIdentifier,
      collId: IDL.Principal
    }),
    pairCancelByTxid: IDL.Record({
      pair: IDL.Principal,
      txid: Txid__2
    }),
    addPairToList: IDL.Record({ pair: IDL.Principal }),
    pairICTCBlockTO: IDL.Record({
      app: IDL.Principal,
      toid: IDL.Nat,
      completed: IDL.Bool
    }),
    createMaker: IDL.Record({
      arg: IDL.Record({
        spreadRate: IDL.Nat,
        allow: IDL.Variant({ Private: IDL.Null, Public: IDL.Null }),
        lowerLimit: IDL.Nat,
        threshold: IDL.Nat,
        upperLimit: IDL.Nat,
        name: IDL.Text,
        pair: IDL.Principal,
        volFactor: IDL.Nat
      }),
      version: IDL.Text,
      makerCanisterId: IDL.Principal
    }),
    removePairFromList: IDL.Record({ pair: IDL.Principal }),
    pairSetAuctionMode: IDL.Record({
      result: IDL.Tuple(IDL.Bool, AccountId__2),
      pair: IDL.Principal
    }),
    makerSetControllers: IDL.Record({
      maker: IDL.Principal,
      controllers: IDL.Vec(IDL.Principal),
      pair: IDL.Principal
    }),
    pairICTCSetAdmin: IDL.Record({
      act: IDL.Variant({ Add: IDL.Null, Remove: IDL.Null }),
      app: IDL.Principal,
      admin: IDL.Principal
    }),
    pairICTCClearLog: IDL.Record({
      app: IDL.Principal,
      expiration: IDL.Opt(IDL.Int),
      forced: IDL.Bool
    }),
    createPair: IDL.Record({
      initCycles: IDL.Opt(IDL.Nat),
      token0: IDL.Principal,
      token1: IDL.Principal,
      pairCanisterId: IDL.Principal,
      unitSize: IDL.Opt(IDL.Nat64)
    }),
    makerDeleteGridOrder: IDL.Record({ maker: IDL.Principal }),
    changeOwner: IDL.Record({ newOwner: IDL.Principal }),
    nftRemoveVipMaker: IDL.Record({
      pair: IDL.Principal,
      vipMaker: IDL.Text
    }),
    makerCancelAllOrders: IDL.Record({ maker: IDL.Principal }),
    setPairControllers: IDL.Record({
      controllers: IDL.Vec(IDL.Principal),
      pair: IDL.Principal
    }),
    makerDexWithdraw: IDL.Record({
      maker: IDL.Principal,
      result: IDL.Tuple(Amount__2, Amount__2),
      token0: Amount__2,
      token1: Amount__2
    }),
    dexAddCompetition: IDL.Record({
      id: IDL.Opt(IDL.Nat),
      end: IDL.Int,
      addPairs: IDL.Vec(
        IDL.Record({
          dex: IDL.Text,
          minCapital: IDL.Nat,
          canisterId: IDL.Principal,
          quoteToken: IDL.Variant({
            token0: IDL.Null,
            token1: IDL.Null
          })
        })
      ),
      name: IDL.Text,
      start: IDL.Int
    }),
    refundFee: IDL.Record({
      arg: TransferArgs,
      result: IDL.Variant({ Ok: IDL.Nat, Err: TransferError }),
      token: IDL.Principal
    }),
    pairTASetDescription: IDL.Record({
      desc: IDL.Text,
      pair: IDL.Principal
    }),
    sysCall: IDL.Record({
      method: IDL.Text,
      args: IDL.Vec(IDL.Nat8),
      canister: IDL.Principal,
      reply: IDL.Vec(IDL.Nat8)
    }),
    sysConfig: IDL.Record({
      blackhole: IDL.Opt(IDL.Principal),
      creatingPairFee: IDL.Opt(IDL.Nat),
      aggregator: IDL.Opt(IDL.Principal),
      sysTokenFee: IDL.Opt(IDL.Nat),
      icDao: IDL.Opt(IDL.Principal),
      nftPlanetCards: IDL.Opt(IDL.Principal),
      creatingMakerFee: IDL.Opt(IDL.Nat),
      sysToken: IDL.Opt(IDL.Principal)
    }),
    upgradePair: IDL.Record({
      pair: IDL.Principal,
      version: IDL.Text,
      success: IDL.Bool
    }),
    pairSetUpgradeMode: IDL.Record({
      mode: IDL.Variant({ All: IDL.Null, Base: IDL.Null }),
      pair: IDL.Principal
    }),
    reinstallPair: IDL.Record({
      pair: IDL.Principal,
      version: IDL.Text,
      success: IDL.Bool
    }),
    reinstallMaker: IDL.Record({
      maker: IDL.Principal,
      pair: IDL.Principal,
      completed: IDL.Bool,
      version: IDL.Text
    }),
    makerResetLocalBalance: IDL.Record({
      maker: IDL.Principal,
      balance: PoolBalance
    }),
    createPairByUser: IDL.Record({
      token0: IDL.Principal,
      token1: IDL.Principal,
      pairCanisterId: IDL.Principal
    }),
    sysWithdraw: IDL.Record({
      to: IDL.Principal,
      token: IDL.Principal,
      value: IDL.Nat,
      txid: IDL.Variant({ txid: Txid__2, index: IDL.Nat })
    }),
    nftWithdraw: IDL.Record({
      result: TransferResponse,
      args: TransferRequest,
      nftId: TokenIdentifier,
      collId: IDL.Principal
    }),
    initOrUpgrade: IDL.Record({ version: IDL.Text }),
    pairSync: IDL.Record({ pair: IDL.Principal }),
    upgradeMaker: IDL.Record({
      maker: IDL.Principal,
      name: IDL.Opt(IDL.Text),
      pair: IDL.Principal,
      completed: IDL.Bool,
      version: IDL.Text
    }),
    pairEnableStratOrder: IDL.Record({
      arg: IDL.Variant({ Enable: IDL.Null, Disable: IDL.Null }),
      pair: IDL.Principal
    }),
    makerSuspend: IDL.Record({ maker: IDL.Principal }),
    sysCancelOrder: IDL.Record({
      pair: IDL.Principal,
      txid: IDL.Opt(Txid__2)
    }),
    pairStart: IDL.Record({
      pair: IDL.Principal,
      message: IDL.Opt(IDL.Text)
    }),
    pairSetVipMaker: IDL.Record({
      rebateRate: IDL.Nat,
      pair: IDL.Principal,
      account: Address__1
    }),
    chargeFee: IDL.Record({
      arg: TransferFromArgs,
      result: IDL.Variant({ Ok: IDL.Nat, Err: TransferFromError }),
      token: IDL.Principal
    }),
    pairEnableIDOAndSetFunder: IDL.Record({
      pair: IDL.Principal,
      funder: IDL.Opt(IDL.Principal),
      _requirement: IDL.Opt(IDORequirement)
    }),
    makerCreateGridOrder: IDL.Record({ maker: IDL.Principal }),
    pairICTCCompleteTO: IDL.Record({
      app: IDL.Principal,
      status: OrderStatus,
      toid: IDL.Nat,
      completed: IDL.Bool
    }),
    makerStart: IDL.Record({ maker: IDL.Principal }),
    pairFallbackByTxid: IDL.Record({
      result: IDL.Bool,
      pair: IDL.Principal,
      txid: Txid__2
    }),
    pairSetOrderFail: IDL.Record({
      pair: IDL.Principal,
      txidHex: IDL.Text,
      refundToken0: Amount__2,
      refundToken1: Amount__2
    }),
    backupPairData: IDL.Record({
      pair: IDL.Principal,
      timestamp: Timestamp__3
    }),
    pairICTCRedoTT: IDL.Record({
      app: IDL.Principal,
      toid: IDL.Nat,
      ttid: IDL.Nat,
      completed: IDL.Bool
    }),
    setICDexMakerWasm: IDL.Record({
      size: IDL.Nat,
      version: IDL.Text
    }),
    removePairDataSnapshot: IDL.Record({
      timeBefore: Timestamp__3,
      pair: IDL.Principal
    }),
    makerGlobalLock: IDL.Record({
      act: IDL.Variant({ lock: IDL.Null, unlock: IDL.Null }),
      maker: IDL.Principal
    }),
    pairSTOConfig: IDL.Record({
      pair: IDL.Principal,
      config: IDL.Record({
        gridMaxPerSide: IDL.Opt(IDL.Nat),
        stopLossCountMax: IDL.Opt(IDL.Nat),
        poFee1: IDL.Opt(IDL.Nat),
        poFee2: IDL.Opt(IDL.Float64),
        proCountMax: IDL.Opt(IDL.Nat),
        sloFee1: IDL.Opt(IDL.Nat),
        sloFee2: IDL.Opt(IDL.Float64)
      })
    }),
    recoveryPairData: IDL.Record({
      pair: IDL.Principal,
      timestamp: Timestamp__3
    }),
    pairRemoveVipMaker: IDL.Record({
      pair: IDL.Principal,
      account: Address__1
    }),
    makerConfig: IDL.Record({
      maker: IDL.Principal,
      config: Config__1
    }),
    timerStop: IDL.Null,
    pairICTCRunTO: IDL.Record({
      app: IDL.Principal,
      result: IDL.Opt(OrderStatus),
      toid: IDL.Nat
    }),
    sysTrade: IDL.Record({
      result: TradingResult,
      order: OrderPrice,
      pair: IDL.Principal,
      orderType: OrderType,
      tokenTxid: IDL.Variant({ txid: Txid__2, index: IDL.Nat })
    }),
    makerDexDeposit: IDL.Record({
      maker: IDL.Principal,
      result: IDL.Tuple(Amount__2, Amount__2),
      token0: Amount__2,
      token1: Amount__2
    }),
    pairSuspend: IDL.Record({
      pair: IDL.Principal,
      message: IDL.Opt(IDL.Text)
    })
  });
  const Timestamp__1 = IDL.Nat;
  const BlockHeight = IDL.Nat;
  const ListPage = IDL.Nat;
  const ListSize = IDL.Nat;
  const TrieList__1_1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(BlockHeight, IDL.Tuple(Event, Timestamp__1))),
    totalPage: IDL.Nat
  });
  const TrieList__1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(
      IDL.Tuple(PairCanister, IDL.Vec(IDL.Tuple(IDL.Principal, AccountId)))
    ),
    totalPage: IDL.Nat
  });
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const Sa = IDL.Vec(IDL.Nat8);
  const Toid = IDL.Nat;
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const TradingOrder = IDL.Record({
    fee: IDL.Record({ fee0: IDL.Int, fee1: IDL.Int }),
    gas: IDL.Record({ gas0: IDL.Nat, gas1: IDL.Nat }),
    status: TradingStatus,
    toids: IDL.Vec(Toid),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    txid: Txid,
    icrc1Account: IDL.Opt(
      IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
      })
    ),
    orderType: OrderType,
    filled: IDL.Vec(OrderFilled),
    expiration: Time,
    nonce: IDL.Nat,
    account: AccountId__1,
    remaining: OrderPrice,
    index: IDL.Nat,
    orderPrice: OrderPrice,
    refund: IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Nat)
  });
  const TrieList = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(Txid, TradingOrder)),
    totalPage: IDL.Nat
  });
  const TokenStd = IDL.Variant({
    dft: IDL.Null,
    ext: IDL.Null,
    icp: IDL.Null,
    other: IDL.Text,
    cycles: IDL.Null,
    ledger: IDL.Null,
    icrc1: IDL.Null,
    dip20: IDL.Null,
    drc20: IDL.Null
  });
  return IDL.Service({
    NFTBalance: IDL.Func([Address], [IDL.Vec(NFT)], ['query']),
    NFTBindMaker: IDL.Func(
      [IDL.Text, IDL.Principal, AccountId, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [],
      []
    ),
    NFTBindingMakers: IDL.Func(
      [IDL.Text],
      [IDL.Vec(IDL.Tuple(IDL.Principal, AccountId))],
      ['query']
    ),
    NFTDeposit: IDL.Func(
      [CollectionId, TokenIdentifier, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [],
      []
    ),
    NFTUnbindMaker: IDL.Func(
      [IDL.Text, IDL.Principal, AccountId, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [],
      []
    ),
    NFTWithdraw: IDL.Func(
      [IDL.Opt(TokenIdentifier), IDL.Opt(IDL.Vec(IDL.Nat8))],
      [],
      []
    ),
    NFTs: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(AccountId, IDL.Vec(NFT)))],
      ['query']
    ),
    backup: IDL.Func([IDL.Principal], [Timestamp], []),
    backupToTempCanister: IDL.Func(
      [IDL.Principal, IDL.Principal],
      [IDL.Bool],
      []
    ),
    create: IDL.Func(
      [
        IDL.Principal,
        IDL.Principal,
        Time,
        IDL.Opt(IDL.Nat64),
        IDL.Opt(IDL.Nat)
      ],
      [PairCanister],
      []
    ),
    debug_canister_status: IDL.Func([IDL.Principal], [canister_status], []),
    debug_monitor: IDL.Func([], [], []),
    dex_addCompetition: IDL.Func(
      [
        IDL.Opt(IDL.Nat),
        IDL.Text,
        IDL.Text,
        Time,
        Time,
        IDL.Vec(
          IDL.Record({
            dex: IDL.Text,
            minCapital: IDL.Nat,
            canisterId: IDL.Principal,
            quoteToken: IDL.Variant({
              token0: IDL.Null,
              token1: IDL.Null
            })
          })
        )
      ],
      [IDL.Nat],
      []
    ),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    getICDexMakerWasmVersion: IDL.Func([], [IDL.Text, IDL.Nat], ['query']),
    getICDexMakerWasmVersionHistory: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
      ['query']
    ),
    getICDexPairWasmVersion: IDL.Func([], [IDL.Text, IDL.Nat], ['query']),
    getICDexPairWasmVersionHistory: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
      ['query']
    ),
    getPairs: IDL.Func(
      [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList__1_2],
      ['query']
    ),
    getPairsByToken: IDL.Func(
      [IDL.Principal],
      [IDL.Vec(IDL.Tuple(PairCanister, SwapPair))],
      ['query']
    ),
    getSnapshots: IDL.Func([IDL.Principal], [IDL.Vec(Timestamp)], ['query']),
    getTokens: IDL.Func([], [IDL.Vec(TokenInfo__1)], ['query']),
    getVipMakers: IDL.Func(
      [IDL.Opt(IDL.Principal)],
      [IDL.Vec(IDL.Tuple(IDL.Principal, AccountId))],
      ['query']
    ),
    get_account_events: IDL.Func(
      [AccountId],
      [IDL.Vec(IDL.Tuple(Event, Timestamp__1))],
      ['query']
    ),
    get_event: IDL.Func(
      [BlockHeight],
      [IDL.Opt(IDL.Tuple(Event, Timestamp__1))],
      ['query']
    ),
    get_event_count: IDL.Func([], [IDL.Nat], ['query']),
    get_event_first_index: IDL.Func([], [BlockHeight], ['query']),
    get_events: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList__1_1],
      ['query']
    ),
    maker_approveToPair: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [IDL.Bool],
      []
    ),
    maker_cancelAllOrders: IDL.Func([IDL.Principal], [], []),
    maker_config: IDL.Func([IDL.Principal, Config__1], [IDL.Bool], []),
    maker_create: IDL.Func(
      [
        IDL.Record({
          creator: IDL.Opt(AccountId),
          spreadRate: IDL.Nat,
          allow: IDL.Variant({
            Private: IDL.Null,
            Public: IDL.Null
          }),
          lowerLimit: IDL.Nat,
          threshold: IDL.Nat,
          upperLimit: IDL.Nat,
          name: IDL.Text,
          pair: IDL.Principal,
          volFactor: IDL.Nat
        })
      ],
      [IDL.Principal],
      []
    ),
    maker_createGridOrder: IDL.Func(
      [IDL.Principal, IDL.Variant({ First: IDL.Null, Second: IDL.Null })],
      [],
      []
    ),
    maker_deleteGridOrder: IDL.Func(
      [IDL.Principal, IDL.Variant({ First: IDL.Null, Second: IDL.Null })],
      [],
      []
    ),
    maker_dexDeposit: IDL.Func(
      [IDL.Principal, IDL.Nat, IDL.Nat],
      [IDL.Nat, IDL.Nat],
      []
    ),
    maker_dexWithdraw: IDL.Func(
      [IDL.Principal, IDL.Nat, IDL.Nat],
      [IDL.Nat, IDL.Nat],
      []
    ),
    maker_getPrivateMakers: IDL.Func(
      [AccountId, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList__1],
      ['query']
    ),
    maker_getPublicMakers: IDL.Func(
      [IDL.Opt(IDL.Principal), IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList__1],
      ['query']
    ),
    maker_reinstall: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Text],
      [IDL.Opt(IDL.Principal)],
      []
    ),
    maker_remove: IDL.Func([IDL.Principal, IDL.Principal], [], []),
    maker_resetLocalBalance: IDL.Func([IDL.Principal], [PoolBalance], []),
    maker_setControllers: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Vec(IDL.Principal)],
      [IDL.Bool],
      []
    ),
    maker_setPause: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    maker_transactionLock: IDL.Func(
      [
        IDL.Principal,
        IDL.Opt(IDL.Variant({ lock: IDL.Null, unlock: IDL.Null })),
        IDL.Opt(IDL.Variant({ lock: IDL.Null, unlock: IDL.Null }))
      ],
      [IDL.Bool],
      []
    ),
    maker_update: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Opt(IDL.Text), IDL.Text],
      [IDL.Opt(IDL.Principal)],
      []
    ),
    maker_updateAll: IDL.Func(
      [IDL.Text, IDL.Bool],
      [
        IDL.Record({
          failures: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Principal)),
          total: IDL.Nat,
          success: IDL.Nat
        })
      ],
      []
    ),
    monitor_canisters: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
      ['query']
    ),
    monitor_put: IDL.Func([IDL.Principal], [], []),
    monitor_remove: IDL.Func([IDL.Principal], [], []),
    pair_IDOSetFunder: IDL.Func(
      [IDL.Principal, IDL.Opt(IDL.Principal), IDL.Opt(IDORequirement)],
      [],
      []
    ),
    pair_cancelByTxid: IDL.Func([IDL.Principal, Txid__1, IDL.Opt(Sa)], [], []),
    pair_config: IDL.Func(
      [IDL.Principal, IDL.Opt(DexConfig), IDL.Opt(Config)],
      [IDL.Bool],
      []
    ),
    pair_enableStratOrder: IDL.Func(
      [IDL.Principal, IDL.Variant({ Enable: IDL.Null, Disable: IDL.Null })],
      [],
      []
    ),
    pair_fallbackByTxid: IDL.Func(
      [IDL.Principal, Txid__1, IDL.Opt(Sa)],
      [IDL.Bool],
      []
    ),
    pair_ictcBlockTO: IDL.Func(
      [IDL.Principal, IDL.Nat],
      [IDL.Opt(IDL.Nat)],
      []
    ),
    pair_ictcClearLog: IDL.Func(
      [IDL.Principal, IDL.Opt(IDL.Int), IDL.Bool],
      [],
      []
    ),
    pair_ictcCompleteTO: IDL.Func(
      [IDL.Principal, IDL.Nat, OrderStatus],
      [IDL.Bool],
      []
    ),
    pair_ictcDoneTO: IDL.Func(
      [IDL.Principal, IDL.Nat, OrderStatus, IDL.Bool],
      [IDL.Bool],
      []
    ),
    pair_ictcDoneTT: IDL.Func(
      [IDL.Principal, IDL.Nat, IDL.Nat, IDL.Bool],
      [IDL.Opt(IDL.Nat)],
      []
    ),
    pair_ictcRedoTT: IDL.Func(
      [IDL.Principal, IDL.Nat, IDL.Nat],
      [IDL.Opt(IDL.Nat)],
      []
    ),
    pair_ictcRunTO: IDL.Func(
      [IDL.Principal, IDL.Nat],
      [IDL.Opt(OrderStatus)],
      []
    ),
    pair_ictcSetAdmin: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Bool],
      [IDL.Bool],
      []
    ),
    pair_pause: IDL.Func(
      [IDL.Principal, IDL.Bool, IDL.Opt(Time)],
      [IDL.Bool],
      []
    ),
    pair_pauseAll: IDL.Func(
      [IDL.Bool],
      [
        IDL.Record({
          failures: IDL.Vec(IDL.Principal),
          total: IDL.Nat,
          success: IDL.Nat
        })
      ],
      []
    ),
    pair_pendingAll: IDL.Func(
      [IDL.Principal, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList],
      []
    ),
    pair_removeVipMaker: IDL.Func([IDL.Principal, Address], [], []),
    pair_setAuctionMode: IDL.Func(
      [IDL.Principal, IDL.Bool, IDL.Opt(AccountId)],
      [IDL.Bool, AccountId],
      []
    ),
    pair_setOrderFail: IDL.Func(
      [IDL.Principal, IDL.Text, IDL.Nat, IDL.Nat],
      [IDL.Bool],
      []
    ),
    pair_setUpgradeMode: IDL.Func(
      [IDL.Principal, IDL.Variant({ All: IDL.Null, Base: IDL.Null })],
      [],
      []
    ),
    pair_setVipMaker: IDL.Func([IDL.Principal, Address, IDL.Nat], [], []),
    pair_sync: IDL.Func([IDL.Principal], [], []),
    pair_taSetDescription: IDL.Func([IDL.Principal, IDL.Text], [], []),
    pair_withdrawCycles: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    pubCreate: IDL.Func(
      [IDL.Principal, IDL.Principal, Time],
      [PairCanister],
      []
    ),
    put: IDL.Func([SwapPair], [], []),
    recovery: IDL.Func([IDL.Principal, Timestamp], [IDL.Bool], []),
    reinstall: IDL.Func(
      [IDL.Principal, IDL.Text, IDL.Bool],
      [IDL.Opt(PairCanister)],
      []
    ),
    remove: IDL.Func([IDL.Principal], [], []),
    removeSnapshot: IDL.Func([IDL.Principal, Timestamp__1], [], []),
    route: IDL.Func(
      [IDL.Principal, IDL.Principal],
      [IDL.Vec(IDL.Tuple(PairCanister, SwapPair))],
      ['query']
    ),
    setControllers: IDL.Func(
      [IDL.Principal, IDL.Vec(IDL.Principal)],
      [IDL.Bool],
      []
    ),
    setICDexMakerWasm: IDL.Func(
      [
        IDL.Vec(IDL.Nat8),
        IDL.Text,
        IDL.Opt(
          IDL.Variant({
            final: IDL.Null,
            first: IDL.Null,
            middle: IDL.Null
          })
        )
      ],
      [],
      []
    ),
    setICDexPairWasm: IDL.Func(
      [
        IDL.Vec(IDL.Nat8),
        IDL.Text,
        IDL.Opt(
          IDL.Variant({
            final: IDL.Null,
            first: IDL.Null,
            middle: IDL.Null
          })
        )
      ],
      [],
      []
    ),
    snapshotToTempCanister: IDL.Func(
      [IDL.Principal, Timestamp, IDL.Principal],
      [IDL.Bool],
      []
    ),
    sto_config: IDL.Func(
      [
        IDL.Principal,
        IDL.Record({
          gridMaxPerSide: IDL.Opt(IDL.Nat),
          stopLossCountMax: IDL.Opt(IDL.Nat),
          poFee1: IDL.Opt(IDL.Nat),
          poFee2: IDL.Opt(IDL.Float64),
          proCountMax: IDL.Opt(IDL.Nat),
          sloFee1: IDL.Opt(IDL.Nat),
          sloFee2: IDL.Opt(IDL.Float64)
        })
      ],
      [],
      []
    ),
    sync: IDL.Func([], [], []),
    syncVipMakers: IDL.Func([], [], []),
    sys_call: IDL.Func(
      [IDL.Principal, IDL.Text, IDL.Vec(IDL.Nat8)],
      [IDL.Vec(IDL.Nat8)],
      []
    ),
    sys_cancelOrder: IDL.Func([IDL.Principal, IDL.Opt(Txid__1)], [], []),
    sys_config: IDL.Func(
      [
        IDL.Record({
          icDaoBoard: IDL.Opt(IDL.Principal),
          blackhole: IDL.Opt(IDL.Principal),
          creatingPairFee: IDL.Opt(IDL.Nat),
          aggregator: IDL.Opt(IDL.Principal),
          sysTokenFee: IDL.Opt(IDL.Nat),
          icDao: IDL.Opt(IDL.Principal),
          nftPlanetCards: IDL.Opt(IDL.Principal),
          creatingMakerFee: IDL.Opt(IDL.Nat),
          sysToken: IDL.Opt(IDL.Principal)
        })
      ],
      [],
      []
    ),
    sys_conversionFees: IDL.Func(
      [
        IDL.Vec(
          IDL.Record({
            pair: IDL.Principal,
            debitToken: IDL.Opt(
              IDL.Variant({ token0: IDL.Null, token1: IDL.Null })
            ),
            approvalSupported: IDL.Opt(IDL.Bool)
          })
        )
      ],
      [IDL.Vec(TradingResult)],
      []
    ),
    sys_getConfig: IDL.Func(
      [],
      [
        IDL.Record({
          icDaoBoard: IDL.Principal,
          blackhole: IDL.Principal,
          creatingPairFee: IDL.Nat,
          aggregator: IDL.Principal,
          sysTokenFee: IDL.Nat,
          icDao: IDL.Principal,
          nftPlanetCards: IDL.Principal,
          creatingMakerFee: IDL.Nat,
          sysToken: IDL.Principal
        })
      ],
      ['query']
    ),
    sys_order: IDL.Func(
      [IDL.Principal, TokenStd, IDL.Nat, IDL.Principal, OrderPrice],
      [TradingResult],
      []
    ),
    sys_withdraw: IDL.Func(
      [
        IDL.Principal,
        TokenStd,
        IDL.Record({
          owner: IDL.Principal,
          subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
        }),
        IDL.Nat
      ],
      [],
      []
    ),
    timerStart: IDL.Func([IDL.Nat], [], []),
    timerStop: IDL.Func([], [], []),
    update: IDL.Func([IDL.Principal, IDL.Text], [IDL.Opt(PairCanister)], []),
    updateAll: IDL.Func(
      [IDL.Text],
      [
        IDL.Record({
          failures: IDL.Vec(IDL.Principal),
          total: IDL.Nat,
          success: IDL.Nat
        })
      ],
      []
    ),
    version: IDL.Func([], [IDL.Text], ['query']),
    wallet_receive: IDL.Func([], [], [])
  });
};
