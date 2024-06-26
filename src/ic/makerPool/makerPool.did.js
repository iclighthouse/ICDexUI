export default ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const ListPage = IDL.Nat;
  const ListSize = IDL.Nat;
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat;
  const ShareWeighted = IDL.Record({
    updateTime: Timestamp,
    shareTimeWeighted: IDL.Nat
  });
  const TrieList__1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(AccountId__2, IDL.Tuple(IDL.Nat, ShareWeighted))),
    totalPage: IDL.Nat
  });
  const Amount__1 = IDL.Nat;
  const Sa = IDL.Vec(IDL.Nat8);
  const Shares = IDL.Nat;
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
  const BackupRequest = IDL.Variant({
    blockEvents: IDL.Null,
    accountShares: IDL.Variant({ All: IDL.Null, Base: IDL.Null }),
    accountVolUsed: IDL.Variant({ All: IDL.Null, Base: IDL.Null }),
    unitNetValues: IDL.Variant({ All: IDL.Null, Base: IDL.Null }),
    fallbacking_accounts: IDL.Null,
    otherData: IDL.Null,
    accountEvents: IDL.Null
  });
  const Shares__1 = IDL.Nat;
  const Amount = IDL.Nat;
  const ICRC1Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const InitArgs = IDL.Record({
    creator: AccountId,
    spreadRate: IDL.Nat,
    allow: IDL.Variant({ Private: IDL.Null, Public: IDL.Null }),
    lowerLimit: IDL.Nat,
    threshold: Amount,
    upperLimit: IDL.Nat,
    name: IDL.Text,
    pair: IDL.Principal,
    token0: IDL.Principal,
    token1: IDL.Principal,
    token0Std: TokenStd,
    token1Std: TokenStd,
    volFactor: IDL.Nat,
    unitSize: IDL.Nat
  });
  const PoolBalance__1 = IDL.Record({
    ts: Timestamp,
    balance0: Amount,
    balance1: Amount
  });
  const Price = IDL.Nat;
  const UnitNetValue__1 = IDL.Record({
    ts: Timestamp,
    shares: IDL.Nat,
    token0: IDL.Nat,
    token1: IDL.Nat,
    price: Price
  });
  const Config = IDL.Record({
    lowerLimit: IDL.Opt(IDL.Nat),
    threshold: IDL.Opt(Amount),
    upperLimit: IDL.Opt(IDL.Nat),
    volFactor: IDL.Opt(IDL.Nat),
    spreadRatePpm: IDL.Opt(IDL.Nat),
    withdrawalFeePpm: IDL.Opt(IDL.Nat)
  });
  const Event = IDL.Variant({
    add: IDL.Variant({
      ok: IDL.Record({
        toids: IDL.Vec(IDL.Nat),
        shares: Shares__1,
        token0: Amount,
        token1: Amount,
        account: ICRC1Account
      }),
      err: IDL.Record({
        toids: IDL.Vec(IDL.Nat),
        account: ICRC1Account,
        depositToken0: Amount,
        depositToken1: Amount
      })
    }),
    remove: IDL.Variant({
      ok: IDL.Record({
        shares: Shares__1,
        toid: IDL.Opt(IDL.Nat),
        token0: Amount,
        token1: Amount,
        account: ICRC1Account
      }),
      err: IDL.Record({
        addPoolToken0: Amount,
        addPoolToken1: Amount,
        toid: IDL.Opt(IDL.Nat),
        account: ICRC1Account
      })
    }),
    dexWithdraw: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      token0: IDL.Nat,
      token1: IDL.Nat
    }),
    withdraw: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      token0: IDL.Nat,
      token1: IDL.Nat,
      account: ICRC1Account
    }),
    fallback: IDL.Record({
      toids: IDL.Vec(IDL.Nat),
      token0: Amount,
      token1: Amount,
      account: ICRC1Account
    }),
    init: IDL.Record({ initArgs: InitArgs }),
    lock: IDL.Record({ message: IDL.Opt(IDL.Text) }),
    updateUnitNetValue: IDL.Record({
      pairBalance: IDL.Opt(
        IDL.Record({
          token0: IDL.Record({ locked: Amount, available: Amount }),
          token1: IDL.Record({ locked: Amount, available: Amount })
        })
      ),
      poolShares: Shares__1,
      poolBalance: PoolBalance__1,
      unitNetValue: UnitNetValue__1,
      localBalance: PoolBalance__1
    }),
    dexDeposit: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      token0: IDL.Nat,
      token1: IDL.Nat
    }),
    changeOwner: IDL.Record({ newOwner: IDL.Principal }),
    unlock: IDL.Record({ message: IDL.Opt(IDL.Text) }),
    deposit: IDL.Record({
      token0: IDL.Nat,
      token1: IDL.Nat,
      account: ICRC1Account
    }),
    deleteGridOrder: IDL.Record({
      soid: IDL.Opt(IDL.Nat),
      toid: IDL.Opt(IDL.Nat)
    }),
    updateGridOrder: IDL.Record({
      soid: IDL.Opt(IDL.Nat),
      toid: IDL.Opt(IDL.Nat)
    }),
    start: IDL.Record({ message: IDL.Opt(IDL.Text) }),
    config: IDL.Record({ setting: Config }),
    createGridOrder: IDL.Record({ toid: IDL.Opt(IDL.Nat) }),
    suspend: IDL.Record({ message: IDL.Opt(IDL.Text) })
  });
  const Timestamp__1 = IDL.Nat;
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const ShareWeighted__1 = IDL.Record({
    updateTime: Timestamp,
    shareTimeWeighted: IDL.Nat
  });
  const Time = IDL.Int;
  const BackupResponse = IDL.Variant({
    blockEvents: IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Tuple(Event, Timestamp__1))),
    accountShares: IDL.Vec(
      IDL.Tuple(AccountId__1, IDL.Tuple(IDL.Nat, ShareWeighted__1))
    ),
    accountVolUsed: IDL.Vec(IDL.Tuple(AccountId__1, IDL.Nat)),
    unitNetValues: IDL.Vec(UnitNetValue__1),
    fallbacking_accounts: IDL.Vec(IDL.Tuple(AccountId__1, Time)),
    otherData: IDL.Record({
      creator: AccountId__1,
      poolShares: IDL.Nat,
      poolBalance: PoolBalance__1,
      gridSoid: IDL.Opt(IDL.Nat),
      poolLocalBalance: PoolBalance__1,
      gridSoid2: IDL.Opt(IDL.Nat),
      shareUnitSize: IDL.Nat,
      blockIndex: IDL.Nat,
      shareDecimals: IDL.Nat8,
      gridOrderDeleted2: IDL.Bool,
      firstBlockIndex: IDL.Nat,
      poolShareWeighted: ShareWeighted__1,
      visibility: IDL.Variant({ Private: IDL.Null, Public: IDL.Null }),
      gridOrderDeleted: IDL.Bool,
      ictc_admins: IDL.Vec(IDL.Principal)
    }),
    accountEvents: IDL.Vec(IDL.Tuple(AccountId__1, IDL.Vec(IDL.Nat)))
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
  const Address__1 = IDL.Text;
  const Subaccount__1 = IDL.Vec(IDL.Nat8);
  const Account__1 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount__1)
  });
  const UnitNetValue = IDL.Record({
    ts: Timestamp,
    shares: IDL.Nat,
    token0: IDL.Nat,
    token1: IDL.Nat,
    price: Price
  });
  const AccountId__4 = IDL.Vec(IDL.Nat8);
  const Timestamp__4 = IDL.Nat;
  const BlockHeight = IDL.Nat;
  const TrieList = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(BlockHeight, IDL.Tuple(Event, Timestamp__4))),
    totalPage: IDL.Nat
  });
  const Toid = IDL.Nat;
  const Ttid = IDL.Nat;
  const Amount__3 = IDL.Nat;
  const Sa__2 = IDL.Vec(IDL.Nat8);
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount)
  });
  const Timestamp__2 = IDL.Nat64;
  const TransferArgs = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(Subaccount),
    created_at_time: IDL.Opt(Timestamp__2),
    amount: IDL.Nat
  });
  const Soid = IDL.Nat;
  const STStatus = IDL.Variant({
    Stopped: IDL.Null,
    Running: IDL.Null,
    Deleted: IDL.Null
  });
  const Price__2 = IDL.Nat;
  const Ppm = IDL.Nat;
  const Sa__3 = IDL.Vec(IDL.Nat8);
  const To = IDL.Text;
  const Amount__2 = IDL.Nat;
  const Nonce = IDL.Nat;
  const Sa__1 = IDL.Vec(IDL.Nat8);
  const Data = IDL.Vec(IDL.Nat8);
  const From = IDL.Text;
  const Spender = IDL.Text;
  const Address = IDL.Text;
  const BlobFill = IDL.Variant({
    AutoFill: IDL.Null,
    ManualFill: IDL.Vec(IDL.Nat8)
  });
  const Timeout = IDL.Nat32;
  const Decider = IDL.Text;
  const ExecuteType = IDL.Variant({
    fallback: IDL.Null,
    send: IDL.Nat,
    sendAll: IDL.Null
  });
  const Timestamp__3 = IDL.Nat64;
  const TransferArgs__1 = IDL.Record({
    to: Account__1,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(Subaccount__1),
    created_at_time: IDL.Opt(Timestamp__3),
    amount: IDL.Nat
  });
  const CallType__1 = IDL.Variant({
    __block: IDL.Null,
    ICDex: IDL.Variant({
      withdraw: IDL.Tuple(
        IDL.Opt(Amount__3),
        IDL.Opt(Amount__3),
        IDL.Opt(Sa__2)
      ),
      depositFallback: IDL.Opt(Sa__2),
      deposit: IDL.Tuple(
        IDL.Variant({ token0: IDL.Null, token1: IDL.Null }),
        IDL.Nat,
        IDL.Opt(Sa__2)
      )
    }),
    ICRC1: IDL.Variant({
      icrc1_balance_of: Account,
      icrc1_transfer: TransferArgs
    }),
    This: IDL.Variant({
      updatePoolLocalBalance: IDL.Tuple(
        IDL.Opt(IDL.Variant({ add: IDL.Nat, set: IDL.Nat, sub: IDL.Nat })),
        IDL.Opt(IDL.Variant({ add: IDL.Nat, set: IDL.Nat, sub: IDL.Nat }))
      ),
      batchTransfer: IDL.Vec(
        IDL.Tuple(
          IDL.Variant({ add: IDL.Null, sub: IDL.Null }),
          IDL.Vec(IDL.Nat8),
          IDL.Variant({ token0: IDL.Null, token1: IDL.Null }),
          IDL.Variant({ locked: IDL.Nat, available: IDL.Nat })
        )
      ),
      dexDepositFallback: IDL.Tuple(IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8)))
    }),
    StratOrder: IDL.Variant({
      sto_updateProOrder: IDL.Tuple(
        Soid,
        IDL.Variant({
          GridOrder: IDL.Record({
            status: IDL.Opt(STStatus),
            lowerLimit: IDL.Opt(Price__2),
            upperLimit: IDL.Opt(Price__2),
            spread: IDL.Opt(IDL.Variant({ Geom: Ppm, Arith: Price__2 })),
            amount: IDL.Opt(
              IDL.Variant({
                Percent: IDL.Opt(Ppm),
                Token0: IDL.Nat,
                Token1: IDL.Nat
              })
            )
          })
        }),
        IDL.Opt(Sa__3)
      ),
      sto_createProOrder: IDL.Tuple(
        IDL.Variant({
          GridOrder: IDL.Record({
            lowerLimit: Price__2,
            upperLimit: Price__2,
            spread: IDL.Variant({ Geom: Ppm, Arith: Price__2 }),
            amount: IDL.Variant({
              Percent: IDL.Opt(Ppm),
              Token0: IDL.Nat,
              Token1: IDL.Nat
            })
          })
        }),
        IDL.Opt(Sa__3)
      ),
      sto_cancelPendingOrders: IDL.Tuple(Soid, IDL.Opt(Sa__3))
    }),
    DRC20: IDL.Variant({
      transferBatch: IDL.Tuple(
        IDL.Vec(To),
        IDL.Vec(Amount__2),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      transferFrom: IDL.Tuple(
        From,
        To,
        Amount__2,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      approve: IDL.Tuple(
        Spender,
        Amount__2,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      balanceOf: Address,
      txnRecord: BlobFill,
      lockTransfer: IDL.Tuple(
        To,
        Amount__2,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      transfer: IDL.Tuple(
        To,
        Amount__2,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      dropAccount: IDL.Opt(Sa__1),
      executeTransfer: IDL.Tuple(
        BlobFill,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount__2,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      )
    }),
    ICRC1New: IDL.Variant({
      icrc1_balance_of: Account__1,
      icrc1_transfer: TransferArgs__1
    }),
    __skip: IDL.Null
  });
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
  const Ttid__1 = IDL.Nat;
  const Time__2 = IDL.Int;
  const Toid__1 = IDL.Nat;
  const CallType = IDL.Variant({
    __block: IDL.Null,
    ICDex: IDL.Variant({
      withdraw: IDL.Tuple(
        IDL.Opt(Amount__3),
        IDL.Opt(Amount__3),
        IDL.Opt(Sa__2)
      ),
      depositFallback: IDL.Opt(Sa__2),
      deposit: IDL.Tuple(
        IDL.Variant({ token0: IDL.Null, token1: IDL.Null }),
        IDL.Nat,
        IDL.Opt(Sa__2)
      )
    }),
    ICRC1: IDL.Variant({
      icrc1_balance_of: Account,
      icrc1_transfer: TransferArgs
    }),
    This: IDL.Variant({
      updatePoolLocalBalance: IDL.Tuple(
        IDL.Opt(IDL.Variant({ add: IDL.Nat, set: IDL.Nat, sub: IDL.Nat })),
        IDL.Opt(IDL.Variant({ add: IDL.Nat, set: IDL.Nat, sub: IDL.Nat }))
      ),
      batchTransfer: IDL.Vec(
        IDL.Tuple(
          IDL.Variant({ add: IDL.Null, sub: IDL.Null }),
          IDL.Vec(IDL.Nat8),
          IDL.Variant({ token0: IDL.Null, token1: IDL.Null }),
          IDL.Variant({ locked: IDL.Nat, available: IDL.Nat })
        )
      ),
      dexDepositFallback: IDL.Tuple(IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8)))
    }),
    StratOrder: IDL.Variant({
      sto_updateProOrder: IDL.Tuple(
        Soid,
        IDL.Variant({
          GridOrder: IDL.Record({
            status: IDL.Opt(STStatus),
            lowerLimit: IDL.Opt(Price__2),
            upperLimit: IDL.Opt(Price__2),
            spread: IDL.Opt(IDL.Variant({ Geom: Ppm, Arith: Price__2 })),
            amount: IDL.Opt(
              IDL.Variant({
                Percent: IDL.Opt(Ppm),
                Token0: IDL.Nat,
                Token1: IDL.Nat
              })
            )
          })
        }),
        IDL.Opt(Sa__3)
      ),
      sto_createProOrder: IDL.Tuple(
        IDL.Variant({
          GridOrder: IDL.Record({
            lowerLimit: Price__2,
            upperLimit: Price__2,
            spread: IDL.Variant({ Geom: Ppm, Arith: Price__2 }),
            amount: IDL.Variant({
              Percent: IDL.Opt(Ppm),
              Token0: IDL.Nat,
              Token1: IDL.Nat
            })
          })
        }),
        IDL.Opt(Sa__3)
      ),
      sto_cancelPendingOrders: IDL.Tuple(Soid, IDL.Opt(Sa__3))
    }),
    DRC20: IDL.Variant({
      transferBatch: IDL.Tuple(
        IDL.Vec(To),
        IDL.Vec(Amount__2),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      transferFrom: IDL.Tuple(
        From,
        To,
        Amount__2,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      approve: IDL.Tuple(
        Spender,
        Amount__2,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      balanceOf: Address,
      txnRecord: BlobFill,
      lockTransfer: IDL.Tuple(
        To,
        Amount__2,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      transfer: IDL.Tuple(
        To,
        Amount__2,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      dropAccount: IDL.Opt(Sa__1),
      executeTransfer: IDL.Tuple(
        BlobFill,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount__2,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      )
    }),
    ICRC1New: IDL.Variant({
      icrc1_balance_of: Account__1,
      icrc1_transfer: TransferArgs__1
    }),
    __skip: IDL.Null
  });
  const Attempts = IDL.Nat;
  const Callee = IDL.Principal;
  const Task__1 = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time__2,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee,
    forTtid: IDL.Opt(Ttid__1)
  });
  const Status__2 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Compensation = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time__2,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee,
    forTtid: IDL.Opt(Ttid__1)
  });
  const SagaTask = IDL.Record({
    status: Status__2,
    comp: IDL.Opt(Compensation),
    task: Task__1,
    ttid: Ttid
  });
  List_1.fill(IDL.Opt(IDL.Tuple(SagaTask, List_1)));
  const Tcid = IDL.Nat;
  const CompTask = IDL.Record({
    status: Status__2,
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
    callbackStatus: IDL.Opt(Status__2),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    name: IDL.Text,
    comps: List,
    time: Time__2,
    compStrategy: CompStrategy,
    allowPushing: IDL.Variant({ Opening: IDL.Null, Closed: IDL.Null })
  });
  const Status__1 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Duration = IDL.Nat64;
  const TransferError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat
    }),
    TemporarilyUnavailable: IDL.Null,
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Null,
    TooOld: IDL.Record({ allowed_window_nanos: Duration }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat })
  });
  const Txid = IDL.Vec(IDL.Nat8);
  const TxnResult = IDL.Variant({
    ok: Txid,
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
  const Gas = IDL.Variant({
    token: IDL.Nat,
    cycles: IDL.Nat,
    noFee: IDL.Null
  });
  const AccountId__3 = IDL.Vec(IDL.Nat8);
  const Time__1 = IDL.Int;
  const Operation = IDL.Variant({
    approve: IDL.Record({ allowance: IDL.Nat }),
    lockTransfer: IDL.Record({
      locked: IDL.Nat,
      expiration: Time__1,
      decider: AccountId__3
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
    to: AccountId__3,
    value: IDL.Nat,
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: AccountId__3,
    operation: Operation
  });
  const TxnRecord = IDL.Record({
    gas: Gas,
    msgCaller: IDL.Opt(IDL.Principal),
    transaction: Transaction,
    txid: Txid,
    nonce: IDL.Nat,
    timestamp: Time__1,
    caller: AccountId__3,
    index: IDL.Nat
  });
  const TransferError__1 = IDL.Variant({
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
  const Receipt = IDL.Variant({
    __block: IDL.Null,
    ICDex: IDL.Variant({
      withdraw: IDL.Tuple(IDL.Nat, IDL.Nat),
      depositFallback: IDL.Tuple(IDL.Nat, IDL.Nat),
      deposit: IDL.Null
    }),
    ICRC1: IDL.Variant({
      icrc1_balance_of: IDL.Nat,
      icrc1_transfer: IDL.Variant({ Ok: IDL.Nat, Err: TransferError })
    }),
    This: IDL.Variant({
      updatePoolLocalBalance: IDL.Record({
        ts: IDL.Nat,
        balance0: IDL.Nat,
        balance1: IDL.Nat
      }),
      batchTransfer: IDL.Vec(
        IDL.Record({
          token0: IDL.Record({ locked: IDL.Nat, available: IDL.Nat }),
          token1: IDL.Record({ locked: IDL.Nat, available: IDL.Nat })
        })
      ),
      dexDepositFallback: IDL.Tuple(IDL.Nat, IDL.Nat)
    }),
    StratOrder: IDL.Variant({
      sto_updateProOrder: Soid,
      sto_createProOrder: Soid,
      sto_cancelPendingOrders: IDL.Null
    }),
    DRC20: IDL.Variant({
      transferBatch: IDL.Vec(TxnResult),
      transferFrom: TxnResult,
      approve: TxnResult,
      balanceOf: Amount__2,
      txnRecord: IDL.Opt(TxnRecord),
      lockTransfer: TxnResult,
      transfer: TxnResult,
      dropAccount: IDL.Null,
      executeTransfer: TxnResult,
      lockTransferFrom: TxnResult
    }),
    ICRC1New: IDL.Variant({
      icrc1_balance_of: IDL.Nat,
      icrc1_transfer: IDL.Variant({
        Ok: IDL.Nat,
        Err: TransferError__1
      })
    }),
    __skip: IDL.Null
  });
  const ErrorCode = IDL.Variant({
    canister_error: IDL.Null,
    call_error: IDL.Record({ err_code: IDL.Nat32 }),
    system_transient: IDL.Null,
    future: IDL.Nat32,
    canister_reject: IDL.Null,
    destination_invalid: IDL.Null,
    system_fatal: IDL.Null
  });
  const Err = IDL.Record({ code: ErrorCode, message: IDL.Text });
  const TaskResult = IDL.Tuple(Status__1, IDL.Opt(Receipt), IDL.Opt(Err));
  const Status = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Task = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time__2,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee,
    forTtid: IDL.Opt(Ttid__1)
  });
  const TaskEvent = IDL.Record({
    result: TaskResult,
    callbackStatus: IDL.Opt(Status),
    task: Task,
    time: Time__2,
    toid: IDL.Opt(Toid__1),
    ttid: Ttid__1,
    attempts: Attempts,
    txHash: IDL.Vec(IDL.Nat8)
  });
  const ErrorLog = IDL.Record({
    result: IDL.Opt(TaskResult),
    time: Time__2,
    ttid: Ttid__1,
    callee: IDL.Opt(Callee)
  });
  const Price__1 = IDL.Nat;
  const PoolBalance = IDL.Record({
    ts: Timestamp,
    balance0: Amount,
    balance1: Amount
  });
  return IDL.Service({
    accountSharesAll: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList__1],
      ['query']
    ),
    add: IDL.Func([Amount__1, Amount__1, IDL.Opt(Sa)], [Shares], []),
    approveToPair: IDL.Func(
      [IDL.Principal, TokenStd, Amount__1],
      [IDL.Bool],
      []
    ),
    backup: IDL.Func([BackupRequest], [BackupResponse], []),
    cancelAllOrders: IDL.Func([], [], []),
    config: IDL.Func([Config], [IDL.Bool], []),
    createGridOrder: IDL.Func(
      [IDL.Variant({ First: IDL.Null, Second: IDL.Null })],
      [],
      []
    ),
    debug_sync: IDL.Func([], [IDL.Bool], []),
    deleteGridOrder: IDL.Func(
      [IDL.Variant({ First: IDL.Null, Second: IDL.Null })],
      [],
      []
    ),
    dexDeposit: IDL.Func([Amount__1, Amount__1], [IDL.Nat], []),
    dexWithdraw: IDL.Func([Amount__1, Amount__1], [Amount__1, Amount__1], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    fallback: IDL.Func([IDL.Opt(Sa)], [Amount__1, Amount__1], []),
    getAccountShares: IDL.Func(
      [Address__1],
      [Shares, ShareWeighted],
      ['query']
    ),
    getAccountVolUsed: IDL.Func([Address__1], [IDL.Nat], ['query']),
    getDepositAccount: IDL.Func(
      [Address__1],
      [Account__1, Address__1],
      ['query']
    ),
    getUnitNetValues: IDL.Func(
      [],
      [
        IDL.Record({
          data: IDL.Vec(UnitNetValue),
          shareUnitSize: IDL.Nat
        })
      ],
      ['query']
    ),
    get_account_events: IDL.Func(
      [AccountId__4],
      [IDL.Vec(IDL.Tuple(Event, Timestamp__4))],
      ['query']
    ),
    get_event: IDL.Func(
      [BlockHeight],
      [IDL.Opt(IDL.Tuple(Event, Timestamp__4))],
      ['query']
    ),
    get_event_count: IDL.Func([], [IDL.Nat], ['query']),
    get_event_first_index: IDL.Func([], [BlockHeight], ['query']),
    get_events: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList],
      ['query']
    ),
    ictc_TM: IDL.Func([], [IDL.Text], ['query']),
    ictc_addAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_appendTT: IDL.Func(
      [
        IDL.Opt(IDL.Vec(IDL.Nat8)),
        Toid,
        IDL.Opt(Ttid),
        IDL.Principal,
        CallType__1,
        IDL.Vec(Ttid)
      ],
      [Ttid],
      []
    ),
    ictc_blockTO: IDL.Func([Toid], [IDL.Opt(Toid)], []),
    ictc_clearLog: IDL.Func([IDL.Opt(IDL.Int), IDL.Bool], [], []),
    ictc_clearTTPool: IDL.Func([], [], []),
    ictc_completeTO: IDL.Func([Toid, OrderStatus], [IDL.Bool], []),
    ictc_doneTO: IDL.Func([Toid, OrderStatus, IDL.Bool], [IDL.Bool], []),
    ictc_doneTT: IDL.Func([Toid, Ttid, IDL.Bool], [IDL.Opt(Ttid)], []),
    ictc_getAdmins: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    ictc_getCalleeStatus: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(CalleeStatus)],
      ['query']
    ),
    ictc_getPool: IDL.Func(
      [],
      [
        IDL.Record({
          ttPool: IDL.Record({
            total: IDL.Nat,
            items: IDL.Vec(IDL.Tuple(Ttid, Task__1))
          }),
          toPool: IDL.Record({
            total: IDL.Nat,
            items: IDL.Vec(IDL.Tuple(Toid, IDL.Opt(Order)))
          })
        })
      ],
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
    ictc_redoTT: IDL.Func([Toid, Ttid], [IDL.Opt(Ttid)], []),
    ictc_removeAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_runTO: IDL.Func([Toid], [IDL.Opt(OrderStatus)], []),
    ictc_runTT: IDL.Func([], [IDL.Bool], []),
    info: IDL.Func(
      [],
      [
        IDL.Record({
          creator: AccountId__2,
          sysTransactionLock: IDL.Bool,
          initialized: IDL.Bool,
          withdrawalFee: IDL.Float64,
          name: IDL.Text,
          gridSetting: IDL.Record({
            gridLowerLimit: Price__1,
            gridUpperLimit: Price__1,
            gridSpread: Price__1
          }),
          gridSoid: IDL.Vec(IDL.Opt(IDL.Nat)),
          version: IDL.Text,
          sysGlobalLock: IDL.Opt(IDL.Bool),
          pairInfo: IDL.Record({
            pairUnitSize: IDL.Nat,
            token0: IDL.Tuple(IDL.Principal, IDL.Text, TokenStd),
            token1: IDL.Tuple(IDL.Principal, IDL.Text, TokenStd),
            pairPrincipal: IDL.Principal
          }),
          shareDecimals: IDL.Nat8,
          volFactor: IDL.Nat,
          visibility: IDL.Variant({
            Private: IDL.Null,
            Public: IDL.Null
          }),
          poolThreshold: Amount__1,
          paused: IDL.Bool
        })
      ],
      ['query']
    ),
    recovery: IDL.Func([BackupResponse], [IDL.Bool], []),
    remove: IDL.Func([Amount__1, IDL.Opt(Sa)], [Amount__1, Amount__1], []),
    resetLocalBalance: IDL.Func([], [PoolBalance], []),
    setPause: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setUpgradeMode: IDL.Func(
      [IDL.Variant({ All: IDL.Null, Base: IDL.Null })],
      [],
      []
    ),
    stats: IDL.Func(
      [],
      [
        IDL.Record({
          latestUnitNetValue: UnitNetValue,
          poolShares: Shares,
          poolBalance: PoolBalance,
          poolLocalBalance: PoolBalance,
          holders: IDL.Nat,
          poolShareWeighted: ShareWeighted
        })
      ],
      ['query']
    ),
    stats2: IDL.Func(
      [],
      [
        IDL.Record({
          latestUnitNetValue: UnitNetValue,
          apy7d: IDL.Record({
            apy: IDL.Opt(IDL.Float64),
            token0: IDL.Float64,
            token1: IDL.Float64
          }),
          poolShares: Shares,
          poolBalance: PoolBalance,
          poolLocalBalance: PoolBalance,
          apy24h: IDL.Record({
            apy: IDL.Opt(IDL.Float64),
            token0: IDL.Float64,
            token1: IDL.Float64
          }),
          holders: IDL.Nat,
          poolShareWeighted: ShareWeighted
        })
      ],
      ['composite_query']
    ),
    timerStart: IDL.Func([IDL.Nat], [], []),
    timerStop: IDL.Func([], [], []),
    transactionLock: IDL.Func(
      [
        IDL.Opt(IDL.Variant({ lock: IDL.Null, unlock: IDL.Null })),
        IDL.Opt(IDL.Variant({ lock: IDL.Null, unlock: IDL.Null }))
      ],
      [IDL.Bool],
      []
    ),
    wallet_receive: IDL.Func([], [], []),
    withdraw_cycles: IDL.Func([IDL.Nat], [], [])
  });
};
