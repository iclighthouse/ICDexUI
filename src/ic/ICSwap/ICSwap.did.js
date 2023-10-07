export default ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Amount__1 = IDL.Nat;
  const Nonce = IDL.Nat;
  const Sa = IDL.Vec(IDL.Nat8);
  const Data = IDL.Vec(IDL.Nat8);
  const TxnStatus = IDL.Variant({
    Success: IDL.Null,
    Failure: IDL.Null,
    Blocking: IDL.Null,
    Pending: IDL.Null
  });
  const Txid = IDL.Vec(IDL.Nat8);
  const TxnResult = IDL.Variant({
    ok: IDL.Record({ status: TxnStatus, txid: Txid }),
    err: IDL.Record({
      code: IDL.Variant({
        InsufficientShares: IDL.Null,
        NonceError: IDL.Null,
        InvalidAmount: IDL.Null,
        UndefinedError: IDL.Null,
        UnacceptableVolatility: IDL.Null,
        TransactionBlocking: IDL.Null,
        InsufficientBalance: IDL.Null,
        DepositInProgress: IDL.Null,
        TransferException: IDL.Null,
        InsufficientPoolFund: IDL.Null
      }),
      message: IDL.Text
    })
  });
  const Address = IDL.Text;
  const Amount = IDL.Nat;
  const AccountBalance__1 = IDL.Record({
    available0: Amount,
    available1: Amount,
    locked0: Amount,
    locked1: Amount
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
  const Time = IDL.Int;
  const Vol = IDL.Record({ value0: Amount, value1: Amount });
  const CompCapital = IDL.Record({
    total: IDL.Float64,
    value0: IDL.Nat,
    value1: IDL.Nat
  });
  const CompResult = IDL.Record({
    vol: Vol,
    status: IDL.Variant({ Active: IDL.Null, Dropout: IDL.Null }),
    capital: CompCapital,
    assetValue: IDL.Opt(CompCapital)
  });
  const AccountId__4 = IDL.Vec(IDL.Nat8);
  const RoundItem = IDL.Record({
    end: Time,
    content: IDL.Text,
    isSettled: IDL.Bool,
    name: IDL.Text,
    start: Time,
    closedPrice: IDL.Opt(IDL.Float64),
    quoteToken: IDL.Variant({ token0: IDL.Null, token1: IDL.Null })
  });
  const ConfigRequest = IDL.Record({
    FEE: IDL.Opt(IDL.Nat),
    RETENTION_RATE: IDL.Opt(IDL.Nat),
    TOKEN0_LIMIT: IDL.Opt(IDL.Nat),
    MAX_VOLATILITY: IDL.Opt(IDL.Nat),
    TOKEN1_LIMIT: IDL.Opt(IDL.Nat),
    ICP_FEE: IDL.Opt(IDL.Nat)
  });
  const Config__1 = IDL.Record({
    MAX_STORAGE_TRIES: IDL.Opt(IDL.Nat),
    EN_DEBUG: IDL.Opt(IDL.Bool),
    MAX_CACHE_NUMBER_PER: IDL.Opt(IDL.Nat),
    MAX_CACHE_TIME: IDL.Opt(IDL.Nat)
  });
  const TokenType = IDL.Variant({
    Icp: IDL.Null,
    Token: IDL.Principal,
    Cycles: IDL.Null
  });
  const TokenStd__1 = IDL.Variant({
    dft: IDL.Null,
    icp: IDL.Null,
    other: IDL.Text,
    cycles: IDL.Null,
    icrc1: IDL.Null,
    dip20: IDL.Null,
    drc20: IDL.Null
  });
  const DexInfo = IDL.Record({
    feeRate: IDL.Float64,
    mmType: IDL.Variant({ AMM: IDL.Null, OrderBook: IDL.Null }),
    token0: IDL.Tuple(TokenType, TokenStd__1),
    token1: IDL.Tuple(TokenType, TokenStd__1),
    pairName: IDL.Text,
    dexName: IDL.Text,
    canisterId: IDL.Principal
  });
  const Address__2 = IDL.Text;
  const Shares = IDL.Nat;
  const ShareChange = IDL.Variant({
    Burn: Shares,
    Mint: Shares,
    NoChange: IDL.Null
  });
  const Data__1 = IDL.Vec(IDL.Nat8);
  const Txid__2 = IDL.Vec(IDL.Nat8);
  const BalanceChange = IDL.Variant({
    DebitRecord: IDL.Nat,
    CreditRecord: IDL.Nat,
    NoChange: IDL.Null
  });
  const TokenType__1 = IDL.Variant({
    Icp: IDL.Null,
    Token: IDL.Principal,
    Cycles: IDL.Null
  });
  const Nonce__1 = IDL.Nat;
  const OperationType = IDL.Variant({
    AddLiquidity: IDL.Null,
    Swap: IDL.Null,
    Claim: IDL.Null,
    RemoveLiquidity: IDL.Null
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const CyclesWallet = IDL.Principal;
  const TxnRecord__2 = IDL.Record({
    fee: IDL.Record({ token0Fee: IDL.Nat, token1Fee: IDL.Nat }),
    shares: ShareChange,
    msgCaller: IDL.Opt(IDL.Principal),
    data: IDL.Opt(Data__1),
    time: Time,
    txid: Txid__2,
    token0Value: BalanceChange,
    orderType: IDL.Variant({ AMM: IDL.Null, OrderBook: IDL.Null }),
    token0: TokenType__1,
    token1: TokenType__1,
    nonce: Nonce__1,
    operation: OperationType,
    account: AccountId,
    details: IDL.Vec(
      IDL.Record({
        token0Value: BalanceChange,
        counterparty: Txid__2,
        token1Value: BalanceChange
      })
    ),
    caller: AccountId,
    token1Value: BalanceChange,
    index: IDL.Nat,
    cyclesWallet: IDL.Opt(CyclesWallet)
  });
  const Setting = IDL.Record({
    MAX_STORAGE_TRIES: IDL.Nat,
    EN_DEBUG: IDL.Bool,
    MAX_CACHE_NUMBER_PER: IDL.Nat,
    MAX_CACHE_TIME: IDL.Nat
  });
  const Txid__5 = IDL.Vec(IDL.Nat8);
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
  const FeeBalance = IDL.Record({ value0: Amount, value1: Amount });
  const FeeStatus = IDL.Record({
    feeRate: IDL.Float64,
    totalFee: FeeBalance
  });
  const Config = IDL.Record({
    FEE: IDL.Nat,
    RETENTION_RATE: IDL.Nat,
    TOKEN0_LIMIT: IDL.Nat,
    MAX_VOLATILITY: IDL.Nat,
    TOKEN1_LIMIT: IDL.Nat,
    ICP_FEE: IDL.Nat
  });
  const Subaccount__1 = IDL.Vec(IDL.Nat8);
  const Account__1 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount__1)
  });
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const KInterval = IDL.Nat;
  const Timestamp__3 = IDL.Nat;
  const KBar = IDL.Record({
    kid: IDL.Nat,
    low: IDL.Nat,
    vol: IDL.Nat,
    high: IDL.Nat,
    close: IDL.Nat,
    open: IDL.Nat,
    updatedTs: Timestamp__3
  });
  const Toid__1 = IDL.Nat;
  const Ttid = IDL.Nat;
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount)
  });
  const Timestamp__1 = IDL.Nat64;
  const TransferArgs = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(Subaccount),
    created_at_time: IDL.Opt(Timestamp__1),
    amount: IDL.Nat
  });
  const Txid__4 = IDL.Vec(IDL.Nat8);
  const Nonce__3 = IDL.Nat;
  const Data__3 = IDL.Vec(IDL.Nat8);
  const Shares__2 = IDL.Nat;
  const Amount__3 = IDL.Nat;
  const TokenValue = IDL.Variant({
    token0: Amount__3,
    token1: Amount__3
  });
  const AccountId__3 = IDL.Vec(IDL.Nat8);
  const From = IDL.Text;
  const To = IDL.Text;
  const Amount__2 = IDL.Nat;
  const Nonce__2 = IDL.Nat;
  const Sa__1 = IDL.Vec(IDL.Nat8);
  const Data__2 = IDL.Vec(IDL.Nat8);
  const Spender = IDL.Text;
  const Address__1 = IDL.Text;
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
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const AccountBalanceArgs = IDL.Record({ account: AccountIdentifier });
  const ICP = IDL.Record({ e8s: IDL.Nat64 });
  const Memo = IDL.Nat64;
  const SubAccount = IDL.Vec(IDL.Nat8);
  const Timestamp__2 = IDL.Record({ timestamp_nanos: IDL.Nat64 });
  const TransferArgs__1 = IDL.Record({
    to: AccountIdentifier,
    fee: ICP,
    memo: Memo,
    from_subaccount: IDL.Opt(SubAccount),
    created_at_time: IDL.Opt(Timestamp__2),
    amount: ICP
  });
  const CallType__1 = IDL.Variant({
    __block: IDL.Null,
    ICRC1: IDL.Variant({
      icrc1_balance_of: Account,
      icrc1_transfer: TransferArgs
    }),
    This: IDL.Variant({
      add: IDL.Tuple(Account, Txid__4, Nonce__3, IDL.Opt(Data__3)),
      remove: IDL.Tuple(
        Account,
        Txid__4,
        IDL.Opt(Shares__2),
        Nonce__3,
        IDL.Opt(Data__3)
      ),
      withdraw: IDL.Tuple(IDL.Nat, Account),
      swap: IDL.Tuple(
        Account,
        Txid__4,
        IDL.Opt(TokenValue),
        IDL.Opt(TokenValue),
        IDL.Opt(IDL.Nat),
        Nonce__3,
        IDL.Opt(Data__3)
      ),
      deposit: IDL.Tuple(AccountId__3, Amount__3, Amount__3)
    }),
    DIP20: IDL.Variant({
      transferFrom: IDL.Tuple(IDL.Principal, IDL.Principal, IDL.Nat),
      approve: IDL.Tuple(IDL.Principal, IDL.Nat),
      balanceOf: IDL.Principal,
      transfer: IDL.Tuple(IDL.Principal, IDL.Nat)
    }),
    DRC20: IDL.Variant({
      transferFrom: IDL.Tuple(
        From,
        To,
        Amount__2,
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      approve: IDL.Tuple(
        Spender,
        Amount__2,
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      balanceOf: Address__1,
      txnRecord: BlobFill,
      lockTransfer: IDL.Tuple(
        To,
        Amount__2,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      transfer: IDL.Tuple(
        To,
        Amount__2,
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      dropAccount: IDL.Opt(Sa__1),
      executeTransfer: IDL.Tuple(
        BlobFill,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount__2,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      )
    }),
    Ledger: IDL.Variant({
      account_balance: AccountBalanceArgs,
      transfer: TransferArgs__1
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
  const Status__2 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Ttid__1 = IDL.Nat;
  const Toid = IDL.Nat;
  const CallType = IDL.Variant({
    __block: IDL.Null,
    ICRC1: IDL.Variant({
      icrc1_balance_of: Account,
      icrc1_transfer: TransferArgs
    }),
    This: IDL.Variant({
      add: IDL.Tuple(Account, Txid__4, Nonce__3, IDL.Opt(Data__3)),
      remove: IDL.Tuple(
        Account,
        Txid__4,
        IDL.Opt(Shares__2),
        Nonce__3,
        IDL.Opt(Data__3)
      ),
      withdraw: IDL.Tuple(IDL.Nat, Account),
      swap: IDL.Tuple(
        Account,
        Txid__4,
        IDL.Opt(TokenValue),
        IDL.Opt(TokenValue),
        IDL.Opt(IDL.Nat),
        Nonce__3,
        IDL.Opt(Data__3)
      ),
      deposit: IDL.Tuple(AccountId__3, Amount__3, Amount__3)
    }),
    DIP20: IDL.Variant({
      transferFrom: IDL.Tuple(IDL.Principal, IDL.Principal, IDL.Nat),
      approve: IDL.Tuple(IDL.Principal, IDL.Nat),
      balanceOf: IDL.Principal,
      transfer: IDL.Tuple(IDL.Principal, IDL.Nat)
    }),
    DRC20: IDL.Variant({
      transferFrom: IDL.Tuple(
        From,
        To,
        Amount__2,
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      approve: IDL.Tuple(
        Spender,
        Amount__2,
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      balanceOf: Address__1,
      txnRecord: BlobFill,
      lockTransfer: IDL.Tuple(
        To,
        Amount__2,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      transfer: IDL.Tuple(
        To,
        Amount__2,
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      dropAccount: IDL.Opt(Sa__1),
      executeTransfer: IDL.Tuple(
        BlobFill,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      ),
      lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount__2,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__2),
        IDL.Opt(Sa__1),
        IDL.Opt(Data__2)
      )
    }),
    Ledger: IDL.Variant({
      account_balance: AccountBalanceArgs,
      transfer: TransferArgs__1
    }),
    __skip: IDL.Null
  });
  const Attempts = IDL.Nat;
  const Callee = IDL.Principal;
  const Compensation = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee,
    forTtid: IDL.Opt(Ttid__1)
  });
  const Task__1 = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid),
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
    time: Time,
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
  const AccountBalance = IDL.Record({
    available0: Amount__3,
    available1: Amount__3,
    locked0: Amount__3,
    locked1: Amount__3
  });
  const Side = IDL.Variant({
    Token1ToToken0: IDL.Null,
    Token0ToToken1: IDL.Null
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
  const Txid__3 = IDL.Vec(IDL.Nat8);
  const TxnResult__1 = IDL.Variant({
    ok: Txid__3,
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
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const Time__1 = IDL.Int;
  const Operation = IDL.Variant({
    approve: IDL.Record({ allowance: IDL.Nat }),
    lockTransfer: IDL.Record({
      locked: IDL.Nat,
      expiration: Time__1,
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
      lockedTxid: Txid__3
    })
  });
  const Transaction = IDL.Record({
    to: AccountId__2,
    value: IDL.Nat,
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: AccountId__2,
    operation: Operation
  });
  const TxnRecord__1 = IDL.Record({
    gas: Gas,
    msgCaller: IDL.Opt(IDL.Principal),
    transaction: Transaction,
    txid: Txid__3,
    nonce: IDL.Nat,
    timestamp: Time__1,
    caller: AccountId__2,
    index: IDL.Nat
  });
  const BlockIndex = IDL.Nat64;
  const TransferError__1 = IDL.Variant({
    TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
    BadFee: IDL.Record({ expected_fee: ICP }),
    TxDuplicate: IDL.Record({ duplicate_of: BlockIndex }),
    TxCreatedInFuture: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: ICP })
  });
  const TransferResult = IDL.Variant({
    Ok: BlockIndex,
    Err: TransferError__1
  });
  const Receipt = IDL.Variant({
    __block: IDL.Null,
    ICRC1: IDL.Variant({
      icrc1_balance_of: IDL.Nat,
      icrc1_transfer: IDL.Variant({ Ok: IDL.Nat, Err: TransferError })
    }),
    This: IDL.Variant({
      add: IDL.Tuple(Amount__3, Amount__3, Shares__2, AccountBalance),
      remove: IDL.Tuple(Amount__3, Amount__3, Shares__2, AccountBalance),
      withdraw: IDL.Tuple(Amount__3, Amount__3, AccountBalance),
      swap: IDL.Tuple(Amount__3, Amount__3, Side, AccountBalance),
      deposit: AccountBalance
    }),
    DIP20: IDL.Variant({
      transferFrom: TxReceipt,
      approve: TxReceipt,
      balanceOf: IDL.Nat,
      transfer: TxReceipt
    }),
    DRC20: IDL.Variant({
      transferFrom: TxnResult__1,
      approve: TxnResult__1,
      balanceOf: Amount__2,
      txnRecord: IDL.Opt(TxnRecord__1),
      lockTransfer: TxnResult__1,
      transfer: TxnResult__1,
      dropAccount: IDL.Null,
      executeTransfer: TxnResult__1,
      lockTransferFrom: TxnResult__1
    }),
    Ledger: IDL.Variant({
      account_balance: ICP,
      transfer: TransferResult
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
    time: Time,
    toid: IDL.Opt(Toid),
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
    time: Time,
    toid: IDL.Opt(Toid),
    ttid: Ttid__1,
    attempts: Attempts,
    txHash: IDL.Vec(IDL.Nat8)
  });
  const ErrorLog = IDL.Record({
    result: IDL.Opt(TaskResult),
    time: Time,
    ttid: Ttid__1,
    callee: IDL.Opt(Callee)
  });
  const TokenSymbol = IDL.Text;
  const TokenStd = IDL.Variant({
    dft: IDL.Null,
    icp: IDL.Null,
    other: IDL.Text,
    cycles: IDL.Null,
    icrc1: IDL.Null,
    dip20: IDL.Null,
    drc20: IDL.Null
  });
  const TokenInfo = IDL.Tuple(IDL.Principal, TokenSymbol, TokenStd);
  const Vol__1 = IDL.Record({ value0: Amount, value1: Amount });
  const Shares__1 = IDL.Nat;
  const Timestamp = IDL.Nat;
  const ShareWeighted = IDL.Record({
    updateTime: Timestamp,
    shareTimeWeighted: IDL.Nat
  });
  const PriceWeighted = IDL.Record({
    updateTime: Timestamp,
    token1TimeWeighted: IDL.Nat,
    token0TimeWeighted: IDL.Nat
  });
  const Liquidity = IDL.Record({
    vol: Vol__1,
    shares: Shares__1,
    shareWeighted: ShareWeighted,
    unitValue: IDL.Tuple(Amount, Amount),
    value0: Amount,
    value1: Amount,
    priceWeighted: PriceWeighted,
    swapCount: IDL.Nat64
  });
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const SwappingOrder__1 = IDL.Record({
    status: TxnStatus,
    time: Time,
    toid: IDL.Nat,
    value0: Amount,
    value1: Amount,
    icrc1Account: IDL.Opt(
      IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
      })
    ),
    operation: OperationType,
    account: AccountId__1
  });
  const TrieList = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(Txid__1, SwappingOrder__1)),
    totalPage: IDL.Nat
  });
  const SwappingOrder = IDL.Record({
    status: TxnStatus,
    time: Time,
    toid: IDL.Nat,
    value0: Amount,
    value1: Amount,
    icrc1Account: IDL.Opt(
      IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
      })
    ),
    operation: OperationType,
    account: AccountId__1
  });
  const TxnRecord = IDL.Record({
    fee: IDL.Record({ token0Fee: IDL.Nat, token1Fee: IDL.Nat }),
    shares: ShareChange,
    msgCaller: IDL.Opt(IDL.Principal),
    data: IDL.Opt(Data__1),
    time: Time,
    txid: Txid__2,
    token0Value: BalanceChange,
    orderType: IDL.Variant({ AMM: IDL.Null, OrderBook: IDL.Null }),
    token0: TokenType__1,
    token1: TokenType__1,
    nonce: Nonce__1,
    operation: OperationType,
    account: AccountId,
    details: IDL.Vec(
      IDL.Record({
        token0Value: BalanceChange,
        counterparty: Txid__2,
        token1Value: BalanceChange
      })
    ),
    caller: AccountId,
    token1Value: BalanceChange,
    index: IDL.Nat,
    cyclesWallet: IDL.Opt(CyclesWallet)
  });
  const OrderStatusResponse = IDL.Variant({
    Failed: SwappingOrder,
    None: IDL.Null,
    Completed: TxnRecord,
    Pending: SwappingOrder
  });
  const Token = IDL.Principal;
  const OrderRequest = IDL.Variant({
    add: IDL.Record({ token: Token, value: Amount }),
    receive: IDL.Record({ token: Token, value: Amount })
  });
  return IDL.Service({
    add: IDL.Func(
      [
        IDL.Opt(Amount__1),
        IDL.Opt(Amount__1),
        IDL.Opt(IDL.Bool),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ],
      [TxnResult],
      []
    ),
    autoWithdrawal: IDL.Func([Address], [IDL.Bool], ['query']),
    balance: IDL.Func([Address], [AccountBalance__1], ['query']),
    canister_status: IDL.Func([], [canister_status], []),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    comp_dropout: IDL.Func([IDL.Opt(Sa)], [IDL.Bool], []),
    comp_newRound: IDL.Func(
      [
        IDL.Text,
        IDL.Text,
        Time,
        Time,
        IDL.Variant({ token0: IDL.Null, token1: IDL.Null }),
        IDL.Bool
      ],
      [IDL.Nat],
      []
    ),
    comp_register: IDL.Func([IDL.Opt(Sa)], [IDL.Bool], []),
    comp_result: IDL.Func(
      [IDL.Opt(IDL.Nat), Address],
      [IDL.Opt(CompResult)],
      ['query']
    ),
    comp_results: IDL.Func(
      [IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(AccountId__4, CompResult)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    comp_round: IDL.Func(
      [IDL.Opt(IDL.Nat)],
      [IDL.Nat, IDL.Opt(RoundItem)],
      ['query']
    ),
    comp_settle: IDL.Func([IDL.Nat], [], []),
    config: IDL.Func([ConfigRequest], [IDL.Bool], []),
    decimals: IDL.Func([], [IDL.Nat8], ['query']),
    drc205_canisterId: IDL.Func([], [IDL.Principal], ['query']),
    drc205_config: IDL.Func([Config__1], [IDL.Bool], []),
    drc205_dexInfo: IDL.Func([], [DexInfo], ['query']),
    drc205_events: IDL.Func(
      [IDL.Opt(Address__2)],
      [IDL.Vec(TxnRecord__2)],
      ['query']
    ),
    drc205_getConfig: IDL.Func([], [Setting], ['query']),
    drc205_txn: IDL.Func([Txid__5], [IDL.Opt(TxnRecord__2)], ['query']),
    drc205_txn2: IDL.Func([Txid__5], [IDL.Opt(TxnRecord__2)], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    fallback: IDL.Func([IDL.Opt(Sa)], [], []),
    feeStatus: IDL.Func([], [FeeStatus], ['query']),
    getConfig: IDL.Func([], [Config], ['query']),
    getDepositAccount: IDL.Func(
      [Address],
      [Account__1, Address, Nonce, Txid__1],
      ['query']
    ),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    getQuotes: IDL.Func([KInterval], [IDL.Vec(KBar)], ['query']),
    ictc_TM: IDL.Func([], [IDL.Text], ['query']),
    ictc_addAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_appendTT: IDL.Func(
      [
        IDL.Opt(IDL.Vec(IDL.Nat8)),
        Toid__1,
        IDL.Opt(Ttid),
        IDL.Principal,
        CallType__1,
        IDL.Vec(Ttid)
      ],
      [Ttid],
      []
    ),
    ictc_completeTO: IDL.Func([Toid__1, OrderStatus], [IDL.Bool], []),
    ictc_getAdmins: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    ictc_getCalleeStatus: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(CalleeStatus)],
      ['query']
    ),
    ictc_getTO: IDL.Func([Toid__1], [IDL.Opt(Order)], ['query']),
    ictc_getTOCount: IDL.Func([], [IDL.Nat], ['query']),
    ictc_getTOPool: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(Toid__1, IDL.Opt(Order)))],
      ['query']
    ),
    ictc_getTOs: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(Toid__1, Order)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_getTT: IDL.Func([Ttid], [IDL.Opt(TaskEvent)], ['query']),
    ictc_getTTByTO: IDL.Func([Toid__1], [IDL.Vec(TaskEvent)], ['query']),
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
    info: IDL.Func(
      [],
      [
        IDL.Record({
          decimals: IDL.Nat8,
          setting: Config,
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
    init: IDL.Func([], [IDL.Bool], []),
    liquidity: IDL.Func([IDL.Opt(Address)], [Liquidity], ['query']),
    name: IDL.Func([], [IDL.Text], ['query']),
    pending: IDL.Func(
      [IDL.Opt(Address), IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [TrieList],
      ['query']
    ),
    remove: IDL.Func(
      [
        IDL.Opt(Amount__1),
        IDL.Opt(IDL.Bool),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ],
      [TxnResult],
      []
    ),
    setPause: IDL.Func([IDL.Bool], [IDL.Bool], []),
    status: IDL.Func([Address, IDL.Nat], [OrderStatusResponse], ['query']),
    statusByTxid: IDL.Func([Txid__1], [OrderStatusResponse], ['query']),
    swap: IDL.Func(
      [
        OrderRequest,
        IDL.Opt(IDL.Nat),
        IDL.Opt(IDL.Bool),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ],
      [TxnResult],
      []
    ),
    sync: IDL.Func([], [IDL.Bool], []),
    ta_ambassador: IDL.Func(
      [Address],
      [IDL.Bool, IDL.Text, IDL.Nat, Vol],
      ['query']
    ),
    ta_description: IDL.Func([], [IDL.Text], ['query']),
    ta_getReferrer: IDL.Func([Address], [IDL.Opt(Address)], ['query']),
    ta_setDescription: IDL.Func([IDL.Text], [], []),
    ta_setReferrer: IDL.Func(
      [Address, IDL.Opt(IDL.Text), IDL.Opt(Sa)],
      [IDL.Bool],
      []
    ),
    ta_stats: IDL.Func([IDL.Opt(IDL.Text)], [IDL.Nat, IDL.Nat, Vol], ['query']),
    token0: IDL.Func([], [TokenType, IDL.Opt(TokenStd)], ['query']),
    token1: IDL.Func([], [TokenType, IDL.Opt(TokenStd)], ['query']),
    userCount: IDL.Func([], [IDL.Nat], ['query']),
    version: IDL.Func([], [IDL.Text], ['query']),
    wallet_receive: IDL.Func([], [], []),
    withdraw: IDL.Func([IDL.Opt(IDL.Bool), IDL.Opt(Sa)], [], []),
    yield: IDL.Func(
      [],
      [
        IDL.Record({ apyToken0: IDL.Float64, apyToken1: IDL.Float64 }),
        IDL.Record({ apyToken0: IDL.Float64, apyToken1: IDL.Float64 })
      ],
      ['query']
    )
  });
};
export const init = ({ IDL }) => {
  return [];
};
