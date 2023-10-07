export interface TransactionsResponse {
  total_count: number;
  transactions: Array<Transactions>;
}
export interface Transactions {
  block_identifier: blockIdentifier;
  transaction: Transaction;
}
export interface blockIdentifier {
  hash: string;
  index: number;
}
export interface Transaction {
  metadata: Metadata;
  operations: Operations[];
  transaction_identifier: TransactionIdentifier;
}
export interface Metadata {
  block_height: number;
  memo: bigint;
  timestamp: bigint;
}
export interface TransactionIdentifier {
  hash: string;
}
export interface Operations {
  account: {
    address: string;
  };
  amount: Amount;
  operation_identifier: { index: number };
  status: string;
  type: string;
}
export interface Amount {
  currency: {
    decimals: number;
    symbol: string;
  };
  value: string;
}
