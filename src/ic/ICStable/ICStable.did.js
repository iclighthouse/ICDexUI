export default ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Dpid = IDL.Nat;
  const TokenId = IDL.Principal;
  const Nonce = IDL.Nat;
  const Sa = IDL.Vec(IDL.Nat8);
  const Data = IDL.Vec(IDL.Nat8);
  const Dpid__1 = IDL.Nat;
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const TxnResult = IDL.Variant({
    ok: IDL.Record({ dpid: Dpid__1, txid: Txid__1 }),
    err: IDL.Record({
      code: IDL.Variant({
        NonceError: IDL.Null,
        InvalidAmount: IDL.Null,
        UndefinedError: IDL.Null,
        TransactionBlocking: IDL.Null,
        UnavailableOracle: IDL.Null,
        TransferException: IDL.Null,
        ReachedCollateralCeiling: IDL.Null
      }),
      message: IDL.Text
    })
  });
  const TokenStd__1 = IDL.Variant({
    dft: IDL.Null,
    icp: IDL.Null,
    other: IDL.Text,
    cycles: IDL.Null,
    dip20: IDL.Null,
    drc20: IDL.Null
  });
  const CollInfo = IDL.Record({
    dexSid: IDL.Nat,
    mktSid: IDL.Nat,
    swapPair: IDL.Tuple(
      IDL.Principal,
      IDL.Variant({ token0: IDL.Null, token1: IDL.Null })
    ),
    lpDiscountRate: IDL.Nat,
    totalCeiling: IDL.Nat,
    factor: IDL.Nat
  });
  const Address = IDL.Text;
  const Status = IDL.Variant({
    Opening: IDL.Null,
    Closed: IDL.Null,
    Closing: IDL.Null,
    Prepared: IDL.Null,
    Cancelled: IDL.Null
  });
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat;
  const Action = IDL.Variant({
    Opening: IDL.Null,
    Closing: IDL.Null,
    Borrowing: IDL.Null,
    Removing: IDL.Null,
    Liquidating: IDL.Null,
    Other: IDL.Text,
    Adding: IDL.Null
  });
  const Time__1 = IDL.Int;
  const OperationType = IDL.Variant({
    Withdraw: IDL.Null,
    AddLiquidity: IDL.Null,
    Stake: IDL.Null,
    Burn: IDL.Null,
    Lend: IDL.Null,
    Mint: IDL.Null,
    Deposit: IDL.Null,
    Swap: IDL.Null,
    Borrow: IDL.Null,
    Claim: IDL.Null,
    RemoveLiquidity: IDL.Null
  });
  const TokenId__1 = IDL.Principal;
  const BalanceChange = IDL.Variant({
    DebitRecord: IDL.Nat,
    CreditRecord: IDL.Nat,
    NoChange: IDL.Null
  });
  const TxnRecord__1 = IDL.Record({
    accountId: AccountId__1,
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time__1,
    txid: Txid__1,
    operations: IDL.Vec(
      IDL.Tuple(OperationType, TokenId__1, IDL.Opt(BalanceChange))
    ),
    nonce: IDL.Nat,
    index: IDL.Nat
  });
  const CollShares__2 = IDL.Nat;
  const CollValues = IDL.Tuple(TokenId__1, IDL.Nat, CollShares__2);
  const DebtPosition = IDL.Record({
    status: Status,
    debt: IDL.Nat,
    borrower: AccountId__1,
    timestamp: Timestamp,
    doing: IDL.Opt(IDL.Tuple(IDL.Nat, Action, TxnRecord__1)),
    payable: IDL.Nat,
    principalId: IDL.Opt(IDL.Principal),
    collaterals: IDL.Vec(CollValues)
  });
  const ClosingType = IDL.Variant({
    Payback: IDL.Null,
    Liquidate: IDL.Null
  });
  const DebtPositionLog = IDL.Record({
    status: Status,
    updatedTime: Timestamp,
    openingTime: Timestamp,
    borrower: AccountId__1,
    closingType: IDL.Opt(ClosingType),
    stabilityCosts: IDL.Nat,
    liquidationPenalty: IDL.Vec(IDL.Tuple(TokenId__1, IDL.Nat)),
    transactions: IDL.Vec(IDL.Tuple(IDL.Nat, Action, TxnRecord__1)),
    debtPeak: IDL.Nat
  });
  const definite_canister_settings__1 = IDL.Record({
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
    settings: definite_canister_settings__1,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const ConfigRequest = IDL.Record({
    ORACLE_INTERVAL: IDL.Opt(IDL.Nat),
    ICORACLE: IDL.Opt(IDL.Principal),
    INIT_COLL_RATIO: IDL.Opt(IDL.Nat),
    LIQUIDATION_FEE: IDL.Opt(IDL.Nat),
    MIN_COLL_RATIO: IDL.Opt(IDL.Nat),
    INIT_STABILITY_FEE: IDL.Opt(IDL.Nat),
    LIQUIDATION_INTERVAL: IDL.Opt(IDL.Nat),
    ASSESSING_INTERVAL: IDL.Opt(IDL.Nat),
    DEBT_FLOOR: IDL.Opt(IDL.Nat),
    DEBT_CEILING: IDL.Opt(IDL.Nat)
  });
  const TrieList = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(Dpid, DebtPosition)),
    totalPage: IDL.Nat
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
  const Config = IDL.Record({
    ICL: IDL.Principal,
    ORACLE_INTERVAL: IDL.Nat,
    ICORACLE: IDL.Principal,
    DUSD: IDL.Principal,
    INIT_COLL_RATIO: IDL.Nat,
    LIQUIDATION_FEE: IDL.Nat,
    MIN_COLL_RATIO: IDL.Nat,
    INIT_STABILITY_FEE: IDL.Nat,
    LIQUIDATION_INTERVAL: IDL.Nat,
    ASSESSING_INTERVAL: IDL.Nat,
    DEBT_FLOOR: IDL.Nat,
    DEBT_CEILING: IDL.Nat
  });
  const Timestamp__2 = IDL.Nat;
  const SeriesId = IDL.Nat;
  const Timestamp__3 = IDL.Nat;
  const DataResponse = IDL.Record({
    sid: SeriesId,
    decimals: IDL.Nat,
    data: IDL.Tuple(Timestamp__3, IDL.Nat),
    name: IDL.Text
  });
  const Toid = IDL.Nat;
  const canister_settings = IDL.Record({
    freezing_threshold: IDL.Opt(IDL.Nat),
    controllers: IDL.Opt(IDL.Vec(IDL.Principal)),
    memory_allocation: IDL.Opt(IDL.Nat),
    compute_allocation: IDL.Opt(IDL.Nat)
  });
  const Dpid__2 = IDL.Nat;
  const AccountId__3 = IDL.Vec(IDL.Nat8);
  const Txid__4 = IDL.Vec(IDL.Nat8);
  const OperationType__1 = IDL.Variant({
    Withdraw: IDL.Null,
    AddLiquidity: IDL.Null,
    Stake: IDL.Null,
    Burn: IDL.Null,
    Lend: IDL.Null,
    Mint: IDL.Null,
    Deposit: IDL.Null,
    Swap: IDL.Null,
    Borrow: IDL.Null,
    Claim: IDL.Null,
    RemoveLiquidity: IDL.Null
  });
  const TokenId__2 = IDL.Principal;
  const BalanceChange__1 = IDL.Variant({
    DebitRecord: IDL.Nat,
    CreditRecord: IDL.Nat,
    NoChange: IDL.Null
  });
  const TxnRecord__3 = IDL.Record({
    accountId: AccountId__3,
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time__1,
    txid: Txid__4,
    operations: IDL.Vec(
      IDL.Tuple(OperationType__1, TokenId__2, IDL.Opt(BalanceChange__1))
    ),
    nonce: IDL.Nat,
    index: IDL.Nat
  });
  const CollShares__1 = IDL.Nat;
  const ClosingType__1 = IDL.Variant({
    Payback: IDL.Null,
    Liquidate: IDL.Null
  });
  const Gas__1 = IDL.Variant({
    token: IDL.Nat,
    cycles: IDL.Nat,
    noFee: IDL.Null
  });
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const Time__2 = IDL.Int;
  const Txid__2 = IDL.Vec(IDL.Nat8);
  const Operation__1 = IDL.Variant({
    approve: IDL.Record({ allowance: IDL.Nat }),
    lockTransfer: IDL.Record({
      locked: IDL.Nat,
      expiration: Time__2,
      decider: AccountId__2
    }),
    transfer: IDL.Record({
      action: IDL.Variant({
        burn: IDL.Null,
        mint: IDL.Null,
        send: IDL.Null
      })
    }),
    executeTransfer: IDL.Record({
      fallback: IDL.Nat,
      lockedTxid: Txid__2
    })
  });
  const Transaction__1 = IDL.Record({
    to: AccountId__2,
    value: IDL.Nat,
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: AccountId__2,
    operation: Operation__1
  });
  const TxnRecord__2 = IDL.Record({
    gas: Gas__1,
    msgCaller: IDL.Opt(IDL.Principal),
    transaction: Transaction__1,
    txid: Txid__2,
    nonce: IDL.Nat,
    timestamp: Time__2,
    caller: AccountId__2,
    index: IDL.Nat
  });
  const Callback = IDL.Func([TxnRecord__2], [], []);
  const MsgType = IDL.Variant({
    onApprove: IDL.Null,
    onExecute: IDL.Null,
    onTransfer: IDL.Null,
    onLock: IDL.Null
  });
  const Sa__1 = IDL.Vec(IDL.Nat8);
  const From = IDL.Text;
  const To = IDL.Text;
  const Amount = IDL.Nat;
  const Nonce__1 = IDL.Nat;
  const Data__1 = IDL.Vec(IDL.Nat8);
  const Spender = IDL.Text;
  const Address__1 = IDL.Text;
  const TxnQueryRequest = IDL.Variant({
    getEvents: IDL.Record({ owner: IDL.Opt(Address__1) }),
    txnCount: IDL.Record({ owner: Address__1 }),
    lockedTxns: IDL.Record({ owner: Address__1 }),
    lastTxids: IDL.Record({ owner: Address__1 }),
    lastTxidsGlobal: IDL.Null,
    getTxn: IDL.Record({ txid: Txid__2 }),
    txnCountGlobal: IDL.Null
  });
  const Timeout = IDL.Nat32;
  const Decider = IDL.Text;
  const ExecuteType = IDL.Variant({
    fallback: IDL.Null,
    send: IDL.Nat,
    sendAll: IDL.Null
  });
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const AccountBalanceArgs = IDL.Record({ account: AccountIdentifier });
  const ICP = IDL.Record({ e8s: IDL.Nat64 });
  const Memo = IDL.Nat64;
  const SubAccount = IDL.Vec(IDL.Nat8);
  const Timestamp__1 = IDL.Record({ timestamp_nanos: IDL.Nat64 });
  const TransferArgs = IDL.Record({
    to: AccountIdentifier,
    fee: ICP,
    memo: Memo,
    from_subaccount: IDL.Opt(SubAccount),
    created_at_time: IDL.Opt(Timestamp__1),
    amount: ICP
  });
  const Amount__1 = IDL.Nat;
  const Nonce__2 = IDL.Nat;
  const Sa__2 = IDL.Vec(IDL.Nat8);
  const Data__2 = IDL.Vec(IDL.Nat8);
  const CallType__1 = IDL.Variant({
    IC: IDL.Variant({
      stop_canister: IDL.Record({ canister_id: IDL.Principal }),
      start_canister: IDL.Record({ canister_id: IDL.Principal }),
      canister_status: IDL.Record({ canister_id: IDL.Principal }),
      update_settings: IDL.Record({
        canister_id: IDL.Principal,
        settings: canister_settings
      }),
      raw_rand: IDL.Null,
      deposit_cycles: IDL.Record({ canister_id: IDL.Principal })
    }),
    __block: IDL.Null,
    This: IDL.Variant({
      dp_open: Dpid__2,
      dp_compAdd: Dpid__2,
      dp_compClose: Dpid__2,
      dp_compOpen: Dpid__2,
      dp_generate: IDL.Tuple(Dpid__2, IDL.Nat, TxnRecord__3),
      dp_add: IDL.Tuple(
        Dpid__2,
        IDL.Vec(IDL.Tuple(TokenId__2, IDL.Nat, CollShares__1))
      ),
      dp_close: IDL.Tuple(
        Dpid__2,
        IDL.Nat,
        TxnRecord__3,
        ClosingType__1,
        IDL.Nat,
        IDL.Vec(IDL.Tuple(TokenId__2, IDL.Nat))
      ),
      dp_remove: IDL.Tuple(Dpid__2, IDL.Nat, TxnRecord__3)
    }),
    DIP20: IDL.Variant({
      decimals: IDL.Null,
      transferFrom: IDL.Tuple(IDL.Principal, IDL.Principal, IDL.Nat),
      approve: IDL.Tuple(IDL.Principal, IDL.Nat),
      balanceOf: IDL.Principal,
      transfer: IDL.Tuple(IDL.Principal, IDL.Nat)
    }),
    DRC20: IDL.Variant({
      decimals: IDL.Null,
      subscribe: IDL.Tuple(Callback, IDL.Vec(MsgType), IDL.Opt(Sa__1)),
      transferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      approve: IDL.Tuple(
        Spender,
        Amount,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      txnQuery: TxnQueryRequest,
      balanceOf: Address__1,
      txnRecord: Txid__2,
      lockTransfer: IDL.Tuple(
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      transfer: IDL.Tuple(
        To,
        Amount,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      cyclesReceive: IDL.Opt(Address__1),
      executeTransfer: IDL.Tuple(
        Txid__2,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      getCoinSeconds: IDL.Opt(Address__1),
      lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      )
    }),
    CyclesWallet: IDL.Variant({
      get_events: IDL.Opt(
        IDL.Record({ to: IDL.Opt(IDL.Nat32), from: IDL.Opt(IDL.Nat32) })
      ),
      get_chart: IDL.Opt(
        IDL.Record({
          count: IDL.Opt(IDL.Nat32),
          precision: IDL.Opt(IDL.Nat64)
        })
      ),
      wallet_call: IDL.Record({
        args: IDL.Vec(IDL.Nat8),
        cycles: IDL.Nat64,
        method_name: IDL.Text,
        canister: IDL.Principal
      }),
      wallet_send: IDL.Record({
        canister: IDL.Principal,
        amount: IDL.Nat64
      }),
      wallet_balance: IDL.Null,
      wallet_receive: IDL.Null
    }),
    Ledger: IDL.Variant({
      account_balance: AccountBalanceArgs,
      transfer: TransferArgs
    }),
    ICTokens: IDL.Variant({
      burn: IDL.Tuple(
        Amount,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      mint: IDL.Tuple(Address__1, Amount, IDL.Opt(Nonce__1), IDL.Opt(Data__1)),
      heldFirstTime: Address__1
    }),
    ICSwap: IDL.Variant({
      add: IDL.Tuple(
        IDL.Opt(Amount__1),
        IDL.Opt(Amount__1),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__2),
        IDL.Opt(Data__2)
      ),
      remove: IDL.Tuple(
        IDL.Opt(Amount__1),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__2),
        IDL.Opt(Data__2)
      ),
      fallback: IDL.Opt(Sa__2),
      claim: IDL.Tuple(IDL.Opt(Nonce__2), IDL.Opt(Sa__2), IDL.Opt(Data__2)),
      swap: IDL.Tuple(
        IDL.Variant({ token0: Amount__1, token1: Amount__1 }),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__2),
        IDL.Opt(Data__2)
      ),
      swap2: IDL.Tuple(
        IDL.Principal,
        Amount__1,
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__2),
        IDL.Opt(Data__2)
      )
    }),
    __skip: IDL.Null
  });
  const Ttid = IDL.Nat;
  const OrderStatus = IDL.Variant({
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Recovered: IDL.Null,
    Compensating: IDL.Null,
    Blocking: IDL.Null
  });
  const CalleeStatus = IDL.Record({
    continuousFailure: IDL.Nat,
    successCount: IDL.Nat,
    failureCount: IDL.Nat
  });
  const Status__3 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Ttid__1 = IDL.Nat;
  const Toid__1 = IDL.Nat;
  const CallType = IDL.Variant({
    IC: IDL.Variant({
      stop_canister: IDL.Record({ canister_id: IDL.Principal }),
      start_canister: IDL.Record({ canister_id: IDL.Principal }),
      canister_status: IDL.Record({ canister_id: IDL.Principal }),
      update_settings: IDL.Record({
        canister_id: IDL.Principal,
        settings: canister_settings
      }),
      raw_rand: IDL.Null,
      deposit_cycles: IDL.Record({ canister_id: IDL.Principal })
    }),
    __block: IDL.Null,
    This: IDL.Variant({
      dp_open: Dpid__2,
      dp_compAdd: Dpid__2,
      dp_compClose: Dpid__2,
      dp_compOpen: Dpid__2,
      dp_generate: IDL.Tuple(Dpid__2, IDL.Nat, TxnRecord__3),
      dp_add: IDL.Tuple(
        Dpid__2,
        IDL.Vec(IDL.Tuple(TokenId__2, IDL.Nat, CollShares__1))
      ),
      dp_close: IDL.Tuple(
        Dpid__2,
        IDL.Nat,
        TxnRecord__3,
        ClosingType__1,
        IDL.Nat,
        IDL.Vec(IDL.Tuple(TokenId__2, IDL.Nat))
      ),
      dp_remove: IDL.Tuple(Dpid__2, IDL.Nat, TxnRecord__3)
    }),
    DIP20: IDL.Variant({
      decimals: IDL.Null,
      transferFrom: IDL.Tuple(IDL.Principal, IDL.Principal, IDL.Nat),
      approve: IDL.Tuple(IDL.Principal, IDL.Nat),
      balanceOf: IDL.Principal,
      transfer: IDL.Tuple(IDL.Principal, IDL.Nat)
    }),
    DRC20: IDL.Variant({
      decimals: IDL.Null,
      subscribe: IDL.Tuple(Callback, IDL.Vec(MsgType), IDL.Opt(Sa__1)),
      transferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      approve: IDL.Tuple(
        Spender,
        Amount,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      txnQuery: TxnQueryRequest,
      balanceOf: Address__1,
      txnRecord: Txid__2,
      lockTransfer: IDL.Tuple(
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      transfer: IDL.Tuple(
        To,
        Amount,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      cyclesReceive: IDL.Opt(Address__1),
      executeTransfer: IDL.Tuple(
        Txid__2,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      getCoinSeconds: IDL.Opt(Address__1),
      lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      )
    }),
    CyclesWallet: IDL.Variant({
      get_events: IDL.Opt(
        IDL.Record({ to: IDL.Opt(IDL.Nat32), from: IDL.Opt(IDL.Nat32) })
      ),
      get_chart: IDL.Opt(
        IDL.Record({
          count: IDL.Opt(IDL.Nat32),
          precision: IDL.Opt(IDL.Nat64)
        })
      ),
      wallet_call: IDL.Record({
        args: IDL.Vec(IDL.Nat8),
        cycles: IDL.Nat64,
        method_name: IDL.Text,
        canister: IDL.Principal
      }),
      wallet_send: IDL.Record({
        canister: IDL.Principal,
        amount: IDL.Nat64
      }),
      wallet_balance: IDL.Null,
      wallet_receive: IDL.Null
    }),
    Ledger: IDL.Variant({
      account_balance: AccountBalanceArgs,
      transfer: TransferArgs
    }),
    ICTokens: IDL.Variant({
      burn: IDL.Tuple(
        Amount,
        IDL.Opt(Nonce__1),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__1)
      ),
      mint: IDL.Tuple(Address__1, Amount, IDL.Opt(Nonce__1), IDL.Opt(Data__1)),
      heldFirstTime: Address__1
    }),
    ICSwap: IDL.Variant({
      add: IDL.Tuple(
        IDL.Opt(Amount__1),
        IDL.Opt(Amount__1),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__2),
        IDL.Opt(Data__2)
      ),
      remove: IDL.Tuple(
        IDL.Opt(Amount__1),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__2),
        IDL.Opt(Data__2)
      ),
      fallback: IDL.Opt(Sa__2),
      claim: IDL.Tuple(IDL.Opt(Nonce__2), IDL.Opt(Sa__2), IDL.Opt(Data__2)),
      swap: IDL.Tuple(
        IDL.Variant({ token0: Amount__1, token1: Amount__1 }),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__2),
        IDL.Opt(Data__2)
      ),
      swap2: IDL.Tuple(
        IDL.Principal,
        Amount__1,
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__2),
        IDL.Opt(Data__2)
      )
    }),
    __skip: IDL.Null
  });
  const Attempts = IDL.Nat;
  const Callee = IDL.Principal;
  const Compensation = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time__1,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    compFor: IDL.Opt(Ttid__1),
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee
  });
  const Task__1 = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time__1,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    compFor: IDL.Opt(Ttid__1),
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee
  });
  const SagaTask = IDL.Record({
    status: Status__3,
    comp: IDL.Opt(Compensation),
    task: Task__1,
    ttid: Ttid
  });
  List_1.fill(IDL.Opt(IDL.Tuple(SagaTask, List_1)));
  const Tcid = IDL.Nat;
  const CompTask = IDL.Record({
    status: Status__3,
    comp: Compensation,
    tcid: Tcid,
    forTtid: Ttid
  });
  List.fill(IDL.Opt(IDL.Tuple(CompTask, List)));
  const CompStrategy = IDL.Variant({
    Backward: IDL.Null,
    Forward: IDL.Null
  });
  const Order = IDL.Record({
    status: OrderStatus,
    tasks: List_1,
    callbackStatus: IDL.Opt(Status__3),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    comps: List,
    time: Time__1,
    compStrategy: CompStrategy,
    allowPushing: IDL.Variant({ Opening: IDL.Null, Closed: IDL.Null })
  });
  const Status__2 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const definite_canister_settings = IDL.Record({
    freezing_threshold: IDL.Nat,
    controllers: IDL.Vec(IDL.Principal),
    memory_allocation: IDL.Nat,
    compute_allocation: IDL.Nat
  });
  const TxReceipt = IDL.Variant({
    Ok: IDL.Nat,
    Err: IDL.Variant({
      InsufficientAllowance: IDL.Null,
      InsufficientBalance: IDL.Null,
      ErrorOperationStyle: IDL.Null,
      Unauthorized: IDL.Null,
      LedgerTrap: IDL.Null,
      ErrorTo: IDL.Null,
      Other: IDL.Text,
      BlockUsed: IDL.Null,
      AmountTooSmall: IDL.Null
    })
  });
  const TxnResult__1 = IDL.Variant({
    ok: Txid__2,
    err: IDL.Record({
      code: IDL.Variant({
        NonceError: IDL.Null,
        InsufficientGas: IDL.Null,
        InsufficientAllowance: IDL.Null,
        UndefinedError: IDL.Null,
        InsufficientBalance: IDL.Null,
        NoLockedTransfer: IDL.Null,
        DuplicateExecutedTransfer: IDL.Null,
        LockedTransferExpired: IDL.Null
      }),
      message: IDL.Text
    })
  });
  const TxnQueryResponse = IDL.Variant({
    getEvents: IDL.Vec(TxnRecord__2),
    txnCount: IDL.Nat,
    lockedTxns: IDL.Record({
      txns: IDL.Vec(TxnRecord__2),
      lockedBalance: IDL.Nat
    }),
    lastTxids: IDL.Vec(Txid__2),
    lastTxidsGlobal: IDL.Vec(Txid__2),
    getTxn: IDL.Opt(TxnRecord__2),
    txnCountGlobal: IDL.Nat
  });
  const CoinSeconds = IDL.Record({
    updateTime: IDL.Int,
    coinSeconds: IDL.Nat
  });
  const Role = IDL.Variant({
    Custodian: IDL.Null,
    Contact: IDL.Null,
    Controller: IDL.Null
  });
  const EventKind = IDL.Variant({
    CyclesReceived: IDL.Record({
      from: IDL.Principal,
      amount: IDL.Nat64
    }),
    CanisterCreated: IDL.Record({
      cycles: IDL.Nat64,
      canister: IDL.Principal
    }),
    CanisterCalled: IDL.Record({
      cycles: IDL.Nat64,
      method_name: IDL.Text,
      canister: IDL.Principal
    }),
    CyclesSent: IDL.Record({
      to: IDL.Principal,
      amount: IDL.Nat64,
      refund: IDL.Nat64
    }),
    AddressRemoved: IDL.Record({ id: IDL.Principal }),
    WalletDeployed: IDL.Record({ canister: IDL.Principal }),
    AddressAdded: IDL.Record({
      id: IDL.Principal,
      name: IDL.Opt(IDL.Text),
      role: Role
    })
  });
  const Event = IDL.Record({
    id: IDL.Nat32,
    kind: EventKind,
    timestamp: IDL.Nat64
  });
  const WalletResultCall = IDL.Variant({
    Ok: IDL.Record({ return: IDL.Vec(IDL.Nat8) }),
    Err: IDL.Text
  });
  const WalletResult = IDL.Variant({ Ok: IDL.Null, Err: IDL.Text });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
    BadFee: IDL.Record({ expected_fee: ICP }),
    TxDuplicate: IDL.Record({ duplicate_of: BlockIndex }),
    TxCreatedInFuture: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: ICP })
  });
  const TransferResult = IDL.Variant({
    Ok: BlockIndex,
    Err: TransferError
  });
  const TxnStatus = IDL.Variant({
    Success: IDL.Null,
    Failure: IDL.Null,
    Blocking: IDL.Null,
    Pending: IDL.Null
  });
  const Txid__3 = IDL.Vec(IDL.Nat8);
  const TxnResult__2 = IDL.Variant({
    ok: IDL.Record({ status: TxnStatus, txid: Txid__3 }),
    err: IDL.Record({
      code: IDL.Variant({
        InsufficientShares: IDL.Null,
        PoolIsEmpty: IDL.Null,
        NonceError: IDL.Null,
        InvalidAmount: IDL.Null,
        UndefinedError: IDL.Null,
        UnacceptableVolatility: IDL.Null,
        TransactionBlocking: IDL.Null,
        TransferException: IDL.Null
      }),
      message: IDL.Text
    })
  });
  const Receipt = IDL.Variant({
    IC: IDL.Variant({
      stop_canister: IDL.Null,
      start_canister: IDL.Null,
      canister_status: IDL.Record({
        status: IDL.Variant({
          stopped: IDL.Null,
          stopping: IDL.Null,
          running: IDL.Null
        }),
        memory_size: IDL.Nat,
        cycles: IDL.Nat,
        settings: definite_canister_settings,
        module_hash: IDL.Opt(IDL.Vec(IDL.Nat8))
      }),
      update_settings: IDL.Null,
      raw_rand: IDL.Vec(IDL.Nat8),
      deposit_cycles: IDL.Null
    }),
    __block: IDL.Null,
    This: IDL.Variant({
      dp_open: IDL.Null,
      dp_compAdd: IDL.Null,
      dp_compClose: IDL.Null,
      dp_compOpen: IDL.Null,
      dp_generate: IDL.Null,
      dp_add: IDL.Null,
      dp_close: IDL.Null,
      dp_remove: IDL.Null
    }),
    DIP20: IDL.Variant({
      decimals: IDL.Nat8,
      transferFrom: TxReceipt,
      approve: TxReceipt,
      balanceOf: IDL.Nat,
      transfer: TxReceipt
    }),
    DRC20: IDL.Variant({
      decimals: IDL.Nat8,
      subscribe: IDL.Bool,
      transferFrom: TxnResult__1,
      approve: TxnResult__1,
      txnQuery: TxnQueryResponse,
      balanceOf: Amount,
      txnRecord: IDL.Opt(TxnRecord__2),
      lockTransfer: TxnResult__1,
      transfer: TxnResult__1,
      cyclesReceive: IDL.Nat,
      executeTransfer: TxnResult__1,
      getCoinSeconds: IDL.Tuple(CoinSeconds, IDL.Opt(CoinSeconds)),
      lockTransferFrom: TxnResult__1
    }),
    CyclesWallet: IDL.Variant({
      get_events: IDL.Vec(Event),
      get_chart: IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Nat64)),
      wallet_call: WalletResultCall,
      wallet_send: WalletResult,
      wallet_balance: IDL.Record({ amount: IDL.Nat64 }),
      wallet_receive: IDL.Null
    }),
    Ledger: IDL.Variant({
      account_balance: ICP,
      transfer: TransferResult
    }),
    ICTokens: IDL.Variant({
      burn: TxnResult__1,
      mint: TxnResult__1,
      heldFirstTime: IDL.Opt(IDL.Int)
    }),
    ICSwap: IDL.Variant({
      add: TxnResult__2,
      remove: TxnResult__2,
      fallback: IDL.Null,
      claim: TxnResult__2,
      swap: TxnResult__2,
      swap2: TxnResult__2
    }),
    __skip: IDL.Null
  });
  const ErrorCode = IDL.Variant({
    canister_error: IDL.Null,
    system_transient: IDL.Null,
    future: IDL.Nat32,
    canister_reject: IDL.Null,
    destination_invalid: IDL.Null,
    system_fatal: IDL.Null
  });
  const Err = IDL.Record({ code: ErrorCode, message: IDL.Text });
  const TaskResult = IDL.Tuple(Status__2, IDL.Opt(Receipt), IDL.Opt(Err));
  const Status__1 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Task = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time__1,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    compFor: IDL.Opt(Ttid__1),
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee
  });
  const TaskEvent = IDL.Record({
    result: TaskResult,
    callbackStatus: IDL.Opt(Status__1),
    task: Task,
    time: Time__1,
    toid: IDL.Opt(Toid__1),
    ttid: Ttid__1,
    attempts: Attempts
  });
  const ErrorLog = IDL.Record({
    result: IDL.Opt(TaskResult),
    time: Time__1,
    ttid: Ttid__1,
    callee: IDL.Opt(Callee)
  });
  const AssetResponse__1 = IDL.Record({
    tokenId: TokenId__1,
    balance: IDL.Nat,
    value: IDL.Nat,
    symbol: IDL.Text
  });
  const ChargeMethod = IDL.Variant({ ICL: IDL.Null, DUSD: IDL.Null });
  const CollShares = IDL.Nat;
  const AssetResponse = IDL.Record({
    tokenId: TokenId__1,
    balance: IDL.Nat,
    value: IDL.Nat,
    symbol: IDL.Text
  });
  const StatsResponse = IDL.Record({
    assets: IDL.Vec(IDL.Tuple(AssetResponse, IDL.Nat)),
    liquidity: IDL.Nat,
    reserve: IDL.Int,
    openingDpCount: IDL.Nat,
    supply: IDL.Nat,
    assetTotalValue: IDL.Nat,
    dpCount: IDL.Nat
  });
  const Gas = IDL.Variant({
    token: IDL.Nat,
    cycles: IDL.Nat,
    noFee: IDL.Null
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const Time = IDL.Int;
  const Txid = IDL.Vec(IDL.Nat8);
  const Operation = IDL.Variant({
    approve: IDL.Record({ allowance: IDL.Nat }),
    lockTransfer: IDL.Record({
      locked: IDL.Nat,
      expiration: Time,
      decider: AccountId
    }),
    transfer: IDL.Record({
      action: IDL.Variant({
        burn: IDL.Null,
        mint: IDL.Null,
        send: IDL.Null
      })
    }),
    executeTransfer: IDL.Record({
      fallback: IDL.Nat,
      lockedTxid: Txid
    })
  });
  const Transaction = IDL.Record({
    to: AccountId,
    value: IDL.Nat,
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: AccountId,
    operation: Operation
  });
  const TxnRecord = IDL.Record({
    gas: Gas,
    msgCaller: IDL.Opt(IDL.Principal),
    transaction: Transaction,
    txid: Txid,
    nonce: IDL.Nat,
    timestamp: Time,
    caller: AccountId,
    index: IDL.Nat
  });
  const TokenStd = IDL.Variant({
    dft: IDL.Null,
    icp: IDL.Null,
    other: IDL.Text,
    cycles: IDL.Null,
    dip20: IDL.Null,
    drc20: IDL.Null
  });
  const TokenSymbol = IDL.Text;
  const TokenInfo = IDL.Record({
    std: TokenStd,
    decimals: IDL.Nat8,
    tokenId: TokenId__1,
    gasToken: IDL.Nat,
    symbol: TokenSymbol,
    gasCycles: IDL.Nat
  });
  const CollInfoRequest = IDL.Record({
    tokenId: IDL.Principal,
    dexSid: IDL.Opt(IDL.Nat),
    mktSid: IDL.Opt(IDL.Nat),
    swapPair: IDL.Opt(
      IDL.Tuple(
        IDL.Principal,
        IDL.Variant({ token0: IDL.Null, token1: IDL.Null })
      )
    ),
    lpDiscountRate: IDL.Opt(IDL.Nat),
    totalCeiling: IDL.Opt(IDL.Nat),
    factor: IDL.Opt(IDL.Nat)
  });
  return IDL.Service({
    add: IDL.Func(
      [
        Dpid,
        IDL.Vec(IDL.Tuple(TokenId, IDL.Nat)),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ],
      [TxnResult],
      []
    ),
    addCollateral: IDL.Func([TokenId, TokenStd__1, CollInfo], [IDL.Bool], []),
    borrower: IDL.Func(
      [Address],
      [
        IDL.Nat,
        IDL.Vec(IDL.Tuple(Dpid, DebtPosition)),
        IDL.Vec(IDL.Tuple(Dpid, DebtPositionLog))
      ],
      ['query']
    ),
    canister_status: IDL.Func([], [canister_status], []),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    collaterals: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(TokenId, CollInfo, CollInfo))],
      ['query']
    ),
    config: IDL.Func([ConfigRequest], [IDL.Bool], []),
    dp: IDL.Func([Dpid], [IDL.Opt(DebtPosition)], ['query']),
    dpList: IDL.Func(
      [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList],
      ['query']
    ),
    drc207: IDL.Func([], [DRC207Support], []),
    feedback: IDL.Func([], [], []),
    generate: IDL.Func(
      [Dpid, IDL.Opt(IDL.Nat), IDL.Opt(Nonce), IDL.Opt(Sa), IDL.Opt(Data)],
      [TxnResult],
      []
    ),
    getConfig: IDL.Func([], [Config, Config], ['query']),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    getPrice: IDL.Func(
      [],
      [IDL.Opt(IDL.Tuple(Timestamp__2, IDL.Vec(DataResponse)))],
      ['query']
    ),
    ictc_addAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_appendTT: IDL.Func(
      [Dpid, Toid, IDL.Principal, CallType__1, IDL.Vec(Ttid)],
      [Ttid],
      []
    ),
    ictc_completeTO: IDL.Func([Toid, OrderStatus], [IDL.Bool], []),
    ictc_getAdmins: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    ictc_getCalleeStatus: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(CalleeStatus)],
      ['query']
    ),
    ictc_getTO: IDL.Func([Toid], [IDL.Opt(Order)], ['query']),
    ictc_getTOCount: IDL.Func([], [IDL.Nat], ['query']),
    ictc_getTOPool: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(Toid, IDL.Opt(Order)))],
      ['query']
    ),
    ictc_getTOs: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(Toid, Order)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_getTT: IDL.Func([Ttid], [IDL.Opt(TaskEvent)], ['query']),
    ictc_getTTByTO: IDL.Func([Toid], [IDL.Vec(TaskEvent)], ['query']),
    ictc_getTTErrors: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(IDL.Nat, ErrorLog)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_getTTPool: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(Ttid, Task__1))],
      ['query']
    ),
    ictc_getTTs: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(Ttid, TaskEvent)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_removeAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_removeTT: IDL.Func([Toid, Ttid], [IDL.Opt(Ttid)], []),
    init: IDL.Func([], [IDL.Bool], []),
    liquidity: IDL.Func(
      [IDL.Opt(Address)],
      [IDL.Nat, IDL.Vec(AssetResponse__1)],
      ['query']
    ),
    log: IDL.Func([Dpid], [IDL.Opt(DebtPositionLog)], ['query']),
    name: IDL.Func([], [IDL.Text], ['query']),
    open: IDL.Func(
      [
        IDL.Vec(IDL.Tuple(TokenId, IDL.Nat)),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ],
      [TxnResult],
      []
    ),
    payback: IDL.Func(
      [Dpid, ChargeMethod, IDL.Opt(Nonce), IDL.Opt(Sa), IDL.Opt(Data)],
      [TxnResult],
      []
    ),
    remove: IDL.Func(
      [
        Dpid,
        IDL.Tuple(TokenId, IDL.Opt(CollShares)),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ],
      [TxnResult],
      []
    ),
    setPause: IDL.Func([IDL.Bool], [IDL.Bool], []),
    stats: IDL.Func([], [StatsResponse], ['query']),
    syncOracle: IDL.Func([], [IDL.Bool], []),
    syncToken: IDL.Func(
      [IDL.Opt(TokenId), IDL.Opt(TokenStd__1)],
      [IDL.Bool],
      []
    ),
    test: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], []),
    timer_tick: IDL.Func([], [], []),
    tokenCallback: IDL.Func([TxnRecord], [], []),
    tokenNotify: IDL.Func([IDL.Principal, IDL.Vec(IDL.Nat8)], [], []),
    tokens: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenId, TokenInfo))], ['query']),
    updateCollateral: IDL.Func([CollInfoRequest], [IDL.Bool], []),
    version: IDL.Func([], [IDL.Text], ['query']),
    wallet_receive: IDL.Func([], [], [])
  });
};
export const init = ({ IDL }) => {
  return [];
};
