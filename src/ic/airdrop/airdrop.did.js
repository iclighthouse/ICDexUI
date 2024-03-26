export default ({ IDL }) => {
  const NftID = IDL.Text;
  const TimestampMS = IDL.Nat;
  return IDL.Service({
    calcuAirdrops: IDL.Func([IDL.Float64, IDL.Nat], [], []),
    checkAirDrop: IDL.Func(
      [IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [
        IDL.Record({
          available: IDL.Nat,
          credit: IDL.Nat,
          message: IDL.Text
        })
      ],
      ['query']
    ),
    checkAirDropWithNft: IDL.Func(
      [NftID],
      [
        IDL.Record({
          available: IDL.Nat,
          credit: IDL.Nat,
          message: IDL.Text
        })
      ],
      []
    ),
    claim: IDL.Func([IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))], [IDL.Nat], []),
    claimLog: IDL.Func(
      [IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [
        IDL.Opt(
          IDL.Record({
            status: IDL.Variant({
              Claiming: IDL.Null,
              Completed: IDL.Null
            }),
            value: IDL.Nat,
            time: TimestampMS
          })
        )
      ],
      ['query']
    ),
    claimWithNft: IDL.Func(
      [NftID, IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Nat],
      []
    ),
    claimWithNftLog: IDL.Func(
      [NftID],
      [
        IDL.Opt(
          IDL.Record({
            to: IDL.Record({
              owner: IDL.Principal,
              subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
            }),
            status: IDL.Variant({
              Claiming: IDL.Null,
              Completed: IDL.Null
            }),
            value: IDL.Nat,
            time: TimestampMS
          })
        )
      ],
      ['query']
    ),
    fetchCS: IDL.Func([], [IDL.Nat, IDL.Nat], []),
    fetchPairs: IDL.Func([], [IDL.Nat], []),
    fetchVols: IDL.Func([], [IDL.Nat], []),
    total: IDL.Func(
      [],
      [
        IDL.Record({
          totalSupplyForCoinSeconds: IDL.Nat,
          totalVol: IDL.Nat,
          totalCoinSeconds: IDL.Nat,
          totalSupplyForVols: IDL.Nat
        })
      ],
      ['query']
    )
  });
};
