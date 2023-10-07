export default ({ IDL }) => {
  const Address = IDL.Text;
  const Nonce__1 = IDL.Nat;
  const Data__1 = IDL.Vec(IDL.Nat8);
  const Shares = IDL.Nat;
  const ShareChange = IDL.Variant({
    Burn: Shares,
    Mint: Shares,
    NoChange: IDL.Null
  });
  const BalanceChange = IDL.Variant({
    DebitRecord: IDL.Nat,
    CreditRecord: IDL.Nat,
    NoChange: IDL.Null
  });
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const TxnResult = IDL.Variant({
    ok: IDL.Record({
      shares: ShareChange,
      icpE8s: BalanceChange,
      txid: Txid__1,
      cycles: BalanceChange
    }),
    err: IDL.Record({
      code: IDL.Variant({
        InsufficientShares: IDL.Null,
        PoolIsEmpty: IDL.Null,
        NonceError: IDL.Null,
        UndefinedError: IDL.Null,
        UnacceptableVolatility: IDL.Null,
        InvalidCyclesAmout: IDL.Null,
        InvalidIcpAmout: IDL.Null,
        IcpTransferException: IDL.Null
      }),
      message: IDL.Text
    })
  });
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
  const CyclesWallet__1 = IDL.Principal;
  const Sa = IDL.Vec(IDL.Nat8);
  const Config = IDL.Record({
    FEE: IDL.Opt(IDL.Nat),
    MIN_ICP_E8S: IDL.Opt(IDL.Nat),
    ICP_LIMIT: IDL.Opt(IDL.Nat),
    MIN_CYCLES: IDL.Opt(IDL.Nat),
    MAX_STORAGE_TRIES: IDL.Opt(IDL.Nat),
    CYCLESFEE_RETENTION_RATE: IDL.Opt(IDL.Nat),
    STORAGE_CANISTER: IDL.Opt(IDL.Text),
    MAX_CACHE_NUMBER_PER: IDL.Opt(IDL.Nat),
    MAX_CACHE_TIME: IDL.Opt(IDL.Nat),
    CYCLES_LIMIT: IDL.Opt(IDL.Nat),
    ICP_FEE: IDL.Opt(IDL.Nat64)
  });
  const TokenType__2 = IDL.Variant({
    Icp: IDL.Null,
    Token: IDL.Principal,
    Cycles: IDL.Null
  });
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
  const DexInfo = IDL.Record({
    feeRate: IDL.Float64,
    mmType: IDL.Variant({ AMM: IDL.Null, OrderBook: IDL.Null }),
    token0: IDL.Tuple(TokenType__2, TokenStd__1),
    token1: IDL.Tuple(TokenType__2, TokenStd__1),
    pairName: IDL.Text,
    dexName: IDL.Text,
    canisterId: IDL.Principal
  });
  const Address__1 = IDL.Text;
  const Status__1 = IDL.Variant({
    Failed: IDL.Null,
    Cancelled: IDL.Null,
    PartiallyCompletedAndCancelled: IDL.Null,
    Completed: IDL.Null,
    Pending: IDL.Null
  });
  const Shares__2 = IDL.Nat;
  const ShareChange__1 = IDL.Variant({
    Burn: Shares__2,
    Mint: Shares__2,
    NoChange: IDL.Null
  });
  const BalanceChange__1 = IDL.Variant({
    DebitRecord: IDL.Nat,
    CreditRecord: IDL.Nat,
    NoChange: IDL.Null
  });
  const Data__2 = IDL.Vec(IDL.Nat8);
  const Time = IDL.Int;
  const Txid__3 = IDL.Vec(IDL.Nat8);
  const TokenType__1 = IDL.Variant({
    Icp: IDL.Null,
    Token: IDL.Principal,
    Cycles: IDL.Null
  });
  const Nonce__2 = IDL.Nat;
  const OperationType__1 = IDL.Variant({
    AddLiquidity: IDL.Null,
    Swap: IDL.Null,
    Claim: IDL.Null,
    RemoveLiquidity: IDL.Null
  });
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const CyclesWallet__2 = IDL.Principal;
  const TxnRecord__1 = IDL.Record({
    fee: IDL.Record({ token0Fee: IDL.Int, token1Fee: IDL.Int }),
    status: Status__1,
    shares: ShareChange__1,
    msgCaller: IDL.Opt(IDL.Principal),
    order: IDL.Record({
      token0Value: IDL.Opt(BalanceChange__1),
      token1Value: IDL.Opt(BalanceChange__1)
    }),
    data: IDL.Opt(Data__2),
    time: Time,
    txid: Txid__3,
    orderMode: IDL.Variant({ AMM: IDL.Null, OrderBook: IDL.Null }),
    orderType: IDL.Opt(
      IDL.Variant({
        FAK: IDL.Null,
        FOK: IDL.Null,
        LMT: IDL.Null,
        MKT: IDL.Null
      })
    ),
    filled: IDL.Record({
      token0Value: BalanceChange__1,
      token1Value: BalanceChange__1
    }),
    token0: TokenType__1,
    token1: TokenType__1,
    nonce: Nonce__2,
    operation: OperationType__1,
    account: AccountId__2,
    details: IDL.Vec(
      IDL.Record({
        time: Time,
        token0Value: BalanceChange__1,
        counterparty: Txid__3,
        token1Value: BalanceChange__1
      })
    ),
    caller: AccountId__2,
    index: IDL.Nat,
    cyclesWallet: IDL.Opt(CyclesWallet__2)
  });
  const Txid__2 = IDL.Vec(IDL.Nat8);
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
  const IcpE8s = IDL.Nat;
  const CyclesAmount = IDL.Nat;
  const FeeStatus = IDL.Record({
    fee: IDL.Float64,
    cumulFee: IDL.Record({
      icpBalance: IcpE8s,
      cyclesBalance: CyclesAmount
    }),
    totalFee: IDL.Record({
      icpBalance: IcpE8s,
      cyclesBalance: CyclesAmount
    })
  });
  const Timestamp = IDL.Nat;
  const TransStatus = IDL.Variant({
    Fallback: IDL.Null,
    Success: IDL.Null,
    Processing: IDL.Null,
    Failure: IDL.Null
  });
  const CyclesTransferLog = IDL.Record({
    to: IDL.Principal,
    updateTime: Timestamp,
    status: TransStatus,
    value: CyclesAmount,
    from: IDL.Principal
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const ICP = IDL.Record({ e8s: IDL.Nat64 });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
    BadFee: IDL.Record({ expected_fee: ICP }),
    TxDuplicate: IDL.Record({ duplicate_of: BlockIndex }),
    TxCreatedInFuture: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: ICP })
  });
  const CyclesWallet = IDL.Principal;
  const ErrorLog = IDL.Variant({
    Withdraw: IDL.Record({
      time: Timestamp,
      user: AccountId,
      icpErrMsg: IDL.Opt(TransferError),
      cyclesErrMsg: IDL.Text,
      credit: IDL.Tuple(CyclesWallet, CyclesAmount, AccountId, IcpE8s)
    }),
    IcpSaToMain: IDL.Record({
      time: Timestamp,
      user: AccountId,
      errMsg: TransferError,
      debit: IDL.Tuple(IDL.Nat64, AccountId, IcpE8s)
    })
  });
  const Status = IDL.Variant({
    Failed: IDL.Null,
    Cancelled: IDL.Null,
    PartiallyCompletedAndCancelled: IDL.Null,
    Completed: IDL.Null,
    Pending: IDL.Null
  });
  const Data = IDL.Vec(IDL.Nat8);
  const TokenType = IDL.Variant({
    Icp: IDL.Null,
    Token: IDL.Principal,
    Cycles: IDL.Null
  });
  const Nonce = IDL.Nat;
  const OperationType = IDL.Variant({
    AddLiquidity: IDL.Null,
    Swap: IDL.Null,
    Claim: IDL.Null,
    RemoveLiquidity: IDL.Null
  });
  const TxnRecord = IDL.Record({
    fee: IDL.Record({ token0Fee: IDL.Int, token1Fee: IDL.Int }),
    status: Status,
    shares: ShareChange,
    msgCaller: IDL.Opt(IDL.Principal),
    order: IDL.Record({
      token0Value: IDL.Opt(BalanceChange),
      token1Value: IDL.Opt(BalanceChange)
    }),
    data: IDL.Opt(Data),
    time: Time,
    txid: Txid__1,
    orderMode: IDL.Variant({ AMM: IDL.Null, OrderBook: IDL.Null }),
    orderType: IDL.Opt(
      IDL.Variant({
        FAK: IDL.Null,
        FOK: IDL.Null,
        LMT: IDL.Null,
        MKT: IDL.Null
      })
    ),
    filled: IDL.Record({
      token0Value: BalanceChange,
      token1Value: BalanceChange
    }),
    token0: TokenType,
    token1: TokenType,
    nonce: Nonce,
    operation: OperationType,
    account: AccountId,
    details: IDL.Vec(
      IDL.Record({
        time: Time,
        token0Value: BalanceChange,
        counterparty: Txid__1,
        token1Value: BalanceChange
      })
    ),
    caller: AccountId,
    index: IDL.Nat,
    cyclesWallet: IDL.Opt(CyclesWallet)
  });
  const ErrorAction = IDL.Variant({
    resendIcpCycles: IDL.Null,
    resendIcp: IDL.Null,
    fallback: IDL.Null,
    resendCycles: IDL.Null,
    delete: IDL.Null
  });
  const IcpTransferLog = IDL.Record({
    to: AccountId,
    fee: IcpE8s,
    updateTime: Timestamp,
    status: TransStatus,
    value: IcpE8s,
    from: AccountId
  });
  const CyclesAmount__1 = IDL.Nat;
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const IcpE8s__1 = IDL.Nat;
  const KInterval = IDL.Nat;
  const Vol__1 = IDL.Record({ value0: IDL.Nat, value1: IDL.Nat });
  const Timestamp__2 = IDL.Nat;
  const KBar = IDL.Record({
    kid: IDL.Nat,
    low: IDL.Nat,
    vol: Vol__1,
    high: IDL.Nat,
    close: IDL.Nat,
    open: IDL.Nat,
    updatedTs: Timestamp__2
  });
  const ICSConfig = IDL.Record({
    FEE: IDL.Nat,
    RETENTION_RATE: IDL.Nat,
    TOKEN0_LIMIT: IDL.Nat,
    MAX_VOLATILITY: IDL.Nat,
    TOKEN1_LIMIT: IDL.Nat,
    ICP_FEE: IDL.Nat
  });
  const TokenSymbol = IDL.Text;
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
  const TokenInfo = IDL.Tuple(IDL.Principal, TokenSymbol, TokenStd);
  const Txid = IDL.Vec(IDL.Nat8);
  const Vol = IDL.Record({
    swapIcpVol: IcpE8s,
    swapCyclesVol: CyclesAmount
  });
  const ShareWeighted = IDL.Record({
    updateTime: Timestamp,
    shareTimeWeighted: IDL.Nat
  });
  const PriceWeighted = IDL.Record({
    updateTime: Timestamp,
    icpTimeWeighted: IDL.Nat,
    cyclesTimeWeighted: IDL.Nat
  });
  const Liquidity = IDL.Record({
    vol: Vol,
    shares: Shares,
    shareWeighted: ShareWeighted,
    unitValue: IDL.Tuple(IDL.Float64, IDL.Float64),
    icpE8s: IcpE8s,
    cycles: IDL.Nat,
    priceWeighted: PriceWeighted,
    swapCount: IDL.Nat64
  });
  const Vol2 = IDL.Record({ value0: IDL.Nat, value1: IDL.Nat });
  const PriceWeighted2 = IDL.Record({
    updateTime: Timestamp,
    token1TimeWeighted: IDL.Nat,
    token0TimeWeighted: IDL.Nat
  });
  const Liquidity2 = IDL.Record({
    vol: Vol2,
    shares: Shares,
    shareWeighted: ShareWeighted,
    unitValue: IDL.Tuple(IDL.Nat, IDL.Nat),
    value0: IDL.Nat,
    value1: IDL.Nat,
    priceWeighted: PriceWeighted2,
    swapCount: IDL.Nat64
  });
  const Shares__1 = IDL.Nat;
  const Timestamp__1 = IDL.Nat;
  const Yield = IDL.Record({
    updateTime: Timestamp,
    unitValue: IDL.Record({ icp: IcpE8s, cycles: CyclesAmount }),
    rate: IDL.Record({ rateIcp: IDL.Nat, rateCycles: IDL.Nat }),
    isClosed: IDL.Bool,
    accrued: IDL.Record({ icp: IcpE8s, cycles: CyclesAmount })
  });
  return IDL.Service({
    add: IDL.Func(
      [Address, IDL.Opt(Nonce__1), IDL.Opt(Data__1)],
      [TxnResult],
      []
    ),
    canister_status: IDL.Func([], [canister_status], []),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    claim: IDL.Func(
      [CyclesWallet__1, IDL.Opt(Nonce__1), IDL.Opt(Sa), IDL.Opt(Data__1)],
      [TxnResult],
      []
    ),
    config: IDL.Func([Config], [IDL.Bool], []),
    count: IDL.Func([IDL.Opt(Address)], [IDL.Nat], ['query']),
    cyclesToIcp: IDL.Func(
      [Address, IDL.Opt(Nonce__1), IDL.Opt(Data__1)],
      [TxnResult],
      []
    ),
    drc205_canisterId: IDL.Func([], [IDL.Principal], ['query']),
    drc205_dexInfo: IDL.Func([], [DexInfo], ['query']),
    drc205_events: IDL.Func(
      [IDL.Opt(Address__1)],
      [IDL.Vec(TxnRecord__1)],
      ['query']
    ),
    drc205_txn: IDL.Func([Txid__2], [IDL.Opt(TxnRecord__1)], ['query']),
    drc205_txn2: IDL.Func([Txid__2], [IDL.Opt(TxnRecord__1)], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    feeStatus: IDL.Func([], [FeeStatus], ['query']),
    getAccountId: IDL.Func([Address], [IDL.Text], ['query']),
    getConfig: IDL.Func([], [Config], ['query']),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getCyclesTransferLogs: IDL.Func(
      [IDL.Opt(IDL.Nat)],
      [IDL.Vec(IDL.Tuple(IDL.Nat, CyclesTransferLog)), IDL.Bool],
      []
    ),
    getErrors: IDL.Func(
      [IDL.Opt(IDL.Nat)],
      [IDL.Vec(IDL.Tuple(IDL.Nat, ErrorLog)), IDL.Bool],
      []
    ),
    getEvents: IDL.Func([IDL.Opt(Address)], [IDL.Vec(TxnRecord)], ['query']),
    getHandledErrorHistory: IDL.Func(
      [IDL.Opt(IDL.Nat)],
      [
        IDL.Vec(
          IDL.Tuple(IDL.Nat, ErrorLog, ErrorAction, IDL.Opt(CyclesWallet__1))
        ),
        IDL.Nat,
        IDL.Nat,
        IDL.Bool
      ],
      []
    ),
    getIcpTransferLogs: IDL.Func(
      [IDL.Opt(IDL.Nat)],
      [IDL.Vec(IDL.Tuple(IDL.Nat, IcpTransferLog)), IDL.Bool],
      []
    ),
    getInProgress: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Tuple(
            CyclesWallet__1,
            CyclesAmount__1,
            AccountId__1,
            IcpE8s__1,
            IDL.Nat
          )
        )
      ],
      ['query']
    ),
    getMemory: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], ['query']),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    getQuotes: IDL.Func([KInterval], [IDL.Vec(KBar)], ['query']),
    handleError: IDL.Func(
      [IDL.Nat, ErrorAction, IDL.Opt(CyclesWallet__1)],
      [IDL.Bool],
      []
    ),
    icpToCycles: IDL.Func(
      [
        IcpE8s__1,
        CyclesWallet__1,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa),
        IDL.Opt(Data__1)
      ],
      [TxnResult],
      []
    ),
    info: IDL.Func(
      [],
      [
        IDL.Record({
          decimals: IDL.Nat8,
          setting: ICSConfig,
          owner: IDL.Principal,
          name: IDL.Text,
          version: IDL.Text,
          token0: TokenInfo,
          token1: TokenInfo,
          paused: IDL.Bool
        })
      ],
      ['query']
    ),
    lastTxids: IDL.Func([IDL.Opt(Address)], [IDL.Vec(Txid)], ['query']),
    liquidity: IDL.Func([IDL.Opt(Address)], [Liquidity], ['query']),
    liquidity2: IDL.Func([IDL.Opt(Address)], [Liquidity2], ['query']),
    lpRewards: IDL.Func(
      [Address],
      [IDL.Record({ icp: IDL.Nat, cycles: IDL.Nat })],
      ['query']
    ),
    remove: IDL.Func(
      [
        IDL.Opt(Shares__1),
        CyclesWallet__1,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa),
        IDL.Opt(Data__1)
      ],
      [TxnResult],
      []
    ),
    rewardsBalance: IDL.Func(
      [Address],
      [IDL.Opt(IDL.Tuple(CyclesAmount__1, IcpE8s__1, Timestamp__1))],
      ['query']
    ),
    setPause: IDL.Func([IDL.Bool], [IDL.Bool], []),
    stats: IDL.Func(
      [],
      [
        IDL.Record({
          change24h: IDL.Float64,
          vol24h: Vol2,
          totalVol: Vol2,
          price: IDL.Float64
        })
      ],
      ['query']
    ),
    testTrieValid: IDL.Func([], [IDL.Vec(IDL.Bool)], ['query']),
    txnRecord: IDL.Func([Txid], [IDL.Opt(TxnRecord)], ['query']),
    txnRecord2: IDL.Func([Txid], [IDL.Opt(TxnRecord)], []),
    userCount: IDL.Func([], [IDL.Nat], ['query']),
    version: IDL.Func([], [IDL.Text], ['query']),
    withdraw: IDL.Func([IDL.Opt(Sa)], [], []),
    yield: IDL.Func(
      [],
      [
        IDL.Record({ apyCycles: IDL.Float64, apyIcp: IDL.Float64 }),
        IDL.Record({ apyCycles: IDL.Float64, apyIcp: IDL.Float64 })
      ],
      ['query']
    ),
    yieldRateList: IDL.Func([], [IDL.Vec(Yield)], ['query'])
  });
};
