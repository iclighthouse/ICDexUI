export default ({ IDL }) => {
  const DappCategory__1 = IDL.Variant({
    NFT: IDL.Null,
    Orderbook: IDL.Null,
    Swap: IDL.Null,
    Stable: IDL.Null
  });
  const CanisterSettings = IDL.Record({
    controller: IDL.Opt(IDL.Principal),
    freezing_threshold: IDL.Opt(IDL.Nat),
    controllers: IDL.Opt(IDL.Vec(IDL.Principal)),
    memory_allocation: IDL.Opt(IDL.Nat),
    compute_allocation: IDL.Opt(IDL.Nat)
  });
  const CreateCanisterArgs = IDL.Record({
    cycles: IDL.Nat64,
    settings: CanisterSettings
  });
  const CreateCyclesWalletArgs = IDL.Record({
    createCanisterArgs: CreateCanisterArgs,
    txid: IDL.Vec(IDL.Nat8),
    nonce: IDL.Nat
  });
  const WalletResultCreate = IDL.Variant({
    Ok: IDL.Record({ canister_id: IDL.Principal }),
    Err: IDL.Text
  });
  const AddressBookItem = IDL.Record({
    address: IDL.Text,
    encrypt: IDL.Text
  });
  const DappCategory = IDL.Variant({
    NFT: IDL.Null,
    Orderbook: IDL.Null,
    Swap: IDL.Null,
    Stable: IDL.Null
  });
  const DappInfo = IDL.Record({
    dappId: IDL.Nat,
    order: IDL.Nat8,
    logo: IDL.Text,
    name: IDL.Text,
    decommend: IDL.Bool,
    category: DappCategory,
    introduce: IDL.Text,
    route: IDL.Text
  });
  const Message = IDL.Record({
    status: IDL.Variant({ always: IDL.Null, oncetime: IDL.Null }),
    title: IDL.Text,
    content: IDL.Text,
    aliveTime: IDL.Nat64
  });
  const MetaMask = IDL.Record({
    account: IDL.Text,
    mnemonic: IDL.Vec(IDL.Text)
  });
  const TokenItem = IDL.Record({
    decimals: IDL.Nat,
    name: IDL.Text,
    standard: IDL.Text,
    symbol: IDL.Text,
    canisterId: IDL.Principal
  });
  const WalletItem = IDL.Record({
    address: IDL.Vec(IDL.Nat8),
    isDefault: IDL.Bool,
    walletId: IDL.Principal
  });
  const Operation = IDL.Variant({
    add: IDL.Null,
    del: IDL.Null,
    setDefault: IDL.Null
  });
  return IDL.Service({
    addDappInfo: IDL.Func(
      [
        IDL.Text,
        DappCategory__1,
        IDL.Text,
        IDL.Text,
        IDL.Bool,
        IDL.Text,
        IDL.Opt(IDL.Nat8)
      ],
      [IDL.Nat],
      []
    ),
    addFavorites: IDL.Func([IDL.Principal], [], []),
    addMetaMask: IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [], ['oneway']),
    createCyclesWallet: IDL.Func(
      [CreateCyclesWalletArgs],
      [WalletResultCreate],
      []
    ),
    cyclesBalance: IDL.Func([], [IDL.Nat], ['query']),
    deleteDappInfo: IDL.Func([IDL.Nat], [], ['oneway']),
    getAccountName: IDL.Func(
      [IDL.Principal],
      [IDL.Principal, IDL.Opt(IDL.Text)],
      ['query']
    ),
    getAddressBookItems: IDL.Func([], [IDL.Vec(AddressBookItem)], ['query']),
    getAllFavoritesCount: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat32))],
      ['query']
    ),
    getCyclesWallet: IDL.Func([], [IDL.Principal], ['query']),
    getDappsList: IDL.Func([IDL.Bool], [IDL.Vec(DappInfo)], ['query']),
    getFavorites: IDL.Func(
      [IDL.Principal],
      [IDL.Vec(IDL.Principal)],
      ['query']
    ),
    getMessage: IDL.Func([], [Message], ['query']),
    getMetaMask: IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Opt(MetaMask)], ['query']),
    getTokens: IDL.Func([], [IDL.Vec(TokenItem)], ['query']),
    getWalletCount: IDL.Func([], [IDL.Nat], ['query']),
    getWallets: IDL.Func([], [IDL.Vec(WalletItem)], ['query']),
    manageAddressBook: IDL.Func(
      [IDL.Text, IDL.Text, Operation],
      [IDL.Bool],
      []
    ),
    manageToken: IDL.Func(
      [IDL.Principal, IDL.Text, IDL.Text, IDL.Nat, IDL.Text, Operation],
      [IDL.Bool],
      []
    ),
    manageWallet: IDL.Func([IDL.Principal, Operation], [IDL.Bool], []),
    removeFavorites: IDL.Func([IDL.Principal], [IDL.Bool], []),
    updateAccountlName: IDL.Func([IDL.Text], [], []),
    updateFavoritesListOrder: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    updateMessage: IDL.Func([Message], [IDL.Bool], []),
    updateWalletId: IDL.Func([IDL.Principal], [], ['oneway']),
    walletCreatedOf: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    wallet_receive: IDL.Func([], [], ['oneway'])
  });
};
