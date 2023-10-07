import { IDL } from '@dfinity/candid';
import { Actor, QueryResponseReplied, HttpAgent } from '@dfinity/agent';
const didc = import('@/assets/pkg/didc_js');

export const getCandidInterfaceTmpHack = async (
  canisterId: string
): Promise<{ [key: string]: IDL.FuncClass }> => {
  return new Promise((resolve, reject) => {
    const agent = new HttpAgent({
      host: 'https://ic0.app/',
      identity: null
    });
    agent
      .query(canisterId, {
        methodName: '__get_candid_interface_tmp_hack',
        arg: Buffer.from([68, 73, 68, 76, 0, 0]) // Null
      })
      .then((res) => {
        if ((res as QueryResponseReplied).status) {
          const candid = IDL.decode(
            [IDL.Text],
            Buffer.from((res as QueryResponseReplied).reply.arg)
          )[0] as string;
          didc.then((mod) => {
            const bindings = mod.generate(candid); // Bindings { js: "...", ts: "...", motoko: "..." }
            const did = bindings.js
              .replace(/export default\s+/, 'return ')
              .replace('export', '');
            const actor_ = Actor.createActor(new Function(did)(), {
              agent: agent,
              canisterId: canisterId
            });
            const candidMethods = Actor.interfaceOf(actor_)._fields;
            resolve({ ...Object.fromEntries(candidMethods) });
          });
        }
      });
  });
};
