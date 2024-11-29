export default ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const BackupRequest = IDL.Variant({
    sendingBTC: IDL.Null,
    accountUtxos: IDL.Null,
    icEvents: IDL.Null,
    icAccountEvents: IDL.Null,
    kyt_txAccounts: IDL.Null,
    cyclesMonitor: IDL.Null,
    kyt_accountAddresses: IDL.Null,
    kyt_addressAccounts: IDL.Null,
    otherData: IDL.Null,
    minterUtxos: IDL.Null,
    icrc1WasmHistory: IDL.Null,
    retrieveBTC: IDL.Null
  });
  const TxIndex__2 = IDL.Nat;
  const RetrieveBtcStatus = IDL.Variant({
    Signing: IDL.Null,
    Confirmed: IDL.Record({ txid: IDL.Vec(IDL.Nat8) }),
    Sending: IDL.Record({ txid: IDL.Vec(IDL.Nat8) }),
    AmountTooLow: IDL.Null,
    Unknown: IDL.Null,
    Submitted: IDL.Record({ txid: IDL.Vec(IDL.Nat8) }),
    Pending: IDL.Null
  });
  const Opcode = IDL.Variant({
    OP_NUMEQUALVERIFY: IDL.Null,
    OP_RIGHT: IDL.Null,
    OP_CODESEPARATOR: IDL.Null,
    OP_LESSTHANOREQUAL: IDL.Null,
    OP_CHECKMULTISIGVERIFY: IDL.Null,
    OP_EQUALVERIFY: IDL.Null,
    OP_NUMEQUAL: IDL.Null,
    OP_FALSE: IDL.Null,
    OP_INVALIDOPCODE: IDL.Null,
    OP_RETURN: IDL.Null,
    OP_HASH160: IDL.Null,
    OP_HASH256: IDL.Null,
    OP_CHECKSIG: IDL.Null,
    OP_RSHIFT: IDL.Null,
    OP_FROMALTSTACK: IDL.Null,
    OP_0: IDL.Null,
    OP_1: IDL.Null,
    OP_2: IDL.Null,
    OP_3: IDL.Null,
    OP_4: IDL.Null,
    OP_5: IDL.Null,
    OP_6: IDL.Null,
    OP_7: IDL.Null,
    OP_8: IDL.Null,
    OP_9: IDL.Null,
    OP_SHA256: IDL.Null,
    OP_0NOTEQUAL: IDL.Null,
    OP_CHECKSEQUENCEVERIFY: IDL.Null,
    OP_VERIF: IDL.Null,
    OP_RESERVED1: IDL.Null,
    OP_RESERVED2: IDL.Null,
    OP_GREATERTHANOREQUAL: IDL.Null,
    OP_PUSHDATA1: IDL.Null,
    OP_PUSHDATA2: IDL.Null,
    OP_PUSHDATA4: IDL.Null,
    OP_CHECKLOCKTIMEVERIFY: IDL.Null,
    OP_WITHIN: IDL.Null,
    OP_VERNOTIF: IDL.Null,
    OP_BOOLAND: IDL.Null,
    OP_BOOLOR: IDL.Null,
    OP_CHECKSIGADD: IDL.Null,
    OP_NEGATE: IDL.Null,
    OP_LESSTHAN: IDL.Null,
    OP_1NEGATE: IDL.Null,
    OP_TOALTSTACK: IDL.Null,
    OP_ENDIF: IDL.Null,
    OP_EQUAL: IDL.Null,
    OP_2DROP: IDL.Null,
    OP_NUMNOTEQUAL: IDL.Null,
    OP_2OVER: IDL.Null,
    OP_2SWAP: IDL.Null,
    OP_1ADD: IDL.Null,
    OP_1SUB: IDL.Null,
    OP_2DIV: IDL.Null,
    OP_2DUP: IDL.Null,
    OP_2MUL: IDL.Null,
    OP_2ROT: IDL.Null,
    OP_GREATERTHAN: IDL.Null,
    OP_3DUP: IDL.Null,
    OP_10: IDL.Null,
    OP_11: IDL.Null,
    OP_12: IDL.Null,
    OP_13: IDL.Null,
    OP_14: IDL.Null,
    OP_15: IDL.Null,
    OP_16: IDL.Null,
    OP_IF: IDL.Null,
    OP_OR: IDL.Null,
    OP_DROP: IDL.Null,
    OP_ELSE: IDL.Null,
    OP_SUBSTR: IDL.Null,
    OP_LEFT: IDL.Null,
    OP_NOP1: IDL.Null,
    OP_NOP2: IDL.Null,
    OP_NOP3: IDL.Null,
    OP_NOP4: IDL.Null,
    OP_NOP5: IDL.Null,
    OP_NOP6: IDL.Null,
    OP_NOP7: IDL.Null,
    OP_NOP8: IDL.Null,
    OP_NOP9: IDL.Null,
    OP_INVERT: IDL.Null,
    OP_OVER: IDL.Null,
    OP_PICK: IDL.Null,
    OP_VERIFY: IDL.Null,
    OP_ROLL: IDL.Null,
    OP_SHA1: IDL.Null,
    OP_SIZE: IDL.Null,
    OP_SWAP: IDL.Null,
    OP_TRUE: IDL.Null,
    OP_TUCK: IDL.Null,
    OP_NOP10: IDL.Null,
    OP_NOTIF: IDL.Null,
    OP_LSHIFT: IDL.Null,
    OP_RESERVED: IDL.Null,
    OP_CHECKMULTISIG: IDL.Null,
    OP_IFDUP: IDL.Null,
    OP_CHECKSIGVERIFY: IDL.Null,
    OP_RIPEMD160: IDL.Null,
    OP_ABS: IDL.Null,
    OP_ADD: IDL.Null,
    OP_AND: IDL.Null,
    OP_CAT: IDL.Null,
    OP_DIV: IDL.Null,
    OP_DUP: IDL.Null,
    OP_MAX: IDL.Null,
    OP_MIN: IDL.Null,
    OP_MOD: IDL.Null,
    OP_MUL: IDL.Null,
    OP_NIP: IDL.Null,
    OP_NOP: IDL.Null,
    OP_NOT: IDL.Null,
    OP_ROT: IDL.Null,
    OP_SUB: IDL.Null,
    OP_VER: IDL.Null,
    OP_XOR: IDL.Null,
    OP_DEPTH: IDL.Null
  });
  const Instruction = IDL.Variant({
    opcode: Opcode,
    data: IDL.Vec(IDL.Nat8)
  });
  const Script = IDL.Vec(Instruction);
  const Address__1 = IDL.Text;
  const PubKey__1 = IDL.Vec(IDL.Nat8);
  const DerivationPath__1 = IDL.Vec(IDL.Vec(IDL.Nat8));
  const Satoshi = IDL.Nat64;
  const OutPoint = IDL.Record({
    txid: IDL.Vec(IDL.Nat8),
    vout: IDL.Nat32
  });
  const ICUtxo = IDL.Record({
    height: IDL.Nat32,
    value: Satoshi,
    outpoint: OutPoint
  });
  const VaultUtxo = IDL.Tuple(Address__1, PubKey__1, DerivationPath__1, ICUtxo);
  const SendingBtcStatus = IDL.Record({
    fee: IDL.Nat64,
    status: RetrieveBtcStatus,
    toids: IDL.Vec(IDL.Nat),
    scriptSigs: IDL.Vec(Script),
    signedTx: IDL.Opt(IDL.Vec(IDL.Nat8)),
    totalAmount: IDL.Nat64,
    destinations: IDL.Vec(IDL.Tuple(IDL.Nat64, Address__1, IDL.Nat64)),
    utxos: IDL.Vec(VaultUtxo)
  });
  const Address__2 = IDL.Text;
  const PubKey__2 = IDL.Vec(IDL.Nat8);
  const DerivationPath__2 = IDL.Vec(IDL.Vec(IDL.Nat8));
  const Utxo__1 = IDL.Record({
    height: IDL.Nat32,
    value: Satoshi,
    outpoint: OutPoint
  });
  const BlockHeight = IDL.Nat;
  const Account__1 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const Utxo__2 = IDL.Record({
    height: IDL.Nat32,
    value: IDL.Nat64,
    outpoint: IDL.Record({ txid: IDL.Vec(IDL.Nat8), vout: IDL.Nat32 })
  });
  const TxIndex__1 = IDL.Nat;
  const InitArgs = IDL.Record({
    fixed_fee: IDL.Nat,
    retrieve_btc_min_amount: IDL.Nat64,
    dex_pair: IDL.Opt(IDL.Principal),
    min_confirmations: IDL.Opt(IDL.Nat32)
  });
  const Event = IDL.Variant({
    received_utxos: IDL.Record({
      deposit_address: IDL.Text,
      total_fee: IDL.Nat,
      to_account: Account__1,
      utxos: IDL.Vec(Utxo__2),
      amount: IDL.Nat
    }),
    sent_transaction: IDL.Record({
      change_output: IDL.Opt(IDL.Record({ value: IDL.Nat64, vout: IDL.Nat32 })),
      txid: IDL.Text,
      address: IDL.Text,
      account: Account__1,
      utxos: IDL.Vec(Utxo__2),
      requests: IDL.Vec(IDL.Nat64),
      retrieveAccount: Account__1
    }),
    burn: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      address: IDL.Text,
      account: Account__1,
      amount: IDL.Nat,
      tokenBlockIndex: IDL.Nat
    }),
    mint: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      address: IDL.Text,
      account: Account__1,
      amount: IDL.Nat
    }),
    send: IDL.Record({
      to: Account__1,
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      amount: IDL.Nat
    }),
    changeOwner: IDL.Record({ newOwner: IDL.Principal }),
    accepted_retrieve_btc_request: IDL.Record({
      txi: TxIndex__1,
      icrc1_burned_txid: IDL.Nat,
      total_fee: IDL.Nat,
      address: IDL.Text,
      account: Account__1,
      amount: IDL.Nat64
    }),
    start: IDL.Record({ message: IDL.Opt(IDL.Text) }),
    initOrUpgrade: IDL.Record({ initArgs: InitArgs }),
    config: IDL.Record({
      setting: IDL.Variant({
        upgradeTokenWasm: IDL.Record({
          icTokenCanisterId: IDL.Principal,
          version: IDL.Text,
          symbol: IDL.Text
        }),
        setTokenWasm: IDL.Record({ size: IDL.Nat, version: IDL.Text })
      })
    }),
    suspend: IDL.Record({ message: IDL.Opt(IDL.Text) })
  });
  const Timestamp = IDL.Nat;
  const AccountId = IDL.Vec(IDL.Nat8);
  const HashId = IDL.Vec(IDL.Nat8);
  const Chain = IDL.Text;
  const TokenId = IDL.Vec(IDL.Nat8);
  const ChainAccount = IDL.Tuple(Chain, TokenId, Address__2);
  const TokenCanisterId = IDL.Principal;
  const Account__2 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const ICAccount = IDL.Tuple(TokenCanisterId, Account__2);
  const ICUtxo__1 = IDL.Record({
    height: IDL.Nat32,
    value: Satoshi,
    outpoint: OutPoint
  });
  const VaultUtxo__1 = IDL.Tuple(
    Address__2,
    PubKey__2,
    DerivationPath__2,
    ICUtxo__1
  );
  const EventBlockHeight__1 = IDL.Nat;
  const RetrieveStatus = IDL.Record({
    txIndex: IDL.Nat,
    account: Account__1,
    btcAddress: Address__1,
    burnedBlockIndex: IDL.Nat,
    amount: IDL.Nat64,
    retrieveAccount: Account__1
  });
  const BackupResponse = IDL.Variant({
    sendingBTC: IDL.Vec(IDL.Tuple(TxIndex__2, SendingBtcStatus)),
    accountUtxos: IDL.Vec(
      IDL.Tuple(
        Address__2,
        IDL.Tuple(PubKey__2, DerivationPath__2, IDL.Vec(Utxo__1))
      )
    ),
    icEvents: IDL.Vec(IDL.Tuple(BlockHeight, IDL.Tuple(Event, Timestamp))),
    icAccountEvents: IDL.Vec(IDL.Tuple(AccountId, IDL.Vec(BlockHeight))),
    kyt_txAccounts: IDL.Vec(
      IDL.Tuple(HashId, IDL.Vec(IDL.Tuple(ChainAccount, ICAccount)))
    ),
    cyclesMonitor: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
    kyt_accountAddresses: IDL.Vec(IDL.Tuple(AccountId, IDL.Vec(ChainAccount))),
    kyt_addressAccounts: IDL.Vec(IDL.Tuple(Address__2, IDL.Vec(ICAccount))),
    otherData: IDL.Record({
      txInProcess: IDL.Vec(TxIndex__2),
      totalBtcFee: IDL.Nat64,
      minterRemainingBalance: IDL.Nat64,
      txIndex: TxIndex__2,
      totalBtcSent: IDL.Nat64,
      eventBlockIndex: IDL.Nat,
      firstTxIndex: TxIndex__2,
      feeBalance: IDL.Nat64,
      totalBtcReceiving: IDL.Nat64,
      firstBlockIndex: IDL.Nat,
      ictc_admins: IDL.Vec(IDL.Principal)
    }),
    minterUtxos: IDL.Tuple(IDL.Vec(VaultUtxo__1), IDL.Vec(VaultUtxo__1)),
    icrc1WasmHistory: IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Text)),
    retrieveBTC: IDL.Vec(IDL.Tuple(EventBlockHeight__1, RetrieveStatus))
  });
  const EventBlockHeight = IDL.Nat;
  const TxIndex = IDL.Nat;
  const Address = IDL.Text;
  const Page = IDL.Vec(IDL.Nat8);
  const BlockHash = IDL.Vec(IDL.Nat8);
  const GetUtxosResponse = IDL.Record({
    next_page: IDL.Opt(Page),
    tip_height: IDL.Nat32,
    tip_block_hash: BlockHash,
    utxos: IDL.Vec(Utxo__1)
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
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const Event__1 = IDL.Variant({
    received_utxos: IDL.Record({
      deposit_address: IDL.Text,
      total_fee: IDL.Nat,
      to_account: Account__1,
      utxos: IDL.Vec(Utxo__2),
      amount: IDL.Nat
    }),
    sent_transaction: IDL.Record({
      change_output: IDL.Opt(IDL.Record({ value: IDL.Nat64, vout: IDL.Nat32 })),
      txid: IDL.Text,
      address: IDL.Text,
      account: Account__1,
      utxos: IDL.Vec(Utxo__2),
      requests: IDL.Vec(IDL.Nat64),
      retrieveAccount: Account__1
    }),
    burn: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      address: IDL.Text,
      account: Account__1,
      amount: IDL.Nat,
      tokenBlockIndex: IDL.Nat
    }),
    mint: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      address: IDL.Text,
      account: Account__1,
      amount: IDL.Nat
    }),
    send: IDL.Record({
      to: Account__1,
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      amount: IDL.Nat
    }),
    changeOwner: IDL.Record({ newOwner: IDL.Principal }),
    accepted_retrieve_btc_request: IDL.Record({
      txi: TxIndex__1,
      icrc1_burned_txid: IDL.Nat,
      total_fee: IDL.Nat,
      address: IDL.Text,
      account: Account__1,
      amount: IDL.Nat64
    }),
    start: IDL.Record({ message: IDL.Opt(IDL.Text) }),
    initOrUpgrade: IDL.Record({ initArgs: InitArgs }),
    config: IDL.Record({
      setting: IDL.Variant({
        upgradeTokenWasm: IDL.Record({
          icTokenCanisterId: IDL.Principal,
          version: IDL.Text,
          symbol: IDL.Text
        }),
        setTokenWasm: IDL.Record({ size: IDL.Nat, version: IDL.Text })
      })
    }),
    suspend: IDL.Record({ message: IDL.Opt(IDL.Text) })
  });
  const Timestamp__2 = IDL.Nat;
  const Address__3 = IDL.Text;
  const TokenCanisterId__1 = IDL.Principal;
  const Account__4 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const ICAccount__1 = IDL.Tuple(TokenCanisterId__1, Account__4);
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Chain__1 = IDL.Text;
  const TokenId__1 = IDL.Vec(IDL.Nat8);
  const ChainAccount__1 = IDL.Tuple(Chain__1, TokenId__1, Address__3);
  const TxHash = IDL.Text;
  const Timestamp__3 = IDL.Nat;
  const TokenInfo = IDL.Record({
    decimals: IDL.Nat8,
    dexPrice: IDL.Opt(IDL.Tuple(IDL.Float64, Timestamp__3)),
    minAmount: IDL.Nat,
    fixedFee: IDL.Nat,
    totalSupply: IDL.Opt(IDL.Nat),
    ckLedgerId: IDL.Principal,
    ckSymbol: IDL.Text,
    dexPair: IDL.Opt(IDL.Principal),
    symbol: IDL.Text
  });
  const ListPage = IDL.Nat;
  const ListSize = IDL.Nat;
  const TrieList_2 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(
      IDL.Tuple(EventBlockHeight, IDL.Tuple(Event__1, Timestamp__2))
    ),
    totalPage: IDL.Nat
  });
  const Network = IDL.Variant({
    Mainnet: IDL.Null,
    Regtest: IDL.Null,
    Testnet: IDL.Null
  });
  const Toid = IDL.Nat;
  const Ttid = IDL.Nat;
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account__3 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount)
  });
  const Timestamp__1 = IDL.Nat64;
  const TransferArgs = IDL.Record({
    to: Account__3,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(Subaccount),
    created_at_time: IDL.Opt(Timestamp__1),
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
  const CustomCallType = IDL.Variant({
    sendTx: IDL.Tuple(IDL.Nat, IDL.Vec(IDL.Nat8)),
    buildTx: IDL.Nat
  });
  const To = IDL.Text;
  const Amount = IDL.Nat;
  const Nonce = IDL.Nat;
  const Sa__1 = IDL.Vec(IDL.Nat8);
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
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_approve: IDL.Tuple(
        Spender,
        Amount,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_transferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_dropAccount: IDL.Opt(Sa__1),
      drc20_lockTransfer: IDL.Tuple(
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_transfer: IDL.Tuple(
        To,
        Amount,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_executeTransfer: IDL.Tuple(
        BlobFill,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      )
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
  const Time = IDL.Int;
  const Toid__1 = IDL.Nat;
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
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_approve: IDL.Tuple(
        Spender,
        Amount,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_transferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_lockTransferFrom: IDL.Tuple(
        From,
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_dropAccount: IDL.Opt(Sa__1),
      drc20_lockTransfer: IDL.Tuple(
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_transfer: IDL.Tuple(
        To,
        Amount,
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      ),
      drc20_executeTransfer: IDL.Tuple(
        BlobFill,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce),
        IDL.Opt(Sa__1),
        IDL.Opt(Data)
      )
    }),
    __skip: IDL.Null
  });
  const Attempts = IDL.Nat;
  const Callee = IDL.Principal;
  const Compensation = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid__1),
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
    time: Time,
    toid: IDL.Opt(Toid__1),
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
  const TrieList_1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(EventBlockHeight, RetrieveStatus)),
    totalPage: IDL.Nat
  });
  const RetrieveBtcArgs = IDL.Record({
    address: IDL.Text,
    amount: IDL.Nat64
  });
  const Sa = IDL.Vec(IDL.Nat8);
  const RetrieveBtcOk = IDL.Record({ block_index: IDL.Nat64 });
  const RetrieveBtcError = IDL.Variant({
    MalformedAddress: IDL.Text,
    GenericError: IDL.Record({
      error_message: IDL.Text,
      error_code: IDL.Nat64
    }),
    TemporarilyUnavailable: IDL.Text,
    AlreadyProcessing: IDL.Null,
    AmountTooLow: IDL.Nat64,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat64 })
  });
  const TrieList = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(TxIndex, SendingBtcStatus)),
    totalPage: IDL.Nat
  });
  const BalanceStats = IDL.Record({
    feeBalance: IDL.Nat,
    totalSupply: IDL.Nat,
    minterBalance: IDL.Nat,
    nativeBalance: IDL.Nat
  });
  const UpdateBalanceResult = IDL.Record({
    block_index: IDL.Nat64,
    amount: IDL.Nat64
  });
  const UpdateBalanceError = IDL.Variant({
    GenericError: IDL.Record({
      error_message: IDL.Text,
      error_code: IDL.Nat64
    }),
    TemporarilyUnavailable: IDL.Text,
    AlreadyProcessing: IDL.Null,
    NoNewUtxos: IDL.Null
  });
  const PubKey = IDL.Vec(IDL.Nat8);
  const DerivationPath = IDL.Vec(IDL.Vec(IDL.Nat8));
  const Utxo = IDL.Record({
    height: IDL.Nat32,
    value: Satoshi,
    outpoint: OutPoint
  });
  return IDL.Service({
    allocateRewards: IDL.Func([Account, IDL.Nat, IDL.Bool], [IDL.Bool], []),
    backup: IDL.Func([BackupRequest], [BackupResponse], []),
    batch_send: IDL.Func([IDL.Opt(IDL.Nat)], [IDL.Bool], []),
    capacity: IDL.Func(
      [],
      [
        IDL.Record({
          icEventsSize: IDL.Nat,
          kytTxAccountsSize: IDL.Nat,
          sendingBTCSize: IDL.Nat,
          kytAccountAddressesSize: IDL.Nat,
          icAccountEventsSize: IDL.Nat,
          accountUtxosSize: IDL.Nat,
          kytAddressAccountsSize: IDL.Nat,
          retrieveBTCSize: IDL.Nat,
          latestVisitTimeSize: IDL.Nat,
          accountAddressesSize: IDL.Nat,
          cyclesMonitorSize: IDL.Nat,
          memorySize: IDL.Nat,
          depositUpdatingSize: IDL.Nat
        })
      ],
      ['query']
    ),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    clearEvents: IDL.Func([EventBlockHeight, EventBlockHeight], [], []),
    clearSendingTxs: IDL.Func([TxIndex, TxIndex], [], []),
    debug_charge_address: IDL.Func([], [IDL.Text], []),
    debug_get_btc_fee: IDL.Func([], [IDL.Vec(IDL.Nat64)], []),
    debug_get_utxos: IDL.Func([Address], [GetUtxosResponse], []),
    debug_reSendBTC: IDL.Func([IDL.Nat, IDL.Nat], [], []),
    debug_reconciliation: IDL.Func([], [], []),
    debug_sendingBTC: IDL.Func(
      [IDL.Opt(IDL.Nat)],
      [IDL.Opt(IDL.Text)],
      ['query']
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
      [IDL.Vec(IDL.Tuple(Event__1, Timestamp__2))],
      ['query']
    ),
    get_btc_address: IDL.Func([Account], [IDL.Text], []),
    get_cached_account: IDL.Func(
      [Address__3],
      [IDL.Opt(IDL.Vec(ICAccount__1))],
      ['query']
    ),
    get_cached_address: IDL.Func(
      [AccountId__1],
      [IDL.Opt(IDL.Vec(ChainAccount__1))],
      ['query']
    ),
    get_cached_tx_account: IDL.Func(
      [TxHash],
      [IDL.Opt(IDL.Vec(IDL.Tuple(ChainAccount__1, ICAccount__1)))],
      ['query']
    ),
    get_ck_tokens: IDL.Func([], [IDL.Vec(TokenInfo)], ['query']),
    get_event: IDL.Func(
      [EventBlockHeight],
      [IDL.Opt(IDL.Tuple(Event__1, Timestamp__2))],
      ['query']
    ),
    get_event_count: IDL.Func([], [IDL.Nat], ['query']),
    get_event_first_index: IDL.Func([], [EventBlockHeight], ['query']),
    get_events: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList_2],
      ['query']
    ),
    get_minter_info: IDL.Func(
      [],
      [
        IDL.Record({
          btcFee: IDL.Nat64,
          minVisitInterval: IDL.Nat,
          btcRetrieveFee: IDL.Nat64,
          btcMintFee: IDL.Nat64,
          btcNetwork: Network,
          icBTCFee: IDL.Nat,
          version: IDL.Text,
          icBTC: IDL.Principal,
          btcMinAmount: IDL.Nat64,
          minter_address: Address,
          enDebug: IDL.Bool,
          minConfirmations: IDL.Nat32,
          paused: IDL.Bool
        })
      ],
      ['query']
    ),
    get_withdrawal_account: IDL.Func([Account], [Account__1], ['query']),
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
    launchToken: IDL.Func(
      [
        IDL.Record({
          totalSupply: IDL.Opt(IDL.Nat),
          ckTokenName: IDL.Text,
          ckTokenFee: IDL.Nat,
          ckTokenDecimals: IDL.Nat8,
          ckTokenSymbol: IDL.Text
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
    recovery: IDL.Func([BackupResponse], [IDL.Bool], []),
    retrieval_log: IDL.Func(
      [IDL.Opt(IDL.Nat64)],
      [IDL.Opt(RetrieveStatus)],
      ['query']
    ),
    retrieval_log_list: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList_1],
      ['query']
    ),
    retrieve_btc: IDL.Func(
      [RetrieveBtcArgs, IDL.Opt(Sa)],
      [IDL.Variant({ Ok: RetrieveBtcOk, Err: RetrieveBtcError })],
      []
    ),
    retrieve_btc_status: IDL.Func(
      [IDL.Record({ block_index: IDL.Nat64 })],
      [RetrieveBtcStatus],
      ['query']
    ),
    sending_log: IDL.Func(
      [IDL.Opt(IDL.Nat)],
      [IDL.Opt(SendingBtcStatus)],
      ['query']
    ),
    sending_log_list: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList],
      ['query']
    ),
    setCkTokenWasm: IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [], []),
    setPause: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setTokenLogo: IDL.Func([IDL.Principal, IDL.Text], [IDL.Bool], []),
    stats: IDL.Func(
      [],
      [
        IDL.Record({
          totalBtcFee: IDL.Nat64,
          countRejections: IDL.Nat,
          txIndex: IDL.Nat,
          totalBtcSent: IDL.Nat64,
          feeBalance: IDL.Nat64,
          totalBtcReceiving: IDL.Nat64,
          blockIndex: IDL.Nat64,
          vaultRemainingBalance: IDL.Nat64,
          countAsyncMessage: IDL.Nat
        })
      ],
      ['query']
    ),
    timerStart: IDL.Func([IDL.Nat], [], []),
    timerStop: IDL.Func([], [], []),
    updateMinterBalance: IDL.Func(
      [IDL.Bool],
      [
        IDL.Record({
          pre: BalanceStats,
          post: BalanceStats,
          shortfall: IDL.Nat
        })
      ],
      []
    ),
    update_balance: IDL.Func(
      [Account],
      [
        IDL.Variant({
          Ok: UpdateBalanceResult,
          Err: UpdateBalanceError
        })
      ],
      []
    ),
    upgradeToken: IDL.Func([IDL.Principal, IDL.Text], [IDL.Text], []),
    utxos: IDL.Func(
      [Address],
      [IDL.Opt(IDL.Tuple(PubKey, DerivationPath, IDL.Vec(Utxo)))],
      ['query']
    ),
    vaultUtxos: IDL.Func(
      [],
      [IDL.Nat64, IDL.Vec(IDL.Tuple(Address, PubKey, DerivationPath, Utxo))],
      ['query']
    ),
    wallet_receive: IDL.Func([], [], [])
  });
};
