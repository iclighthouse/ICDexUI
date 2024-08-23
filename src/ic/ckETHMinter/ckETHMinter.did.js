export default ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Wei__1 = IDL.Nat;
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const BackupRequest = IDL.Variant({
    ck_rpcProviders: IDL.Null,
    blockEvents: IDL.Null,
    ck_rpcLogs: IDL.Null,
    feeBalances: IDL.Null,
    pendingRetrievals: IDL.Null,
    kyt_txAccounts: IDL.Null,
    cyclesMonitor: IDL.Null,
    kyt_accountAddresses: IDL.Null,
    ck_rpcRequests: IDL.Null,
    kyt_addressAccounts: IDL.Null,
    otherData: IDL.Null,
    icrc1WasmHistory: IDL.Null,
    accounts: IDL.Null,
    tokens: IDL.Null,
    withdrawals: IDL.Null,
    pendingDepositTxns: IDL.Null,
    sagaData: IDL.Variant({ All: IDL.Null, Base: IDL.Null }),
    accountEvents: IDL.Null,
    retrievals: IDL.Null,
    deposits: IDL.Null,
    transactions: IDL.Null,
    depositTxns: IDL.Null,
    ck_keepers: IDL.Null,
    balances: IDL.Null
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat;
  const Healthiness = IDL.Record({
    recentPersistentErrors: IDL.Opt(IDL.Nat),
    calls: IDL.Nat,
    time: Timestamp,
    errors: IDL.Nat
  });
  const RpcProvider = IDL.Record({
    url: IDL.Text,
    status: IDL.Variant({
      Available: IDL.Null,
      Unavailable: IDL.Null
    }),
    keeper: AccountId__1,
    calls: IDL.Nat,
    name: IDL.Text,
    errors: IDL.Nat,
    latestCall: Timestamp,
    healthCheck: Healthiness,
    preHealthCheck: Healthiness
  });
  const BlockHeight = IDL.Nat;
  const TxIndex = IDL.Nat;
  const EthAddress__1 = IDL.Text;
  const Account__2 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const Wei = IDL.Nat;
  const TxHash = IDL.Text;
  const Signature = IDL.Record({
    r: IDL.Vec(IDL.Nat8),
    s: IDL.Vec(IDL.Nat8),
    v: IDL.Nat64,
    from: IDL.Opt(IDL.Vec(IDL.Nat8)),
    hash: IDL.Vec(IDL.Nat8)
  });
  const AccessList = IDL.Record({
    storage_keys: IDL.Vec(IDL.Vec(IDL.Nat8)),
    address: IDL.Vec(IDL.Nat8)
  });
  const Transaction1559 = IDL.Record({
    to: IDL.Vec(IDL.Nat8),
    value: IDL.Vec(IDL.Nat8),
    max_priority_fee_per_gas: IDL.Vec(IDL.Nat8),
    data: IDL.Vec(IDL.Nat8),
    sign: IDL.Opt(Signature),
    max_fee_per_gas: IDL.Vec(IDL.Nat8),
    chain_id: IDL.Nat64,
    nonce: IDL.Vec(IDL.Nat8),
    gas_limit: IDL.Vec(IDL.Nat8),
    access_list: IDL.Vec(AccessList)
  });
  const Transaction2930 = IDL.Record({
    to: IDL.Vec(IDL.Nat8),
    value: IDL.Vec(IDL.Nat8),
    data: IDL.Vec(IDL.Nat8),
    sign: IDL.Opt(Signature),
    chain_id: IDL.Nat64,
    nonce: IDL.Vec(IDL.Nat8),
    gas_limit: IDL.Vec(IDL.Nat8),
    access_list: IDL.Vec(AccessList),
    gas_price: IDL.Vec(IDL.Nat8)
  });
  const TransactionLegacy = IDL.Record({
    to: IDL.Vec(IDL.Nat8),
    value: IDL.Vec(IDL.Nat8),
    data: IDL.Vec(IDL.Nat8),
    sign: IDL.Opt(Signature),
    chain_id: IDL.Nat64,
    nonce: IDL.Vec(IDL.Nat8),
    gas_limit: IDL.Vec(IDL.Nat8),
    gas_price: IDL.Vec(IDL.Nat8)
  });
  const Transaction = IDL.Variant({
    EIP1559: Transaction1559,
    EIP2930: Transaction2930,
    Legacy: TransactionLegacy
  });
  const Status = IDL.Variant({
    Signing: IDL.Null,
    Building: IDL.Null,
    Confirmed: IDL.Null,
    Sending: IDL.Null,
    Unknown: IDL.Null,
    Submitted: IDL.Null,
    Failure: IDL.Null,
    Pending: IDL.Null
  });
  const KytRequestId = IDL.Nat;
  const Nonce__2 = IDL.Nat;
  const RpcRequestId = IDL.Nat;
  const UpdateTxArgs = IDL.Record({
    ts: IDL.Opt(Timestamp),
    tx: IDL.Opt(Transaction),
    fee: IDL.Opt(IDL.Record({ gasPrice: Wei, maxFee: Wei, gasLimit: IDL.Nat })),
    status: IDL.Opt(Status),
    toids: IDL.Opt(IDL.Vec(IDL.Nat)),
    receipt: IDL.Opt(IDL.Text),
    kytRequestId: IDL.Opt(KytRequestId),
    signedTx: IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8))),
    nonce: IDL.Opt(Nonce__2),
    txHash: IDL.Opt(TxHash),
    rpcRequestId: IDL.Opt(RpcRequestId),
    amount: IDL.Opt(Wei),
    rawTx: IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)))
  });
  const TxType = IDL.Variant({
    EIP1559: IDL.Null,
    EIP2930: IDL.Null,
    Legacy: IDL.Null
  });
  const InitArgs = IDL.Record({
    rpc_confirmations: IDL.Nat,
    deposit_method: IDL.Nat8,
    min_confirmations: IDL.Opt(IDL.Nat),
    tx_type: IDL.Opt(TxType)
  });
  const TokenInfo__1 = IDL.Record({
    fee: IDL.Record({
      fixedFee: Wei,
      ethRatio: Wei,
      gasLimit: IDL.Nat
    }),
    std: IDL.Variant({ ETH: IDL.Null, ERC20: IDL.Null }),
    decimals: IDL.Nat8,
    dexPrice: IDL.Opt(IDL.Tuple(IDL.Float64, Timestamp)),
    tokenId: EthAddress__1,
    minAmount: Wei,
    totalSupply: IDL.Opt(Wei),
    ckLedgerId: IDL.Principal,
    ckSymbol: IDL.Text,
    dexPair: IDL.Opt(IDL.Principal),
    symbol: IDL.Text
  });
  const Event = IDL.Variant({
    depositGas: IDL.Record({
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress__1,
      account: Account__2,
      amount: Wei
    }),
    withdraw: IDL.Record({
      fee: IDL.Opt(Wei),
      token: EthAddress__1,
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress__1,
      account: Account__2,
      amount: Wei
    }),
    keeper: IDL.Record({
      operation: IDL.Variant({
        setRpc: IDL.Record({
          keeper: Account__2,
          operation: IDL.Variant({
            put: IDL.Tuple(
              IDL.Text,
              IDL.Variant({ Available: IDL.Null, Unavailable: IDL.Null })
            ),
            remove: IDL.Null
          })
        })
      })
    }),
    continueTransaction: IDL.Record({
      txIndex: TxIndex,
      preTxid: IDL.Vec(TxHash),
      toid: IDL.Nat,
      updateTx: IDL.Opt(UpdateTxArgs),
      account: Account__2
    }),
    depositResult: IDL.Variant({
      ok: IDL.Record({
        fee: IDL.Opt(Wei),
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      })
    }),
    burn: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      address: EthAddress__1,
      account: Account__2,
      amount: Wei,
      tokenBlockIndex: IDL.Nat
    }),
    init: IDL.Record({ initArgs: InitArgs }),
    mint: IDL.Record({
      toid: IDL.Nat,
      icTokenCanisterId: IDL.Principal,
      account: Account__2,
      amount: Wei
    }),
    send: IDL.Record({
      to: Account__2,
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      amount: Wei
    }),
    coverTransaction: IDL.Record({
      txIndex: TxIndex,
      preTxid: IDL.Vec(TxHash),
      toid: IDL.Nat,
      updateTx: IDL.Opt(UpdateTxArgs),
      account: Account__2
    }),
    claimDepositResult: IDL.Variant({
      ok: IDL.Record({
        fee: IDL.Opt(Wei),
        token: EthAddress__1,
        signature: IDL.Text,
        from: EthAddress__1,
        account: Account__2,
        txHash: TxHash,
        amount: Wei
      }),
      err: IDL.Record({
        signature: IDL.Text,
        error: IDL.Text,
        account: Account__2,
        txHash: TxHash
      })
    }),
    changeOwner: IDL.Record({ newOwner: IDL.Principal }),
    deposit: IDL.Record({
      fee: IDL.Opt(Wei),
      token: EthAddress__1,
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress__1,
      account: Account__2,
      amount: Wei
    }),
    start: IDL.Record({ message: IDL.Opt(IDL.Text) }),
    updateTokenPrice: IDL.Record({
      token: EthAddress__1,
      ethRatio: Wei,
      price: IDL.Float64
    }),
    withdrawResult: IDL.Variant({
      ok: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      })
    }),
    depositGasResult: IDL.Variant({
      ok: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        account: Account__2,
        amount: Wei
      })
    }),
    claimDeposit: IDL.Record({
      signature: IDL.Text,
      account: Account__2,
      txHash: TxHash
    }),
    config: IDL.Record({
      setting: IDL.Variant({
        upgradeTokenWasm: IDL.Record({
          icTokenCanisterId: IDL.Principal,
          version: IDL.Text,
          symbol: IDL.Text
        }),
        setToken: IDL.Record({
          token: EthAddress__1,
          info: TokenInfo__1
        }),
        depositMethod: IDL.Nat8,
        setDexPair: IDL.Record({
          token: EthAddress__1,
          dexPair: IDL.Opt(IDL.Principal)
        }),
        updateRpc: IDL.Record({
          keeper: Account__2,
          operation: IDL.Variant({
            set: IDL.Variant({
              Available: IDL.Null,
              Unavailable: IDL.Null
            }),
            remove: IDL.Null
          })
        }),
        minRpcConfirmations: IDL.Nat,
        launchToken: IDL.Record({
          token: EthAddress__1,
          icTokenCanisterId: IDL.Principal,
          symbol: IDL.Text
        }),
        setKeeper: IDL.Record({
          url: IDL.Text,
          status: IDL.Variant({
            Disabled: IDL.Null,
            Normal: IDL.Null
          }),
          name: IDL.Text,
          account: Account__2
        }),
        dependents: IDL.Record({ utilsTool: IDL.Principal }),
        setTokenWasm: IDL.Record({ size: IDL.Nat, version: IDL.Text }),
        minConfirmations: IDL.Nat
      })
    }),
    suspend: IDL.Record({ message: IDL.Opt(IDL.Text) })
  });
  const Timestamp__1 = IDL.Nat;
  const RpcId = IDL.Nat;
  const RpcLog = IDL.Record({
    err: IDL.Opt(IDL.Text),
    url: IDL.Text,
    result: IDL.Opt(IDL.Text),
    time: Timestamp,
    input: IDL.Text
  });
  const EthTokenId = IDL.Vec(IDL.Nat8);
  const Wei__2 = IDL.Nat;
  const TxIndex__1 = IDL.Nat;
  const HashId = IDL.Vec(IDL.Nat8);
  const Chain = IDL.Text;
  const TokenId = IDL.Vec(IDL.Nat8);
  const Address = IDL.Text;
  const ChainAccount = IDL.Tuple(Chain, TokenId, Address);
  const TokenCanisterId = IDL.Principal;
  const Account__1 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const ICAccount = IDL.Tuple(TokenCanisterId, Account__1);
  const Value = IDL.Variant({
    Int: IDL.Int,
    Nat: IDL.Nat,
    Raw: IDL.Vec(IDL.Nat8),
    Empty: IDL.Null,
    Bool: IDL.Bool,
    Text: IDL.Text,
    Float: IDL.Float64
  });
  const RpcRequestStatus = IDL.Variant({
    ok: IDL.Vec(Value),
    err: IDL.Text,
    pending: IDL.Null
  });
  const RpcFetchLog = IDL.Record({
    id: RpcId,
    status: RpcRequestStatus,
    result: IDL.Text,
    keeper: AccountId__1,
    time: Timestamp
  });
  const RpcRequestConsensus = IDL.Record({
    status: RpcRequestStatus,
    requests: IDL.Vec(RpcFetchLog),
    confirmed: IDL.Nat
  });
  const EthAddress__2 = IDL.Text;
  const Nonce__1 = IDL.Nat;
  const TxHashId = IDL.Vec(IDL.Nat8);
  const PendingDepositTxn = IDL.Tuple(
    TxHash,
    Account__2,
    IDL.Vec(IDL.Nat8),
    IDL.Bool,
    Timestamp,
    IDL.Opt(IDL.Nat)
  );
  const Toid__2 = IDL.Nat;
  const OrderStatus = IDL.Variant({
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Recovered: IDL.Null,
    Compensating: IDL.Null,
    Blocking: IDL.Null
  });
  const Status__3 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Ttid = IDL.Nat;
  const Time = IDL.Int;
  const Toid__1 = IDL.Nat;
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account__3 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount)
  });
  const Timestamp__2 = IDL.Nat64;
  const TransferArgs = IDL.Record({
    to: Account__3,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(Subaccount),
    created_at_time: IDL.Opt(Timestamp__2),
    amount: IDL.Nat
  });
  const ApproveArgs = IDL.Record({
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
    expected_allowance: IDL.Opt(IDL.Nat),
    expires_at: IDL.Opt(IDL.Nat64),
    spender: Account__3
  });
  const TransferFromArgs = IDL.Record({
    to: Account__3,
    fee: IDL.Opt(IDL.Nat),
    spender_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: Account__3,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat
  });
  const TxIndex__2 = IDL.Nat;
  const TxHash__1 = IDL.Text;
  const CustomCallType = IDL.Variant({
    createTx: TxIndex__2,
    sendTx: TxIndex__2,
    createTx_comp: TxIndex__2,
    signTx: TxIndex__2,
    validateTx: TxHash__1,
    syncTx: IDL.Tuple(TxIndex__2, IDL.Bool),
    getNonce: IDL.Tuple(TxIndex__2, IDL.Opt(IDL.Vec(IDL.Nat)))
  });
  const To = IDL.Text;
  const Amount = IDL.Nat;
  const Nonce__3 = IDL.Nat;
  const Sa = IDL.Vec(IDL.Nat8);
  const Data = IDL.Vec(IDL.Nat8);
  const Spender = IDL.Text;
  const From = IDL.Text;
  const Timeout = IDL.Nat32;
  const Decider = IDL.Text;
  const BlobFill = IDL.Variant({
    AutoFill: IDL.Null,
    ManualFill: IDL.Vec(IDL.Nat8)
  });
  const ExecuteType = IDL.Variant({
    fallback: IDL.Null,
    send: IDL.Nat,
    sendAll: IDL.Null
  });
  const CallType = IDL.Variant({
    __block: IDL.Null,
    ICRC1: IDL.Variant({ icrc1_transfer: TransferArgs }),
    ICRC2: IDL.Variant({
      icrc2_approve: ApproveArgs,
      icrc2_transfer_from: TransferFromArgs
    }),
    custom: CustomCallType,
    DRC20: IDL.Variant({
      drc20_transferBatch: IDL.Tuple(
        IDL.Vec(To),
        IDL.Vec(Amount),
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_approve: IDL.Tuple(
        Spender,
        Amount,
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_transferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_dropAccount: IDL.Opt(Sa),
      drc20_lockTransfer: IDL.Tuple(
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_transfer: IDL.Tuple(
        To,
        Amount,
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_executeTransfer: IDL.Tuple(
        BlobFill,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      )
    }),
    __skip: IDL.Null
  });
  const Attempts = IDL.Nat;
  const Callee__1 = IDL.Principal;
  const Compensation = IDL.Record({
    preTtid: IDL.Vec(Ttid),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee__1,
    forTtid: IDL.Opt(Ttid)
  });
  const Task__2 = IDL.Record({
    preTtid: IDL.Vec(Ttid),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee__1,
    forTtid: IDL.Opt(Ttid)
  });
  const Ttid__2 = IDL.Nat;
  const SagaTask = IDL.Record({
    status: Status__3,
    comp: IDL.Opt(Compensation),
    task: Task__2,
    ttid: Ttid__2
  });
  List_1.fill(IDL.Opt(IDL.Tuple(SagaTask, List_1)));
  const Tcid = IDL.Nat;
  const CompTask = IDL.Record({
    status: Status__3,
    comp: Compensation,
    tcid: Tcid,
    forTtid: Ttid__2
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
    name: IDL.Text,
    comps: List,
    time: Time,
    compStrategy: CompStrategy,
    allowPushing: IDL.Variant({ Opening: IDL.Null, Closed: IDL.Null })
  });
  const Ttid__1 = IDL.Nat;
  const Task__1 = IDL.Record({
    preTtid: IDL.Vec(Ttid),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee__1,
    forTtid: IDL.Opt(Ttid)
  });
  const Callee = IDL.Principal;
  const CalleeStatus = IDL.Record({
    continuousFailure: IDL.Nat,
    successCount: IDL.Nat,
    failureCount: IDL.Nat
  });
  const Status__1 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Return = IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Text);
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
  const ApproveError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat
    }),
    TemporarilyUnavailable: IDL.Null,
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    AllowanceChanged: IDL.Record({ current_allowance: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    Expired: IDL.Record({ ledger_time: IDL.Nat64 }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat })
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
  const Receipt = IDL.Variant({
    result: IDL.Opt(Return),
    ICRC1: IDL.Variant({
      icrc1_transfer: IDL.Variant({ Ok: IDL.Nat, Err: TransferError })
    }),
    ICRC2: IDL.Variant({
      icrc2_approve: IDL.Variant({ Ok: IDL.Nat, Err: ApproveError }),
      icrc2_transfer_from: IDL.Variant({
        Ok: IDL.Nat,
        Err: TransferFromError
      })
    }),
    none: IDL.Null,
    DRC20: IDL.Variant({
      drc20_transferBatch: IDL.Vec(TxnResult),
      drc20_approve: TxnResult,
      drc20_transferFrom: TxnResult,
      drc20_lockTransferFrom: TxnResult,
      drc20_dropAccount: IDL.Null,
      drc20_lockTransfer: TxnResult,
      drc20_transfer: TxnResult,
      drc20_executeTransfer: TxnResult
    })
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
  const ErrorLog = IDL.Record({
    result: IDL.Opt(TaskResult),
    time: Time,
    ttid: Ttid,
    callee: IDL.Opt(Callee__1)
  });
  const Status__2 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Task = IDL.Record({
    preTtid: IDL.Vec(Ttid),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee__1,
    forTtid: IDL.Opt(Ttid)
  });
  const TaskEvent = IDL.Record({
    result: TaskResult,
    callbackStatus: IDL.Opt(Status__2),
    task: Task,
    time: Time,
    toid: IDL.Opt(Toid__1),
    ttid: Ttid,
    attempts: Attempts,
    txHash: IDL.Vec(IDL.Nat8)
  });
  const SagaData = IDL.Record({
    orders: IDL.Vec(IDL.Tuple(Toid__2, Order)),
    autoClearTimeout: IDL.Int,
    aliveOrders: IDL.Vec(IDL.Tuple(Toid__2, Time)),
    index: IDL.Nat,
    actuator: IDL.Record({
      tasks: IDL.Tuple(
        IDL.Vec(IDL.Tuple(Ttid__1, Task__1)),
        IDL.Vec(IDL.Tuple(Ttid__1, Task__1))
      ),
      callees: IDL.Vec(IDL.Tuple(Callee, CalleeStatus)),
      errorLogs: IDL.Vec(IDL.Tuple(IDL.Nat, ErrorLog)),
      taskLogs: IDL.Vec(IDL.Tuple(Ttid__1, TaskEvent)),
      index: IDL.Nat,
      firstErrIndex: IDL.Nat,
      errIndex: IDL.Nat,
      firstIndex: IDL.Nat
    }),
    taskEvents: IDL.Vec(IDL.Tuple(Toid__2, IDL.Vec(Ttid__1))),
    firstIndex: IDL.Nat
  });
  const ICRC1BlockHeight = IDL.Nat;
  const RetrieveStatus = IDL.Record({
    ethAddress: EthAddress__1,
    txIndex: TxIndex,
    account: Account__2,
    burnedBlockIndex: ICRC1BlockHeight,
    amount: Wei,
    retrieveAccount: Account__2
  });
  const TxStatus = IDL.Record({
    to: EthAddress__1,
    tx: IDL.Opt(Transaction),
    fee: IDL.Record({
      gasPrice: Wei,
      maxFee: Wei,
      gasLimit: IDL.Nat
    }),
    status: Status,
    toids: IDL.Vec(IDL.Nat),
    tokenId: EthAddress__1,
    receipt: IDL.Opt(IDL.Text),
    kytRequestId: IDL.Opt(KytRequestId),
    from: EthAddress__1,
    signedTx: IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8))),
    nonce: IDL.Opt(Nonce__2),
    account: Account__2,
    txHash: IDL.Vec(TxHash),
    txType: IDL.Variant({
      Withdraw: IDL.Null,
      DepositGas: IDL.Null,
      Deposit: IDL.Null
    }),
    rpcRequestId: IDL.Opt(RpcRequestId),
    amount: Wei,
    rawTx: IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)))
  });
  const TokenTxn = IDL.Record({
    to: EthAddress__1,
    token: EthAddress__1,
    value: Wei,
    from: EthAddress__1
  });
  const DepositTxn = IDL.Record({
    status: Status,
    signature: IDL.Vec(IDL.Nat8),
    claimingTime: Timestamp,
    confirmedTime: IDL.Opt(Timestamp),
    error: IDL.Opt(IDL.Text),
    account: Account__2,
    txHash: TxHash,
    transfer: IDL.Opt(TokenTxn)
  });
  const Keeper = IDL.Record({
    url: IDL.Text,
    status: IDL.Variant({ Disabled: IDL.Null, Normal: IDL.Null }),
    balance: IDL.Nat,
    name: IDL.Text,
    account: Account__2
  });
  const BackupResponse = IDL.Variant({
    ck_rpcProviders: IDL.Vec(IDL.Tuple(AccountId, RpcProvider)),
    blockEvents: IDL.Vec(
      IDL.Tuple(BlockHeight, IDL.Tuple(Event, Timestamp__1))
    ),
    ck_rpcLogs: IDL.Vec(IDL.Tuple(RpcId, RpcLog)),
    feeBalances: IDL.Vec(IDL.Tuple(EthTokenId, Wei__2)),
    pendingRetrievals: IDL.Vec(TxIndex__1),
    kyt_txAccounts: IDL.Vec(
      IDL.Tuple(HashId, IDL.Vec(IDL.Tuple(ChainAccount, ICAccount)))
    ),
    cyclesMonitor: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
    kyt_accountAddresses: IDL.Vec(IDL.Tuple(AccountId, IDL.Vec(ChainAccount))),
    ck_rpcRequests: IDL.Vec(IDL.Tuple(RpcRequestId, RpcRequestConsensus)),
    kyt_addressAccounts: IDL.Vec(IDL.Tuple(Address, IDL.Vec(ICAccount))),
    otherData: IDL.Record({
      txIndex: TxIndex__1,
      firstRpcId: RpcId,
      countRetrieval: IDL.Nat,
      ck_ethBlockNumber: IDL.Tuple(BlockHeight, Timestamp__1),
      totalRetrieval: Wei__2,
      ck_chainId: IDL.Nat,
      blockIndex: BlockHeight,
      ck_gasPrice: Wei__2,
      rpcRequestId: RpcRequestId,
      firstBlockIndex: BlockHeight,
      firstRpcRequestId: RpcRequestId,
      countMinting: IDL.Nat,
      rpcId: RpcId,
      quoteToken: IDL.Text,
      totalMinting: Wei__2,
      ictc_admins: IDL.Vec(IDL.Principal)
    }),
    icrc1WasmHistory: IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Text)),
    accounts: IDL.Vec(IDL.Tuple(AccountId, IDL.Tuple(EthAddress__2, Nonce__1))),
    tokens: IDL.Vec(IDL.Tuple(EthAddress__2, TokenInfo__1)),
    withdrawals: IDL.Vec(IDL.Tuple(AccountId, IDL.Vec(TxIndex__1))),
    pendingDepositTxns: IDL.Vec(IDL.Tuple(TxHashId, PendingDepositTxn)),
    sagaData: SagaData,
    accountEvents: IDL.Vec(IDL.Tuple(AccountId, IDL.Vec(BlockHeight))),
    retrievals: IDL.Vec(IDL.Tuple(TxIndex__1, RetrieveStatus)),
    deposits: IDL.Vec(IDL.Tuple(AccountId, TxIndex__1)),
    transactions: IDL.Vec(
      IDL.Tuple(
        TxIndex__1,
        IDL.Tuple(TxStatus, Timestamp__1, IDL.Opt(Timestamp__1))
      )
    ),
    depositTxns: IDL.Vec(
      IDL.Tuple(TxHashId, IDL.Tuple(DepositTxn, Timestamp__1))
    ),
    ck_keepers: IDL.Vec(IDL.Tuple(AccountId, Keeper)),
    balances: IDL.Vec(
      IDL.Tuple(
        AccountId,
        IDL.Vec(IDL.Tuple(EthTokenId, IDL.Tuple(Account__1, Wei__2)))
      )
    )
  });
  const BlockHeight__1 = IDL.Nat;
  const ResultError = IDL.Variant({
    GenericError: IDL.Record({ code: IDL.Nat64, message: IDL.Text })
  });
  const RpcId__1 = IDL.Nat;
  const RpcRequestId__1 = IDL.Nat;
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
  const PubKey = IDL.Vec(IDL.Nat8);
  const EthAccount = IDL.Vec(IDL.Nat8);
  const EthAddress = IDL.Text;
  const Nonce = IDL.Nat;
  const Status__4 = IDL.Variant({
    Signing: IDL.Null,
    Building: IDL.Null,
    Confirmed: IDL.Null,
    Sending: IDL.Null,
    Unknown: IDL.Null,
    Submitted: IDL.Null,
    Failure: IDL.Null,
    Pending: IDL.Null
  });
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const Result = IDL.Variant({ ok: TxHash__1, err: IDL.Text });
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
  const Event__1 = IDL.Variant({
    depositGas: IDL.Record({
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress__1,
      account: Account__2,
      amount: Wei
    }),
    withdraw: IDL.Record({
      fee: IDL.Opt(Wei),
      token: EthAddress__1,
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress__1,
      account: Account__2,
      amount: Wei
    }),
    keeper: IDL.Record({
      operation: IDL.Variant({
        setRpc: IDL.Record({
          keeper: Account__2,
          operation: IDL.Variant({
            put: IDL.Tuple(
              IDL.Text,
              IDL.Variant({ Available: IDL.Null, Unavailable: IDL.Null })
            ),
            remove: IDL.Null
          })
        })
      })
    }),
    continueTransaction: IDL.Record({
      txIndex: TxIndex,
      preTxid: IDL.Vec(TxHash),
      toid: IDL.Nat,
      updateTx: IDL.Opt(UpdateTxArgs),
      account: Account__2
    }),
    depositResult: IDL.Variant({
      ok: IDL.Record({
        fee: IDL.Opt(Wei),
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      })
    }),
    burn: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      address: EthAddress__1,
      account: Account__2,
      amount: Wei,
      tokenBlockIndex: IDL.Nat
    }),
    init: IDL.Record({ initArgs: InitArgs }),
    mint: IDL.Record({
      toid: IDL.Nat,
      icTokenCanisterId: IDL.Principal,
      account: Account__2,
      amount: Wei
    }),
    send: IDL.Record({
      to: Account__2,
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      amount: Wei
    }),
    coverTransaction: IDL.Record({
      txIndex: TxIndex,
      preTxid: IDL.Vec(TxHash),
      toid: IDL.Nat,
      updateTx: IDL.Opt(UpdateTxArgs),
      account: Account__2
    }),
    claimDepositResult: IDL.Variant({
      ok: IDL.Record({
        fee: IDL.Opt(Wei),
        token: EthAddress__1,
        signature: IDL.Text,
        from: EthAddress__1,
        account: Account__2,
        txHash: TxHash,
        amount: Wei
      }),
      err: IDL.Record({
        signature: IDL.Text,
        error: IDL.Text,
        account: Account__2,
        txHash: TxHash
      })
    }),
    changeOwner: IDL.Record({ newOwner: IDL.Principal }),
    deposit: IDL.Record({
      fee: IDL.Opt(Wei),
      token: EthAddress__1,
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress__1,
      account: Account__2,
      amount: Wei
    }),
    start: IDL.Record({ message: IDL.Opt(IDL.Text) }),
    updateTokenPrice: IDL.Record({
      token: EthAddress__1,
      ethRatio: Wei,
      price: IDL.Float64
    }),
    withdrawResult: IDL.Variant({
      ok: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      })
    }),
    depositGasResult: IDL.Variant({
      ok: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account__2,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress__1,
        txIndex: TxIndex,
        account: Account__2,
        amount: Wei
      })
    }),
    claimDeposit: IDL.Record({
      signature: IDL.Text,
      account: Account__2,
      txHash: TxHash
    }),
    config: IDL.Record({
      setting: IDL.Variant({
        upgradeTokenWasm: IDL.Record({
          icTokenCanisterId: IDL.Principal,
          version: IDL.Text,
          symbol: IDL.Text
        }),
        setToken: IDL.Record({
          token: EthAddress__1,
          info: TokenInfo__1
        }),
        depositMethod: IDL.Nat8,
        setDexPair: IDL.Record({
          token: EthAddress__1,
          dexPair: IDL.Opt(IDL.Principal)
        }),
        updateRpc: IDL.Record({
          keeper: Account__2,
          operation: IDL.Variant({
            set: IDL.Variant({
              Available: IDL.Null,
              Unavailable: IDL.Null
            }),
            remove: IDL.Null
          })
        }),
        minRpcConfirmations: IDL.Nat,
        launchToken: IDL.Record({
          token: EthAddress__1,
          icTokenCanisterId: IDL.Principal,
          symbol: IDL.Text
        }),
        setKeeper: IDL.Record({
          url: IDL.Text,
          status: IDL.Variant({
            Disabled: IDL.Null,
            Normal: IDL.Null
          }),
          name: IDL.Text,
          account: Account__2
        }),
        dependents: IDL.Record({ utilsTool: IDL.Principal }),
        setTokenWasm: IDL.Record({ size: IDL.Nat, version: IDL.Text }),
        minConfirmations: IDL.Nat
      })
    }),
    suspend: IDL.Record({ message: IDL.Opt(IDL.Text) })
  });
  const Timestamp__3 = IDL.Nat;
  const Address__1 = IDL.Text;
  const TokenCanisterId__1 = IDL.Principal;
  const Account__4 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const ICAccount__1 = IDL.Tuple(TokenCanisterId__1, Account__4);
  const AccountId__3 = IDL.Vec(IDL.Nat8);
  const Chain__1 = IDL.Text;
  const TokenId__1 = IDL.Vec(IDL.Nat8);
  const ChainAccount__1 = IDL.Tuple(Chain__1, TokenId__1, Address__1);
  const TxHash__2 = IDL.Text;
  const TokenInfo = IDL.Record({
    fee: IDL.Record({
      fixedFee: Wei,
      ethRatio: Wei,
      gasLimit: IDL.Nat
    }),
    std: IDL.Variant({ ETH: IDL.Null, ERC20: IDL.Null }),
    decimals: IDL.Nat8,
    dexPrice: IDL.Opt(IDL.Tuple(IDL.Float64, Timestamp)),
    tokenId: EthAddress__1,
    minAmount: Wei,
    totalSupply: IDL.Opt(Wei),
    ckLedgerId: IDL.Principal,
    ckSymbol: IDL.Text,
    dexPair: IDL.Opt(IDL.Principal),
    symbol: IDL.Text
  });
  const ListPage = IDL.Nat;
  const ListSize = IDL.Nat;
  const TrieList_4 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(BlockHeight__1, IDL.Tuple(Event__1, Timestamp__3))),
    totalPage: IDL.Nat
  });
  const Keeper__1 = IDL.Record({
    url: IDL.Text,
    status: IDL.Variant({ Disabled: IDL.Null, Normal: IDL.Null }),
    balance: IDL.Nat,
    name: IDL.Text,
    account: Account__2
  });
  const TrieList_3 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(AccountId__2, Keeper__1)),
    totalPage: IDL.Nat
  });
  const BlockHeight__2 = IDL.Nat;
  const MinterInfo = IDL.Record({
    decimals: IDL.Nat8,
    gasPrice: Wei,
    totalRetrievalAmount: Wei,
    owner: IDL.Principal,
    depositMethod: IDL.Nat8,
    totalMintingAmount: Wei,
    blockSlot: IDL.Nat,
    pendingRetrievals: IDL.Nat,
    network: IDL.Text,
    countRetrieval: IDL.Nat,
    isDebug: IDL.Bool,
    syncBlockNumber: BlockHeight__2,
    version: IDL.Text,
    minRpcConfirmations: IDL.Nat,
    pendingDeposits: IDL.Nat,
    address: EthAddress__1,
    chainId: IDL.Nat,
    minConfirmations: IDL.Nat,
    countMinting: IDL.Nat,
    symbol: IDL.Text,
    paused: IDL.Bool
  });
  const DepositTxn__1 = IDL.Record({
    status: Status,
    signature: IDL.Vec(IDL.Nat8),
    claimingTime: Timestamp,
    confirmedTime: IDL.Opt(Timestamp),
    error: IDL.Opt(IDL.Text),
    account: Account__2,
    txHash: TxHash,
    transfer: IDL.Opt(TokenTxn)
  });
  const RpcLog__1 = IDL.Record({
    err: IDL.Opt(IDL.Text),
    url: IDL.Text,
    result: IDL.Opt(IDL.Text),
    time: Timestamp,
    input: IDL.Text
  });
  const TrieList_2 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(RpcId__1, RpcLog__1)),
    totalPage: IDL.Nat
  });
  const RpcProvider__1 = IDL.Record({
    url: IDL.Text,
    status: IDL.Variant({
      Available: IDL.Null,
      Unavailable: IDL.Null
    }),
    keeper: AccountId__1,
    calls: IDL.Nat,
    name: IDL.Text,
    errors: IDL.Nat,
    latestCall: Timestamp,
    healthCheck: Healthiness,
    preHealthCheck: Healthiness
  });
  const TrieList_1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(AccountId__2, RpcProvider__1)),
    totalPage: IDL.Nat
  });
  const RpcRequestConsensus__1 = IDL.Record({
    status: RpcRequestStatus,
    requests: IDL.Vec(RpcFetchLog),
    confirmed: IDL.Nat
  });
  const Value__1 = IDL.Variant({
    Int: IDL.Int,
    Nat: IDL.Nat,
    Raw: IDL.Vec(IDL.Nat8),
    Empty: IDL.Null,
    Bool: IDL.Bool,
    Text: IDL.Text,
    Float: IDL.Float64
  });
  const TrieList = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(RpcRequestId__1, RpcRequestConsensus__1)),
    totalPage: IDL.Nat
  });
  const Toid = IDL.Nat;
  const CallType__1 = IDL.Variant({
    __block: IDL.Null,
    ICRC1: IDL.Variant({ icrc1_transfer: TransferArgs }),
    ICRC2: IDL.Variant({
      icrc2_approve: ApproveArgs,
      icrc2_transfer_from: TransferFromArgs
    }),
    custom: CustomCallType,
    DRC20: IDL.Variant({
      drc20_transferBatch: IDL.Tuple(
        IDL.Vec(To),
        IDL.Vec(Amount),
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_approve: IDL.Tuple(
        Spender,
        Amount,
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_transferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_dropAccount: IDL.Opt(Sa),
      drc20_lockTransfer: IDL.Tuple(
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_transfer: IDL.Tuple(
        To,
        Amount,
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      ),
      drc20_executeTransfer: IDL.Tuple(
        BlobFill,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce__3),
        IDL.Opt(Sa),
        IDL.Opt(Data)
      )
    }),
    __skip: IDL.Null
  });
  const Order__1 = IDL.Record({
    status: OrderStatus,
    tasks: List_1,
    callbackStatus: IDL.Opt(Status__3),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    name: IDL.Text,
    comps: List,
    time: Time,
    compStrategy: CompStrategy,
    allowPushing: IDL.Variant({ Opening: IDL.Null, Closed: IDL.Null })
  });
  const Sa__1 = IDL.Vec(IDL.Nat8);
  const RetrieveResult = IDL.Record({
    txIndex: TxIndex,
    toid: IDL.Nat,
    blockIndex: IDL.Nat,
    amount: Wei,
    retrieveFee: Wei
  });
  const HttpHeader = IDL.Record({ value: IDL.Text, name: IDL.Text });
  const HttpResponsePayload = IDL.Record({
    status: IDL.Nat,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HttpHeader)
  });
  const TransformArgs = IDL.Record({
    context: IDL.Vec(IDL.Nat8),
    response: HttpResponsePayload
  });
  const BalanceStats = IDL.Record({
    feeBalance: Wei,
    totalSupply: Wei,
    minterBalance: Wei,
    nativeBalance: Wei
  });
  const UpdateBalanceResult = IDL.Record({
    txIndex: TxIndex,
    toid: IDL.Nat,
    blockIndex: IDL.Nat,
    amount: Wei
  });
  return IDL.Service({
    addRpcWhitelist: IDL.Func([IDL.Text], [], []),
    allocateRewards: IDL.Func(
      [
        IDL.Vec(
          IDL.Record({
            _value: Wei__1,
            _sendRetainedBalance: IDL.Bool,
            _account: Account
          })
        )
      ],
      [IDL.Vec(IDL.Tuple(Account, IDL.Bool))],
      []
    ),
    backup: IDL.Func([BackupRequest], [BackupResponse], []),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    claim: IDL.Func(
      [Account, TxHash__1, IDL.Vec(IDL.Nat8)],
      [IDL.Variant({ Ok: BlockHeight__1, Err: ResultError })],
      []
    ),
    clearCkTransactions: IDL.Func([], [], []),
    clearDepositTxns: IDL.Func([], [], []),
    clearEvents: IDL.Func([BlockHeight__1, BlockHeight__1], [], []),
    clearRpcLogs: IDL.Func([RpcId__1, RpcId__1], [], []),
    clearRpcRequests: IDL.Func([RpcRequestId__1, RpcRequestId__1], [], []),
    confirmRetrievalTx: IDL.Func([TxIndex__2], [IDL.Bool], []),
    cover_tx: IDL.Func(
      [TxIndex__2, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Opt(BlockHeight__1)],
      []
    ),
    debug_canister_status: IDL.Func([IDL.Principal], [canister_status], []),
    debug_clearMethod2Txn: IDL.Func([], [], []),
    debug_convertFees: IDL.Func([], [], []),
    debug_fetchPairPrice: IDL.Func([IDL.Principal], [IDL.Float64], []),
    debug_fetch_address: IDL.Func(
      [Account],
      [PubKey, EthAccount, EthAddress],
      []
    ),
    debug_fetch_balance: IDL.Func(
      [IDL.Opt(EthAddress), EthAddress, IDL.Bool],
      [IDL.Nat],
      []
    ),
    debug_fetch_nonce: IDL.Func(
      [IDL.Variant({ pending: IDL.Null, latest: IDL.Null })],
      [Nonce],
      []
    ),
    debug_fetch_receipt: IDL.Func(
      [TxHash__1],
      [IDL.Bool, BlockHeight__1, Status__4, IDL.Opt(IDL.Vec(IDL.Text))],
      []
    ),
    debug_fetch_token_metadata: IDL.Func(
      [EthAddress],
      [IDL.Record({ decimals: IDL.Nat8, symbol: IDL.Text })],
      []
    ),
    debug_fetch_txn: IDL.Func(
      [TxHash__1],
      [
        IDL.Bool,
        IDL.Opt(TokenTxn),
        BlockHeight__1,
        Status__4,
        IDL.Opt(IDL.Nat),
        IDL.Opt(IDL.Vec(IDL.Text))
      ],
      []
    ),
    debug_get_address: IDL.Func([Account], [EthAddress, Nonce], []),
    debug_get_rpc: IDL.Func([IDL.Nat], [AccountId__2, IDL.Text, IDL.Nat], []),
    debug_get_tx: IDL.Func([TxIndex__2], [IDL.Opt(TxStatus)], []),
    debug_local_createTx: IDL.Func(
      [TxIndex__2],
      [
        IDL.Record({
          txi: IDL.Nat,
          txHash: TxHash__1,
          rawTx: IDL.Vec(IDL.Nat8)
        })
      ],
      []
    ),
    debug_local_getNonce: IDL.Func(
      [TxIndex__2],
      [
        IDL.Record({
          txi: IDL.Nat,
          address: EthAddress,
          nonce: Nonce
        })
      ],
      []
    ),
    debug_local_sendTx: IDL.Func(
      [TxIndex__2],
      [
        IDL.Record({
          txi: IDL.Nat,
          result: Result,
          rpcId: RpcId__1
        })
      ],
      []
    ),
    debug_local_signTx: IDL.Func(
      [TxIndex__2],
      [
        IDL.Record({
          txi: IDL.Nat,
          signature: IDL.Vec(IDL.Nat8),
          txHash: TxHash__1,
          rawTx: IDL.Vec(IDL.Nat8)
        })
      ],
      []
    ),
    debug_monitor: IDL.Func([], [], []),
    debug_new_tx: IDL.Func(
      [
        IDL.Variant({
          Withdraw: IDL.Null,
          DepositGas: IDL.Null,
          Deposit: IDL.Null
        }),
        Account,
        IDL.Opt(EthAddress),
        EthAddress,
        EthAddress,
        Wei__1
      ],
      [TxIndex__2],
      []
    ),
    debug_outcall: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat64],
      [IDL.Nat, IDL.Vec(IDL.Nat8), IDL.Text],
      []
    ),
    debug_reconciliation: IDL.Func([], [], []),
    debug_removeDepositingTxi: IDL.Func([AccountId__2, TxIndex__2], [], []),
    debug_removePendingDepositTxn: IDL.Func([TxHash__1], [], []),
    debug_removeRetrievingTxi: IDL.Func([TxIndex__2], [], []),
    debug_send_to: IDL.Func(
      [IDL.Principal, EthAddress, EthAddress, Wei__1],
      [TxIndex__2],
      []
    ),
    debug_sha3: IDL.Func([IDL.Text], [IDL.Text], []),
    debug_sign_and_recover_msg: IDL.Func(
      [IDL.Text],
      [
        IDL.Record({
          signature: IDL.Text,
          recovered: IDL.Text,
          msgHash: IDL.Text,
          address: IDL.Text
        })
      ],
      []
    ),
    debug_sync_tx: IDL.Func([TxIndex__2], [], []),
    debug_updateBalance: IDL.Func([IDL.Opt(AccountId__2)], [], []),
    debug_updateTokenEthRatio: IDL.Func([], [], []),
    debug_updateTokenPrice: IDL.Func([EthAddress], [], []),
    debug_verify_sign: IDL.Func(
      [EthAddress, Account, TxHash__1, IDL.Vec(IDL.Nat8)],
      [
        IDL.Text,
        IDL.Record({
          r: IDL.Vec(IDL.Nat8),
          s: IDL.Vec(IDL.Nat8),
          v: IDL.Nat64
        }),
        EthAddress
      ],
      []
    ),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    getCkTokenWasmHistory: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
      ['query']
    ),
    getCkTokenWasmVersion: IDL.Func([], [IDL.Text, IDL.Nat], ['query']),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    get_account_events: IDL.Func(
      [AccountId__2],
      [IDL.Vec(IDL.Tuple(Event__1, Timestamp__3))],
      ['query']
    ),
    get_cached_account: IDL.Func(
      [Address__1],
      [IDL.Opt(IDL.Vec(ICAccount__1))],
      ['query']
    ),
    get_cached_address: IDL.Func(
      [AccountId__3],
      [IDL.Opt(IDL.Vec(ChainAccount__1))],
      ['query']
    ),
    get_cached_tx_account: IDL.Func(
      [TxHash__2],
      [IDL.Opt(IDL.Vec(IDL.Tuple(ChainAccount__1, ICAccount__1)))],
      ['query']
    ),
    get_ck_tokens: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(EthAddress, TokenInfo))],
      ['query']
    ),
    get_deposit_address: IDL.Func([Account], [EthAddress], []),
    get_depositing_all: IDL.Func(
      [
        IDL.Variant({
          all: IDL.Null,
          eth: IDL.Null,
          token: EthAddress
        }),
        IDL.Opt(Account)
      ],
      [IDL.Vec(IDL.Tuple(Wei__1, IDL.Opt(TxIndex__2), IDL.Opt(TxStatus)))],
      ['query']
    ),
    get_event: IDL.Func(
      [BlockHeight__1],
      [IDL.Opt(IDL.Tuple(Event__1, Timestamp__3))],
      ['query']
    ),
    get_event_count: IDL.Func([], [IDL.Nat], ['query']),
    get_event_first_index: IDL.Func([], [BlockHeight__1], ['query']),
    get_events: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList_4],
      ['query']
    ),
    get_fee_balance: IDL.Func([IDL.Opt(EthAddress)], [Wei__1], ['query']),
    get_keepers: IDL.Func([], [TrieList_3], ['query']),
    get_minter_address: IDL.Func([], [EthAddress, Nonce], ['query']),
    get_minter_info: IDL.Func([], [MinterInfo], ['query']),
    get_mode2_deposit_txn: IDL.Func(
      [TxHash__1],
      [IDL.Opt(IDL.Tuple(DepositTxn__1, Timestamp__3))],
      ['query']
    ),
    get_mode2_pending_all: IDL.Func(
      [
        IDL.Variant({
          all: IDL.Null,
          eth: IDL.Null,
          token: EthAddress
        }),
        IDL.Opt(Account)
      ],
      [IDL.Vec(IDL.Tuple(DepositTxn, Timestamp__3, IDL.Bool))],
      ['query']
    ),
    get_mode2_pending_deposit_txn: IDL.Func(
      [TxHash__1],
      [IDL.Opt(PendingDepositTxn)],
      ['query']
    ),
    get_pool_balance: IDL.Func([IDL.Opt(EthAddress)], [Wei__1], ['query']),
    get_retrieval: IDL.Func([TxIndex__2], [IDL.Opt(RetrieveStatus)], ['query']),
    get_retrieval_list: IDL.Func(
      [Account],
      [IDL.Vec(RetrieveStatus)],
      ['query']
    ),
    get_retrieving_all: IDL.Func(
      [
        IDL.Variant({
          all: IDL.Null,
          eth: IDL.Null,
          token: EthAddress
        }),
        IDL.Opt(Account)
      ],
      [IDL.Vec(IDL.Tuple(TxIndex__2, TxStatus, Timestamp__3))],
      ['query']
    ),
    get_rpc_log: IDL.Func([RpcId__1], [IDL.Opt(RpcLog__1)], ['query']),
    get_rpc_logs: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList_2],
      ['query']
    ),
    get_rpc_providers: IDL.Func([], [TrieList_1], ['query']),
    get_rpc_request: IDL.Func(
      [RpcRequestId__1],
      [IDL.Opt(RpcRequestConsensus__1)],
      ['query']
    ),
    get_rpc_request_temps: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Tuple(
            RpcRequestId__1,
            IDL.Tuple(
              IDL.Vec(IDL.Tuple(IDL.Vec(Value__1), IDL.Nat)),
              Timestamp__3
            )
          )
        )
      ],
      ['query']
    ),
    get_rpc_requests: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList],
      ['query']
    ),
    get_tx: IDL.Func([TxIndex__2], [IDL.Opt(TxStatus)], ['query']),
    get_withdrawal_account: IDL.Func([Account], [Account__2], ['query']),
    ictc_TM: IDL.Func([], [IDL.Text], ['query']),
    ictc_addAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_appendTT: IDL.Func(
      [
        IDL.Opt(IDL.Vec(IDL.Nat8)),
        Toid,
        IDL.Opt(Ttid__2),
        IDL.Principal,
        CallType__1,
        IDL.Vec(Ttid__2)
      ],
      [Ttid__2],
      []
    ),
    ictc_blockTO: IDL.Func([Toid], [IDL.Opt(Toid)], []),
    ictc_clearLog: IDL.Func([IDL.Opt(IDL.Int), IDL.Bool], [], []),
    ictc_clearTTPool: IDL.Func([], [], []),
    ictc_completeTO: IDL.Func([Toid, OrderStatus], [IDL.Bool], []),
    ictc_doneTO: IDL.Func([Toid, OrderStatus, IDL.Bool], [IDL.Bool], []),
    ictc_doneTT: IDL.Func([Toid, Ttid__2, IDL.Bool], [IDL.Opt(Ttid__2)], []),
    ictc_getAdmins: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    ictc_getCalleeStatus: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(CalleeStatus)],
      ['query']
    ),
    ictc_getTO: IDL.Func([Toid], [IDL.Opt(Order__1)], ['query']),
    ictc_getTOCount: IDL.Func([], [IDL.Nat], ['query']),
    ictc_getTOPool: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(Toid, IDL.Opt(Order__1)))],
      ['query']
    ),
    ictc_getTOs: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(Toid, Order__1)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_getTT: IDL.Func([Ttid__2], [IDL.Opt(TaskEvent)], ['query']),
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
      [IDL.Vec(IDL.Tuple(Ttid__2, Task__2))],
      ['query']
    ),
    ictc_getTTs: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(Ttid__2, TaskEvent)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_redoTT: IDL.Func([Toid, Ttid__2], [IDL.Opt(Ttid__2)], []),
    ictc_removeAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_runTO: IDL.Func([Toid], [IDL.Opt(OrderStatus)], []),
    ictc_runTT: IDL.Func([], [IDL.Bool], []),
    keeper_set_rpc: IDL.Func(
      [
        IDL.Variant({
          put: IDL.Tuple(
            IDL.Text,
            IDL.Text,
            IDL.Variant({ Available: IDL.Null, Unavailable: IDL.Null })
          ),
          remove: IDL.Null
        }),
        IDL.Opt(Sa__1)
      ],
      [IDL.Bool],
      []
    ),
    launchToken: IDL.Func(
      [
        IDL.Opt(EthAddress),
        IDL.Opt(IDL.Text),
        IDL.Record({
          minAmount: Wei__1,
          fixedFee: Wei__1,
          totalSupply: IDL.Opt(Wei__1),
          ethRatio: Wei__1,
          ckTokenFee: Wei__1,
          gasLimit: IDL.Nat
        })
      ],
      [IDL.Principal],
      []
    ),
    monitor_canisters: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
      ['query']
    ),
    monitor_put: IDL.Func([IDL.Principal], [], []),
    monitor_remove: IDL.Func([IDL.Principal], [], []),
    rebuildAndContinue: IDL.Func(
      [
        TxIndex__2,
        Toid,
        IDL.Variant({
          Remain: IDL.Null,
          Reset: IDL.Record({ spentTxHash: TxHash__1 })
        })
      ],
      [IDL.Opt(BlockHeight__1)],
      []
    ),
    rebuildAndResend: IDL.Func(
      [
        TxIndex__2,
        IDL.Variant({
          Remain: IDL.Null,
          Reset: IDL.Record({ spentTxHash: TxHash__1 })
        }),
        IDL.Bool,
        Wei__1,
        IDL.Bool
      ],
      [IDL.Opt(BlockHeight__1)],
      []
    ),
    recovery: IDL.Func([BackupResponse], [IDL.Bool], []),
    removeRpcWhitelist: IDL.Func([IDL.Text], [], []),
    removeToken: IDL.Func([IDL.Opt(EthAddress)], [], []),
    resetNonce: IDL.Func(
      [IDL.Variant({ pending: IDL.Null, latest: IDL.Null })],
      [Nonce],
      []
    ),
    retrieve: IDL.Func(
      [IDL.Opt(EthAddress), EthAddress, Wei__1, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Variant({ Ok: RetrieveResult, Err: ResultError })],
      []
    ),
    rpc_call_transform: IDL.Func(
      [TransformArgs],
      [HttpResponsePayload],
      ['query']
    ),
    sendBlankTx: IDL.Func([IDL.Nat], [Toid], []),
    setCkTokenWasm: IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [], []),
    setDepositMethod: IDL.Func([IDL.Nat8], [IDL.Bool], []),
    setKeeper: IDL.Func(
      [
        Account,
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Variant({ Disabled: IDL.Null, Normal: IDL.Null })
      ],
      [IDL.Bool],
      []
    ),
    setMinConfirmations: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMinRpcConfirmations: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setPause: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setTokenDexPair: IDL.Func(
      [
        IDL.Variant({
          ETH: IDL.Record({
            dexPair: IDL.Principal,
            quoteToken: EthAddress
          }),
          ERC20: IDL.Record({
            tokenId: EthAddress,
            dexPair: IDL.Principal
          })
        })
      ],
      [IDL.Bool],
      []
    ),
    setTokenFees: IDL.Func(
      [
        IDL.Opt(EthAddress),
        IDL.Record({
          minAmount: Wei__1,
          fixedFee: Wei__1,
          totalSupply: IDL.Opt(IDL.Nat),
          ethRatio: IDL.Opt(Wei__1),
          gasLimit: IDL.Nat
        })
      ],
      [IDL.Bool],
      []
    ),
    setTokenInfo: IDL.Func([IDL.Opt(EthAddress), TokenInfo], [], []),
    setTokenLogo: IDL.Func([IDL.Principal, IDL.Text], [IDL.Bool], []),
    sync: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat, IDL.Text, IDL.Nat], []),
    timerStart: IDL.Func([IDL.Nat, IDL.Nat], [], []),
    timerStop: IDL.Func([], [], []),
    updateMinterBalance: IDL.Func(
      [IDL.Opt(EthAddress), IDL.Bool],
      [
        IDL.Record({
          pre: BalanceStats,
          post: BalanceStats,
          shortfall: Wei__1
        })
      ],
      []
    ),
    updateRpc: IDL.Func(
      [
        Account,
        IDL.Variant({
          set: IDL.Variant({
            Available: IDL.Null,
            Unavailable: IDL.Null
          }),
          remove: IDL.Null
        })
      ],
      [IDL.Bool],
      []
    ),
    update_balance: IDL.Func(
      [IDL.Opt(EthAddress), Account],
      [IDL.Variant({ Ok: UpdateBalanceResult, Err: ResultError })],
      []
    ),
    upgradeToken: IDL.Func([IDL.Principal, IDL.Text], [IDL.Text], []),
    wallet_receive: IDL.Func([], [], [])
  });
};
