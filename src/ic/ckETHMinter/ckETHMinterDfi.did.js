export default ({ IDL }) => {
  const BlockTag = IDL.Variant({
    Safe: IDL.Null,
    Finalized: IDL.Null,
    Latest: IDL.Null
  });
  const UpgradeArg = IDL.Record({
    next_transaction_nonce: IDL.Opt(IDL.Nat),
    ethereum_contract_address: IDL.Opt(IDL.Text),
    minimum_withdrawal_amount: IDL.Opt(IDL.Nat),
    ethereum_block_height: IDL.Opt(BlockTag)
  });
  const EthereumNetwork = IDL.Variant({
    Mainnet: IDL.Null,
    Sepolia: IDL.Null
  });
  const InitArg = IDL.Record({
    ethereum_network: EthereumNetwork,
    ecdsa_key_name: IDL.Text,
    next_transaction_nonce: IDL.Nat,
    ledger_id: IDL.Principal,
    ethereum_contract_address: IDL.Opt(IDL.Text),
    minimum_withdrawal_amount: IDL.Nat,
    ethereum_block_height: BlockTag
  });
  const MinterArg = IDL.Variant({
    UpgradeArg: UpgradeArg,
    InitArg: InitArg
  });
  const Eip1559TransactionPrice = IDL.Record({
    max_priority_fee_per_gas: IDL.Nat,
    max_fee_per_gas: IDL.Nat,
    max_transaction_fee: IDL.Nat,
    gas_limit: IDL.Nat
  });
  const CanisterStatusType = IDL.Variant({
    stopped: IDL.Null,
    stopping: IDL.Null,
    running: IDL.Null
  });
  const DefiniteCanisterSettings = IDL.Record({
    freezing_threshold: IDL.Nat,
    controllers: IDL.Vec(IDL.Principal),
    memory_allocation: IDL.Nat,
    compute_allocation: IDL.Nat
  });
  const CanisterStatusResponse = IDL.Record({
    status: CanisterStatusType,
    memory_size: IDL.Nat,
    cycles: IDL.Nat,
    settings: DefiniteCanisterSettings,
    idle_cycles_burned_per_day: IDL.Nat,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const EventSource = IDL.Record({
    transaction_hash: IDL.Text,
    log_index: IDL.Nat
  });
  const Event = IDL.Record({
    timestamp: IDL.Nat64,
    payload: IDL.Variant({
      SentTransaction: IDL.Record({
        transaction_hash: IDL.Text,
        withdrawal_id: IDL.Nat
      }),
      Upgrade: UpgradeArg,
      Init: InitArg,
      SyncedToBlock: IDL.Record({ block_number: IDL.Nat }),
      AcceptedDeposit: IDL.Record({
        principal: IDL.Principal,
        transaction_hash: IDL.Text,
        value: IDL.Nat,
        log_index: IDL.Nat,
        block_number: IDL.Nat,
        from_address: IDL.Text
      }),
      SignedTx: IDL.Record({
        withdrawal_id: IDL.Nat,
        raw_tx: IDL.Text
      }),
      MintedCkEth: IDL.Record({
        event_source: EventSource,
        mint_block_index: IDL.Nat
      }),
      InvalidDeposit: IDL.Record({
        event_source: EventSource,
        reason: IDL.Text
      }),
      AcceptedEthWithdrawalRequest: IDL.Record({
        ledger_burn_index: IDL.Nat,
        destination: IDL.Text,
        withdrawal_amount: IDL.Nat
      }),
      FinalizedTransaction: IDL.Record({
        transaction_hash: IDL.Text,
        withdrawal_id: IDL.Nat
      })
    })
  });
  const RetrieveEthStatus = IDL.Variant({
    TxSigned: IDL.Record({ transaction_hash: IDL.Text }),
    NotFound: IDL.Null,
    TxConfirmed: IDL.Record({ transaction_hash: IDL.Text }),
    TxSent: IDL.Record({ transaction_hash: IDL.Text }),
    TxCreated: IDL.Null,
    Pending: IDL.Null
  });
  const WithdrawalArg = IDL.Record({
    recipient: IDL.Text,
    amount: IDL.Nat
  });
  const RetrieveEthRequest = IDL.Record({ block_index: IDL.Nat });
  const WithdrawalError = IDL.Variant({
    TemporarilyUnavailable: IDL.Text,
    InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
    AmountTooLow: IDL.Record({ min_withdrawal_amount: IDL.Nat }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat })
  });
  return IDL.Service({
    eip_1559_transaction_price: IDL.Func([], [Eip1559TransactionPrice], []),
    get_canister_status: IDL.Func([], [CanisterStatusResponse], []),
    get_events: IDL.Func(
      [IDL.Record({ start: IDL.Nat64, length: IDL.Nat64 })],
      [
        IDL.Record({
          total_event_count: IDL.Nat64,
          events: IDL.Vec(Event)
        })
      ],
      ['query']
    ),
    is_address_blocked: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    minter_address: IDL.Func([], [IDL.Text], []),
    retrieve_eth_status: IDL.Func([IDL.Nat64], [RetrieveEthStatus], []),
    smart_contract_address: IDL.Func([], [IDL.Text], ['query']),
    withdraw_eth: IDL.Func(
      [WithdrawalArg],
      [IDL.Variant({ Ok: RetrieveEthRequest, Err: WithdrawalError })],
      []
    )
  });
};
