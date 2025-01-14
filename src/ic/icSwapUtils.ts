import { LocalPool, LocalSwapPair, Pool } from '@/views/home/ICSwap/model';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';
const toLocalPool = (pool: Pool): LocalPool => {
  const localSwapPair: LocalSwapPair = {
    feeRate: pool[1][0].feeRate,
    token0: [
      pool[1][0].token0[0].toString(),
      pool[1][0].token0[1],
      pool[1][0].token0[2]
    ],
    token1: [
      pool[1][0].token1[0].toString(),
      pool[1][0].token1[1],
      pool[1][0].token1[2]
    ],
    dexName: pool[1][0].dexName,
    canisterId: pool[1][0].canisterId.toString()
  };
  return [
    pool[0].toString(),
    [localSwapPair, pool[1][1].toString()],
    pool[2],
    pool[3],
    pool[4]
  ];
};
const swapTokenIdToIcpOrCycles = (tokenId: string): string => {
  if (!tokenId) {
    return '';
  }
  if (tokenId === CYCLES_FINANCE_CANISTER_ID) {
    return 'Cycles';
  }
  if (tokenId === LEDGER_CANISTER_ID) {
    return 'ICP';
  }
  return tokenId;
};
const icpOrCyclesToSwapTokenId = (tokenId: string): string => {
  if (!tokenId) {
    return '';
  }
  if (tokenId.toLocaleLowerCase() === 'Cycles'.toLocaleLowerCase()) {
    return CYCLES_FINANCE_CANISTER_ID;
  }
  if (tokenId.toLocaleLowerCase() === 'ICP'.toLocaleLowerCase()) {
    return LEDGER_CANISTER_ID;
  }
  return tokenId;
};
export { toLocalPool, swapTokenIdToIcpOrCycles, icpOrCyclesToSwapTokenId };
