export default ({ IDL }) => {
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
  const AccountId = IDL.Vec(IDL.Nat8);
  const RoundId = IDL.Nat;
  const NFTUser = IDL.Variant({
    principal: IDL.Principal,
    address: IDL.Text
  });
  const NFTID = IDL.Text;
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
  const NFT = IDL.Tuple(NFTUser, NFTID, IDL.Nat, NFTType, CollectionId);
  const ListPage = IDL.Nat;
  const ListSize = IDL.Nat;
  const PairId = IDL.Principal;
  const OammId = IDL.Principal;
  const ShareDecimals = IDL.Nat;
  const Timestamp__1 = IDL.Nat;
  const Price = IDL.Nat;
  const UnitNetValue = IDL.Record({
    ts: Timestamp__1,
    shares: IDL.Nat,
    token0: IDL.Nat,
    token1: IDL.Nat,
    price: Price
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
  const PairCanister = IDL.Principal;
  const PairInfo = IDL.Record({
    name: IDL.Text,
    score: IDL.Nat,
    token0: TokenInfo,
    token1: TokenInfo,
    token1Decimals: IDL.Nat,
    pairCanisterId: PairCanister,
    token0Decimals: IDL.Nat
  });
  const TrieList_1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(PairId, PairInfo)),
    totalPage: IDL.Nat
  });
  const Timestamp = IDL.Nat;
  const TrieList = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Tuple(IDL.Float64, Timestamp))),
    totalPage: IDL.Nat
  });
  const RoundConfig = IDL.Record({
    startTime: Timestamp,
    content: IDL.Text,
    endTime: Timestamp,
    supplyForLM: IDL.Nat,
    supplyForTM: IDL.Nat,
    pairs: IDL.Variant({ all: IDL.Null, whitelist: IDL.Vec(PairId) }),
    pairFilter: IDL.Record({
      blackList: IDL.Vec(PairId),
      minPairScore: IDL.Nat
    }),
    preMiningDataFactorPercent: IDL.Nat
  });
  const RoundDataReponse = IDL.Record({
    status: IDL.Variant({
      Closed: IDL.Null,
      Active: IDL.Null,
      Settling: IDL.Null
    }),
    createdTime: Timestamp,
    config: RoundConfig,
    points: IDL.Record({
      accountPointsForLM: IDL.Vec(IDL.Tuple(AccountId, IDL.Nat)),
      accountPointsForTM: IDL.Vec(IDL.Tuple(AccountId, IDL.Nat)),
      totalPointsForLM: IDL.Nat,
      totalPointsForTM: IDL.Nat,
      pointsUpdatedTime: Timestamp
    }),
    settlement: IDL.Opt(
      IDL.Record({
        lm: IDL.Vec(IDL.Tuple(AccountId, IDL.Nat)),
        tm: IDL.Vec(IDL.Tuple(AccountId, IDL.Nat))
      })
    )
  });
  const ShareWeighted = IDL.Record({
    updateTime: Timestamp__1,
    shareTimeWeighted: IDL.Nat
  });
  const Amount = IDL.Nat;
  const Vol = IDL.Record({ value0: Amount, value1: Amount });
  return IDL.Service({
    changeOwner: IDL.Func([IDL.Principal], [], []),
    claim: IDL.Func(
      [
        IDL.Record({
          owner: IDL.Principal,
          subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
        })
      ],
      [IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text })],
      []
    ),
    debug_close: IDL.Func([], [], []),
    debug_fetchDexOAMMs: IDL.Func([], [], []),
    debug_fetchNftHolders: IDL.Func([], [], []),
    debug_fetchPairs: IDL.Func([], [], []),
    debug_fetchPoints: IDL.Func([IDL.Opt(IDL.Bool)], [], []),
    debug_fetchTokenPrices: IDL.Func([], [], []),
    debug_fetchVipMakers: IDL.Func([], [], []),
    debug_settle: IDL.Func([], [], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    getAccelerationRate: IDL.Func([AccountId], [IDL.Float64], ['query']),
    getAccountData: IDL.Func(
      [IDL.Opt(RoundId), AccountId],
      [
        IDL.Record({
          roundStatus: IDL.Variant({
            Closed: IDL.Null,
            Active: IDL.Null,
            Settling: IDL.Null
          }),
          round: RoundId,
          points: IDL.Record({ lm: IDL.Nat, tm: IDL.Nat }),
          settlement: IDL.Opt(IDL.Record({ lm: IDL.Nat, tm: IDL.Nat }))
        })
      ],
      ['query']
    ),
    getBalance: IDL.Func(
      [AccountId],
      [IDL.Record({ locked: IDL.Nat, available: IDL.Nat })],
      ['query']
    ),
    getNftHolders: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(AccountId, IDL.Vec(NFT)))],
      ['query']
    ),
    getOAMMs: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(PairId, OammId, ShareDecimals, UnitNetValue)),
          page: IDL.Nat,
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    getPairs: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList_1],
      ['query']
    ),
    getPrices: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList],
      ['query']
    ),
    getRound: IDL.Func(
      [IDL.Opt(RoundId)],
      [IDL.Record({ data: IDL.Opt(RoundDataReponse), round: RoundId })],
      ['query']
    ),
    getRoundPointsForLM: IDL.Func(
      [RoundId, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(AccountId, IDL.Nat)),
          page: IDL.Nat,
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    getRoundPointsForTM: IDL.Func(
      [RoundId, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(AccountId, IDL.Nat)),
          page: IDL.Nat,
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    getRoundSettlementsForLM: IDL.Func(
      [RoundId, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(AccountId, IDL.Nat)),
          page: IDL.Nat,
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    getRoundSettlementsForTM: IDL.Func(
      [RoundId, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(AccountId, IDL.Nat)),
          page: IDL.Nat,
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    getTWShareLog: IDL.Func([OammId, AccountId], [ShareWeighted], ['query']),
    getVipMakers: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(PairId, AccountId))],
      ['query']
    ),
    getVolLog: IDL.Func([PairId, AccountId], [Vol], ['query']),
    info: IDL.Func(
      [],
      [
        IDL.Record({
          isFetchingPoints: IDL.Bool,
          timerInterval: Timestamp,
          timerFirstTaskStarted: IDL.Bool,
          timerId: IDL.Nat,
          timerTs: Timestamp,
          roundCount: IDL.Nat
        })
      ],
      ['query']
    ),
    newRound: IDL.Func([RoundConfig], [RoundId], []),
    timerStart: IDL.Func([IDL.Nat], [], []),
    timerStop: IDL.Func([], [], []),
    updateRound: IDL.Func(
      [
        RoundId,
        IDL.Record({
          startTime: IDL.Opt(Timestamp),
          content: IDL.Opt(IDL.Text),
          endTime: IDL.Opt(Timestamp),
          supplyForLM: IDL.Opt(IDL.Nat),
          supplyForTM: IDL.Opt(IDL.Nat),
          pairs: IDL.Opt(
            IDL.Variant({ all: IDL.Null, whitelist: IDL.Vec(PairId) })
          ),
          pairFilter: IDL.Opt(
            IDL.Record({
              blackList: IDL.Vec(PairId),
              minPairScore: IDL.Nat
            })
          ),
          preMiningDataFactorPercent: IDL.Opt(IDL.Nat)
        })
      ],
      [],
      []
    ),
    wallet_receive: IDL.Func([], [], []),
    withdraw_cycles: IDL.Func([IDL.Nat], [], [])
  });
};
