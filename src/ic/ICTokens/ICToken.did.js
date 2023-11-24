export default ({ IDL }) => {
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount)
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
  const Metadata = IDL.Record({ content: IDL.Text, name: IDL.Text });
  const Address = IDL.Text;
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
  const Token = IDL.Record({
    decimals: IDL.Nat8,
    moduleHash: IDL.Opt(IDL.Vec(IDL.Nat8)),
    name: IDL.Text,
    note: IDL.Text,
    symbol: IDL.Text
  });
  const Time = IDL.Int;
  const TokenItem = IDL.Tuple(IDL.Principal, Token, IDL.Nat, IDL.Nat, Time);
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
    ICLWithdraw: IDL.Func([Account, IDL.Nat], [], []),
    cancelStar: IDL.Func(
      [IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Bool],
      []
    ),
    canister_status: IDL.Func([], [canister_status], []),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    config: IDL.Func(
      [
        IDL.Record({
          BLACKHOLE: IDL.Opt(IDL.Principal),
          SYSTOKEN_FEE: IDL.Opt(IDL.Nat),
          TOKEN_CREATION_FEE: IDL.Opt(IDL.Nat),
          SYSTOKEN: IDL.Opt(IDL.Principal),
          STAR_IT_FEE: IDL.Opt(IDL.Nat)
        })
      ],
      [],
      []
    ),
    create: IDL.Func(
      [InitArgs, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Opt(IDL.Principal)],
      []
    ),
    cyclesWithdraw: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    deleteToken: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    deleteTokenList: IDL.Func([IDL.Principal], [IDL.Bool], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    getMemory: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], ['query']),
    getStarTokens: IDL.Func(
      [IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Opt(IDL.Vec(IDL.Principal))],
      ['query']
    ),
    getTokenList: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(TokenItem)], ['query']),
    getTokens: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Principal)], ['query']),
    getWasmVersion: IDL.Func([], [IDL.Text, IDL.Text, IDL.Nat], ['query']),
    modifyControllers: IDL.Func(
      [IDL.Principal, IDL.Vec(IDL.Principal)],
      [IDL.Bool],
      []
    ),
    modifyManager: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], []),
    rollback: IDL.Func([IDL.Principal, InitArgs], [], []),
    setWasm: IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text, IDL.Bool], [], []),
    starIt: IDL.Func([IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))], [], []),
    tokenStatus: IDL.Func([IDL.Principal], [TokenStatus], []),
    update: IDL.Func([IDL.Principal, InitArgs], [], []),
    updateTokenList: IDL.Func([IDL.Principal, Token, IDL.Nat], [IDL.Bool], []),
    wallet_receive: IDL.Func([], [], [])
  });
};
