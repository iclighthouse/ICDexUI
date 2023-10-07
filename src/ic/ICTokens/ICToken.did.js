export default ({ IDL }) => {
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
  const Address = IDL.Text;
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
  const Metadata = IDL.Record({ content: IDL.Text, name: IDL.Text });
  const InitArgs = IDL.Record({
    fee: IDL.Nat,
    decimals: IDL.Nat8,
    metadata: IDL.Opt(IDL.Vec(Metadata)),
    name: IDL.Opt(IDL.Text),
    totalSupply: IDL.Nat,
    founder: IDL.Opt(Address),
    symbol: IDL.Opt(IDL.Text)
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
  const Time__1 = IDL.Int;
  const Gas = IDL.Variant({
    token: IDL.Nat,
    cycles: IDL.Nat,
    noFee: IDL.Null
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const Time = IDL.Int;
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
  const CallbackLog = IDL.Tuple(IDL.Principal, Time__1, TxnRecord);
  const Token = IDL.Record({
    decimals: IDL.Nat8,
    moduleHash: IDL.Opt(IDL.Vec(IDL.Nat8)),
    name: IDL.Text,
    note: IDL.Text,
    symbol: IDL.Text
  });
  const TokenItem = IDL.Tuple(IDL.Principal, Token, IDL.Nat, IDL.Nat, Time__1);
  const ExecuteType = IDL.Variant({
    fallback: IDL.Null,
    send: IDL.Nat,
    sendAll: IDL.Null
  });
  const TokenStatus = IDL.Record({
    status: IDL.Variant({
      stopped: IDL.Null,
      stopping: IDL.Null,
      running: IDL.Null
    }),
    memory_size: IDL.Nat,
    cycles: IDL.Nat,
    settings: IDL.Record({
      freezing_threshold: IDL.Nat,
      controllers: IDL.Vec(IDL.Principal),
      memory_allocation: IDL.Nat,
      compute_allocation: IDL.Nat
    }),
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  return IDL.Service({
    ICLBurn: IDL.Func([IDL.Nat], [TxnResult], []),
    ICLWithdraw: IDL.Func([Address, IDL.Nat], [TxnResult], []),
    cancelStar: IDL.Func([IDL.Principal], [IDL.Bool], []),
    canister_status: IDL.Func([], [canister_status], []),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    create: IDL.Func([InitArgs], [IDL.Opt(IDL.Principal)], []),
    cyclesWithdraw: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    deleteToken: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    deleteTokenList: IDL.Func([IDL.Principal], [IDL.Bool], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    getCallbackLogs: IDL.Func([], [IDL.Vec(CallbackLog)], ['query']),
    getMemory: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], ['query']),
    getStarTokens: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(IDL.Vec(IDL.Principal))],
      ['query']
    ),
    getTokenList: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(TokenItem)], ['query']),
    getTokens: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Principal)], ['query']),
    getWasmVersion: IDL.Func([], [IDL.Text, IDL.Text, IDL.Nat], ['query']),
    lockTransferFromTest: IDL.Func(
      [IDL.Principal, Address, Address, IDL.Nat, ExecuteType],
      [IDL.Opt(Txid)],
      []
    ),
    lockTransferTest: IDL.Func(
      [IDL.Principal, Address, IDL.Nat, ExecuteType],
      [IDL.Opt(Txid)],
      []
    ),
    modifyControllers: IDL.Func(
      [IDL.Principal, IDL.Vec(IDL.Principal)],
      [IDL.Bool],
      []
    ),
    modifyOwner: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], []),
    rollback: IDL.Func([IDL.Principal, InitArgs], [], []),
    setWasm: IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text, IDL.Bool], [], []),
    subscribe: IDL.Func([IDL.Principal], [IDL.Bool], []),
    tokenCallback: IDL.Func([TxnRecord], [], []),
    tokenStatus: IDL.Func([IDL.Principal], [TokenStatus], []),
    unsubscribe: IDL.Func([IDL.Principal], [IDL.Bool], []),
    update: IDL.Func([IDL.Principal, InitArgs], [], []),
    updateTokenList: IDL.Func([IDL.Principal, Token, IDL.Nat], [IDL.Bool], []),
    wallet_receive: IDL.Func([], [], [])
  });
};
