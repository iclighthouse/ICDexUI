export default ({ IDL }) => {
  const Time = IDL.Int;
  const PhaseConfig__1 = IDL.Record({
    end: Time,
    interval: IDL.Int,
    halving: IDL.Int,
    totalLimit: IDL.Nat,
    start: Time,
    supply: IDL.Nat,
    minCycles: IDL.Nat,
    accountLimit: IDL.Nat
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
  const ErrorItem = IDL.Tuple(
    IDL.Nat,
    IDL.Nat,
    IDL.Principal,
    IDL.Nat,
    IDL.Opt(IDL.Nat),
    TxnResult
  );
  const Status = IDL.Variant({
    opening: IDL.Null,
    stopped: IDL.Null,
    prepared: IDL.Null
  });
  const RoundStatus__1 = IDL.Record({
    status: Status,
    isSettled: IDL.Bool,
    cyclesReceived: IDL.Nat,
    supply: IDL.Nat
  });
  const Status__1 = IDL.Variant({
    opening: IDL.Null,
    stopped: IDL.Null,
    prepared: IDL.Null
  });
  const RoundStatus = IDL.Record({
    status: Status,
    isSettled: IDL.Bool,
    cyclesReceived: IDL.Nat,
    supply: IDL.Nat
  });
  const MiningStatusResponse = IDL.Record({
    phaseTotalSupply: IDL.Nat,
    currentPhase: IDL.Nat,
    currentRound: IDL.Nat,
    roundStatus: RoundStatus,
    phaseTotalCyclesReceived: IDL.Nat,
    totalSupply: IDL.Nat,
    phaseStatus: Status,
    totalCyclesReceived: IDL.Nat
  });
  const Address = IDL.Text;
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier
  });
  const TokenIdentifier = IDL.Text;
  const Balance = IDL.Nat;
  const TradingMining = IDL.Record({
    max: IDL.Nat,
    title: IDL.Text,
    content: IDL.Text,
    end1: Time,
    end2: Time,
    nftFactor: IDL.Nat,
    start: Time,
    pairs: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
    ratio: IDL.Nat
  });
  const Memo = IDL.Vec(IDL.Nat8);
  const RoundUserStatus = IDL.Record({
    mintTime: Time,
    mintTxid: IDL.Opt(IDL.Vec(IDL.Nat8)),
    cycles: IDL.Nat,
    mintAmount: IDL.Nat
  });
  return IDL.Service({
    btcTaskCompleted: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    btcTaskMining: IDL.Func([], [IDL.Bool], []),
    cfTaskCompleted: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    cfTaskMining: IDL.Func([], [IDL.Bool], []),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    checkWhitelist: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    clearWhitelist: IDL.Func([], [IDL.Bool], []),
    configLog: IDL.Func([IDL.Nat], [PhaseConfig__1], ['query']),
    create: IDL.Func(
      [IDL.Principal, IDL.Nat],
      [
        IDL.Variant({
          result: IDL.Tuple(IDL.Opt(IDL.Nat), TxnResult),
          retry: IDL.Nat
        })
      ],
      []
    ),
    cwTaskCompleted: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    cwTaskMining: IDL.Func([], [IDL.Bool], []),
    cyclesWithdraw: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    delErrors: IDL.Func(
      [IDL.Nat, IDL.Nat, IDL.Principal, IDL.Opt(IDL.Nat)],
      [IDL.Bool],
      []
    ),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    enableWhitelist: IDL.Func([IDL.Bool], [], []),
    getErrors: IDL.Func([], [IDL.Vec(ErrorItem)], ['query']),
    getMemory: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], ['query']),
    getTaskTotalMinted: IDL.Func([], [IDL.Nat, IDL.Nat], ['query']),
    history: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Opt(RoundStatus__1)], ['query']),
    investor: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    isPaused: IDL.Func([], [IDL.Bool], ['query']),
    mint: IDL.Func([IDL.Principal], [IDL.Bool], []),
    phaseConfig: IDL.Func([IDL.Nat, PhaseConfig__1], [IDL.Bool], []),
    run: IDL.Func([IDL.Nat, Status__1], [IDL.Bool], []),
    setPause: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setStakingCanister: IDL.Func([IDL.Text], [IDL.Bool], []),
    setTaskTotalSupply: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setWhitelist: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    settle: IDL.Func([], [IDL.Bool], []),
    stake: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Nat], []),
    staked: IDL.Func(
      [IDL.Principal],
      [IDL.Record({ staked: IDL.Nat, lastStakedTime: Time })],
      ['query']
    ),
    status: IDL.Func([], [MiningStatusResponse], ['query']),
    taskMining: IDL.Func([IDL.Vec(IDL.Principal), IDL.Nat], [IDL.Nat], []),
    timer_tick: IDL.Func([], [], []),
    tm_NFTBalance: IDL.Func(
      [Address],
      [IDL.Vec(IDL.Tuple(User, TokenIdentifier, Balance))],
      ['query']
    ),
    tm_NFTWithdraw: IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8))], [], []),
    tm_NFTs: IDL.Func(
      [],
      [IDL.Vec(IDL.Vec(IDL.Tuple(User, TokenIdentifier, Balance)))],
      ['query']
    ),
    tm_claim: IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8))], [IDL.Opt(IDL.Nat)], []),
    tm_init: IDL.Func([TradingMining], [], []),
    tm_register: IDL.Func(
      [TokenIdentifier, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Bool],
      []
    ),
    tm_register2: IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8))], [IDL.Bool], []),
    tm_setting: IDL.Func([], [TradingMining], ['query']),
    tm_status: IDL.Func(
      [Address],
      [
        IDL.Opt(
          IDL.Tuple(
            IDL.Nat,
            IDL.Nat,
            IDL.Nat,
            IDL.Variant({
              Error: IDL.Null,
              Active: IDL.Null,
              Finished: IDL.Null
            })
          )
        ),
        IDL.Bool
      ],
      ['query']
    ),
    tokenTransferNotification: IDL.Func(
      [TokenIdentifier, User, Balance, Memo],
      [IDL.Opt(IDL.Nat)],
      []
    ),
    updateStatus: IDL.Func([], [IDL.Bool], []),
    userHistory: IDL.Func(
      [IDL.Principal, IDL.Nat, IDL.Nat],
      [IDL.Opt(RoundUserStatus)],
      ['query']
    ),
    wallet_receive: IDL.Func([], [], []),
    whitelistOn: IDL.Func([], [IDL.Bool], ['query'])
  });
};
