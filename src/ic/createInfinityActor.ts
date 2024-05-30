import { IDL } from '@dfinity/candid';
import { canRequest } from '@/ic/ConnectInfinity';
import { LEDGER_CANISTER_ID } from '@/ic/utils';
import ledgerIDL from '@/ic/ledger/ledger.did.js';

const InfinityActor: { [key: string]: any } = {};
// each item will be an actor from to be executed
const requests = {};
const requestsCanisterId = [];

export const createInfinityActor = async <T>(
  IDL: IDL.InterfaceFactory,
  canisterId: string
): Promise<T> => {
  if (InfinityActor && InfinityActor[canisterId]) {
    return InfinityActor[canisterId];
  }
  if (requestsCanisterId.includes(canisterId)) {
    return new Promise((resolve) => {
      if (!requests[canisterId]) {
        requests[canisterId] = [];
      }
      requests[canisterId].push((actor) => {
        resolve(actor);
      });
    });
  } else {
    if (await canRequest(canisterId)) {
      requestsCanisterId.push(canisterId);
      const t = new Date().getTime();
      console.log(canisterId + ': ' + t);
      return (window as any).ic?.infinityWallet.createActor({
        canisterId: canisterId,
        interfaceFactory: IDL
      }).then((res) => {
        console.log(canisterId + ': ' + (new Date().getTime() - t));
        InfinityActor[canisterId] = res;
        if (requests[canisterId] && requests[canisterId].length) {
          requests[canisterId].forEach((m) => m(InfinityActor[canisterId]));
          requestsCanisterId.splice(requestsCanisterId.indexOf(canisterId));
          delete requests[canisterId];
        }
        return InfinityActor[canisterId];
      });
    } else {
      return null;
    }
  }
};

const plugWhitelist = [
  // {
  //   canisterId: IC_MANAGEMENT_CANISTER_ID,
  //   idl: ICManagementIDL
  // },
  {
    canisterId: LEDGER_CANISTER_ID,
    idl: ledgerIDL
  }
  // {
  //   canisterId: GOVERNANCE_CANISTER_ID,
  //   idl: governanceIDL
  // },
  // {
  //   canisterId: IC_CANISTER_ID,
  //   idl: ICLighthouseIDL
  // },
  // {
  //   canisterId: IC_TOKEN_CANISTER_ID,
  //   idl: ICTokenIDL
  // },
  // {
  //   canisterId: IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  //   idl: ICLighthouseTokenIDL
  // },
  // {
  //   canisterId: CYCLES_FINANCE_CANISTER_ID,
  //   idl: cyclesFinanceIDL
  // },
  // {
  //   canisterId: IC_SWAP_ROUTER_CANISTER_ID,
  //   idl: ICSwapRouterIDL
  // },
  // {
  //   canisterId: IC_STABLE_CANISTER_ID,
  //   idl: ICStableIDL
  // },
  // {
  //   canisterId: WICP_CANISTER_ID,
  //   idl: wicpIDL
  // }
  // ,
  // {
  //   canisterId: IC_MINING_CANISTER_ID,
  //   idl: IcMiningIDL
  // }
];
export const createInfinityWhiteActor = async (): Promise<void> => {
  const t = new Date().getTime();
  console.log(t);
  for (let i = 0; i < plugWhitelist.length; i++) {
    await createInfinityActor(
      plugWhitelist[i].idl,
      plugWhitelist[i].canisterId
    );
  }
  // const promiseAll = [];
  // for (let i = 0; i < plugWhitelist.length; i++) {
  //   promiseAll.push(
  //     createPlugActor(plugWhitelist[i].idl, plugWhitelist[i].canisterId)
  //   );
  // }
  // await Promise.all(promiseAll);
  console.log('end: ' + (new Date().getTime() - t));
};
