import { IDL } from '@dfinity/candid';
import { canRequest } from '@/ic/ConnectPlug';
import { LEDGER_CANISTER_ID, WICP_CANISTER_ID } from '@/ic/utils';
import ledgerIDL from '@/ic/ledger/ledger.did.js';

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
};

export const hasActor = (canisterId: string): boolean => {
  return !!plugActor[canisterId];
};

const plugWhitelist = [
  {
    canisterId: LEDGER_CANISTER_ID,
    idl: ledgerIDL
  }
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
