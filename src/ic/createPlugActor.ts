import { IDL } from '@dfinity/candid';
import { canRequest } from '@/ic/ConnectPlug';
import { Actor } from '@dfinity/agent';
import { LEDGER_CANISTER_ID, WICP_CANISTER_ID } from '@/ic/utils';
import ledgerIDL from '@/ic/ledger/ledger.did.js';
import DRC20IDL from '@/ic/DRC20Token/DRC20Token.did';

const CHAT = '2ouva-viaaa-aaaaq-aaamq-cai';
const SNS1 = 'zfcdd-tqaaa-aaaaq-aaaga-cai';
const KINIC = '73mez-iiaaa-aaaaq-aaasq-cai';
const HOT = '6rdgd-kyaaa-aaaaq-aaavq-cai';
const GHOST = '4c4fd-caaaa-aaaaq-aaa3a-cai';
const MOD = 'xsi2v-cyaaa-aaaaq-aabfq-cai';
const BOOM = 'vtrom-gqaaa-aaaaq-aabia-cai';
const CAT = 'uf2wh-taaaa-aaaaq-aabna-cai';
const ICX = 'rffwt-piaaa-aaaaq-aabqq-cai';
const NUA = 'rxdbk-dyaaa-aaaaq-aabtq-cai';
const SONIC = 'qbizb-wiaaa-aaaaq-aabwq-cai';
const CKBTC = 'mxzaz-hqaaa-aaaar-qaada-cai';
const snsToken = [
  CKBTC,
  CHAT,
  SNS1,
  KINIC,
  HOT,
  GHOST,
  MOD,
  BOOM,
  CAT,
  ICX,
  NUA,
  SONIC
];

const OT = 'imeri-bqaaa-aaaai-qnpla-cai';
const plugActor: { [key: string]: any } = {};
const plugIc = (window as any).ic?.plug;
// each item will be an actor from to be executed
const requests = {};
const requestsCanisterId = [];

export const createPlugActor = async <T>(
  IDL: IDL.InterfaceFactory,
  canisterId: string
): Promise<T> => {
  if (plugActor && plugActor[canisterId]) {
    return plugActor[canisterId];
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
      return plugIc
        .createActor({
          canisterId: canisterId,
          interfaceFactory: IDL
        })
        .then((res) => {
          console.log(canisterId + ': ' + (new Date().getTime() - t));
          plugActor[canisterId] = res;
          if (requests[canisterId] && requests[canisterId].length) {
            requests[canisterId].forEach((m) => m(plugActor[canisterId]));
            requestsCanisterId.splice(requestsCanisterId.indexOf(canisterId));
            delete requests[canisterId];
          }
          return plugActor[canisterId];
        });
    } else {
      return null;
    }
  }
  // if (
  //   canisterId === LEDGER_CANISTER_ID ||
  //   canisterId === WICP_CANISTER_ID ||
  //   canisterId == OT ||
  //   snsToken.includes(canisterId)
  // ) {
  //   if (requestsCanisterId.includes(canisterId)) {
  //     return new Promise((resolve) => {
  //       if (!requests[canisterId]) {
  //         requests[canisterId] = [];
  //       }
  //       requests[canisterId].push((actor) => {
  //         resolve(actor);
  //       });
  //     });
  //   } else {
  //     if (await canRequest(canisterId)) {
  //       requestsCanisterId.push(canisterId);
  //       const t = new Date().getTime();
  //       console.log(canisterId + ': ' + t);
  //       return plugIc
  //         .createActor({
  //           canisterId: canisterId,
  //           interfaceFactory: IDL
  //         })
  //         .then((res) => {
  //           console.log(canisterId + ': ' + (new Date().getTime() - t));
  //           plugActor[canisterId] = res;
  //           if (requests[canisterId] && requests[canisterId].length) {
  //             requests[canisterId].forEach((m) => m(plugActor[canisterId]));
  //             requestsCanisterId.splice(requestsCanisterId.indexOf(canisterId));
  //             delete requests[canisterId];
  //           }
  //           return plugActor[canisterId];
  //         });
  //     } else {
  //       return null;
  //     }
  //   }
  // } else {
  //   plugActor[canisterId] = Actor.createActor(IDL, {
  //     agent: plugIc.agent,
  //     canisterId: canisterId
  //   });
  //   return plugActor[canisterId];
  // }
};

export const hasActor = (canisterId: string): boolean => {
  return !!plugActor[canisterId];
};

const plugWhitelist = [
  // {
  //   canisterId: IC_MANAGEMENT_CANISTER_ID,
  //   idl: ICManagementIDL
  // },
  {
    canisterId: LEDGER_CANISTER_ID,
    idl: ledgerIDL
  },
  // {
  //   canisterId: CHAT,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: SNS1,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: KINIC,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: HOT,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: GHOST,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: MOD,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: BOOM,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: CAT,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: ICX,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: NUA,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: SONIC,
  //   idl: DRC20IDL
  // },
  // {
  //   canisterId: CKBTC,
  //   idl: DRC20IDL
  // }
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
export const createPlugWhiteActor = async (): Promise<void> => {
  const t = new Date().getTime();
  console.log(t);
  for (let i = 0; i < plugWhitelist.length; i++) {
    createPlugActor(plugWhitelist[i].idl, plugWhitelist[i].canisterId);
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
