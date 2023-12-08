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
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat;
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
  const Time = IDL.Int;
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
  const TrieList__1_1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(PairCanister, SwapPair)),
    totalPage: IDL.Nat
  });
  const TokenInfo__1 = IDL.Tuple(IDL.Principal, TokenSymbol, TokenStd__1);
  const Amount__1 = IDL.Nat;
  const Config__1 = IDL.Record({
    lowerLimit: IDL.Opt(IDL.Nat),
    threshold: IDL.Opt(Amount__1),
    upperLimit: IDL.Opt(IDL.Nat),
    volFactor: IDL.Opt(IDL.Nat),
    spreadRatePpm: IDL.Opt(IDL.Nat),
    withdrawalFeePpm: IDL.Opt(IDL.Nat)
  });
  const TrieList__1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(
      IDL.Tuple(PairCanister, IDL.Vec(IDL.Tuple(IDL.Principal, AccountId__1)))
    ),
    totalPage: IDL.Nat
  });
  const Timestamp__1 = IDL.Nat;
  const PoolBalance = IDL.Record({
    ts: Timestamp__1,
    balance0: Amount__1,
    balance1: Amount__1
  });
  const IDORequirement = IDL.Record({
    threshold: IDL.Float64,
    pairs: IDL.Vec(
      IDL.Record({ pair: IDL.Principal, token1ToUsdRatio: IDL.Float64 })
    )
  });
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const Sa = IDL.Vec(IDL.Nat8);
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
  const Txid = IDL.Vec(IDL.Nat8);
  const TradingStatus = IDL.Variant({
    Todo: IDL.Null,
    Closed: IDL.Null,
    Cancelled: IDL.Null,
    Pending: IDL.Null
  });
  const Toid = IDL.Nat;
  const OrderType = IDL.Variant({
    FAK: IDL.Null,
    FOK: IDL.Null,
    LMT: IDL.Null,
    MKT: IDL.Null
  });
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
  const AccountId = IDL.Vec(IDL.Nat8);
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
    account: AccountId,
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
  return IDL.Service({
    NFTBalance: IDL.Func([Address], [IDL.Vec(NFT)], ['query']),
    NFTBindMaker: IDL.Func(
      [IDL.Text, IDL.Principal, AccountId__1, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [],
      []
    ),
    NFTBindingMakers: IDL.Func(
      [IDL.Text],
      [IDL.Vec(IDL.Tuple(IDL.Principal, AccountId__1))],
      ['query']
    ),
    NFTDeposit: IDL.Func(
      [CollectionId, TokenIdentifier, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [],
      []
    ),
    NFTUnbindMaker: IDL.Func(
      [IDL.Text, IDL.Principal, AccountId__1, IDL.Opt(IDL.Vec(IDL.Nat8))],
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
      [IDL.Vec(IDL.Tuple(AccountId__1, IDL.Vec(NFT)))],
      ['query']
    ),
    backup: IDL.Func([IDL.Principal], [Timestamp], []),
    backupToTempCanister: IDL.Func(
      [IDL.Principal, IDL.Principal],
      [IDL.Bool],
      []
    ),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    create: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat)],
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
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    getPairs: IDL.Func(
      [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList__1_1],
      ['query']
    ),
    getPairsByToken: IDL.Func(
      [IDL.Principal],
      [IDL.Vec(IDL.Tuple(PairCanister, SwapPair))],
      ['query']
    ),
    getSnapshots: IDL.Func([IDL.Principal], [IDL.Vec(Timestamp)], ['query']),
    getTokens: IDL.Func([], [IDL.Vec(TokenInfo__1)], ['query']),
    getWasmVersion: IDL.Func([], [IDL.Text, IDL.Text, IDL.Nat], ['query']),
    maker_cancelAllOrders: IDL.Func([IDL.Principal], [], []),
    maker_config: IDL.Func([IDL.Principal, Config__1], [IDL.Bool], []),
    maker_create: IDL.Func(
      [
        IDL.Record({
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
    maker_createGridOrder: IDL.Func([IDL.Principal], [], []),
    maker_deleteGridOrder: IDL.Func([IDL.Principal], [], []),
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
      [AccountId__1, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList__1],
      ['query']
    ),
    maker_getPublicMakers: IDL.Func(
      [IDL.Opt(IDL.Principal), IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList__1],
      ['query']
    ),
    maker_getWasmVersion: IDL.Func(
      [],
      [IDL.Text, IDL.Text, IDL.Nat],
      ['query']
    ),
    maker_remove: IDL.Func([IDL.Principal, IDL.Principal], [], []),
    maker_resetLocalBalance: IDL.Func([IDL.Principal], [PoolBalance], []),
    maker_rollback: IDL.Func(
      [IDL.Principal, IDL.Principal],
      [IDL.Opt(IDL.Principal)],
      []
    ),
    maker_setControllers: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Vec(IDL.Principal)],
      [IDL.Bool],
      []
    ),
    maker_setPause: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    maker_setWasm: IDL.Func(
      [IDL.Vec(IDL.Nat8), IDL.Text, IDL.Bool, IDL.Bool],
      [],
      []
    ),
    maker_transactionLock: IDL.Func(
      [IDL.Principal, IDL.Variant({ lock: IDL.Null, unlock: IDL.Null })],
      [IDL.Bool],
      []
    ),
    maker_update: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Opt(IDL.Text), IDL.Text],
      [IDL.Opt(IDL.Principal)],
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
    pair_changeOwner: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], []),
    pair_config: IDL.Func(
      [IDL.Principal, IDL.Opt(DexConfig), IDL.Opt(Config)],
      [IDL.Bool],
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
    pair_ictcClearTTPool: IDL.Func([IDL.Principal], [], []),
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
    pair_pendingAll: IDL.Func(
      [IDL.Principal, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList],
      []
    ),
    pair_removeVipMaker: IDL.Func([IDL.Principal, Address], [], []),
    pair_setOrderFail: IDL.Func([IDL.Principal, IDL.Text], [IDL.Bool], []),
    pair_setUpgradeMode: IDL.Func(
      [IDL.Principal, IDL.Variant({ All: IDL.Null, Base: IDL.Null })],
      [],
      []
    ),
    pair_setVipMaker: IDL.Func([IDL.Principal, Address, IDL.Nat], [], []),
    pair_sync: IDL.Func([IDL.Principal], [], []),
    pair_taSetDescription: IDL.Func([IDL.Principal, IDL.Text], [], []),
    pair_withdrawCycles: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    put: IDL.Func([SwapPair], [], []),
    recovery: IDL.Func([IDL.Principal, Timestamp], [IDL.Bool], []),
    reinstall: IDL.Func(
      [IDL.Principal, IDL.Text, IDL.Bool],
      [IDL.Opt(PairCanister)],
      []
    ),
    remove: IDL.Func([IDL.Principal], [], []),
    rollback: IDL.Func([IDL.Principal], [IDL.Opt(PairCanister)], []),
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
    setWasm: IDL.Func(
      [IDL.Vec(IDL.Nat8), IDL.Text, IDL.Bool, IDL.Bool],
      [],
      []
    ),
    sync: IDL.Func([], [], []),
    sys_burn: IDL.Func([IDL.Nat], [], []),
    sys_cancelOrder: IDL.Func([IDL.Principal, IDL.Opt(Txid__1)], [], []),
    sys_order: IDL.Func(
      [IDL.Principal, TokenStd, IDL.Nat, IDL.Principal, OrderPrice],
      [TradingResult],
      []
    ),
    sys_withdraw: IDL.Func(
      [IDL.Principal, TokenStd, IDL.Principal, IDL.Nat],
      [],
      []
    ),
    timerStart: IDL.Func([IDL.Nat], [], []),
    timerStop: IDL.Func([], [], []),
    update: IDL.Func([IDL.Principal, IDL.Text], [IDL.Opt(PairCanister)], []),
    wallet_receive: IDL.Func([], [], [])
  });
};
