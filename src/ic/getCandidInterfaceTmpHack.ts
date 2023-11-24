import { IDL } from '@dfinity/candid';
import { Actor, QueryResponseReplied, HttpAgent } from '@dfinity/agent';
import { DIDGenerateService } from '@/ic/DIDGenerate/DIDGenerateService';

const didGenerateService = new DIDGenerateService();

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
          didGenerateService.did_to_js(candid).then((res) => {
            if (res && res.length) {
              const did = res[0]
                .replace(/export const idlFactory =\s+/, 'return ')
                .replace('export', '');
              const actor_ = Actor.createActor(new Function(did)(), {
                agent: agent,
                canisterId: canisterId
              });
              const candidMethods = Actor.interfaceOf(actor_)._fields;
              resolve({ ...Object.fromEntries(candidMethods) });
            }
          });
        }
      });
  });
};
