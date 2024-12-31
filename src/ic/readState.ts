// Read from state to verify data integrity
import { HttpAgent, Certificate, Cbor, LookupResult, LookupStatus } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { PrincipalString } from '@/ic/common/icType';
import { toHexString } from '@/ic/converter';
import { Buffer } from 'buffer';
const encoder = new TextEncoder();
const encode = (arg: string): ArrayBuffer => {
  return new DataView(encoder.encode(arg).buffer).buffer;
};
export const readState = async (
  canisterId: PrincipalString
): Promise<void | {
  controllers: Array<PrincipalString>;
  moduleHash: string;
  did: string
}> => {
  const canisterBuffer = new DataView(
    Principal.from(canisterId).toUint8Array().buffer
  ).buffer;
  const agent = new HttpAgent({ host: 'https://ic0.app' });
  const pathControllers = [
    encode('canister'),
    canisterBuffer,
    encode('controllers')
  ];
  const pathHash = [encode('canister'), canisterBuffer, encode('module_hash')];
  const pathCandid = [
    encode('canister'),
    canisterBuffer,
    encode('metadata'),
    encode('candid:service')
  ];
  let res;
  const paths = [pathControllers, pathHash, pathCandid];
  try {
    res = await agent.readState(canisterId, {
      paths: paths
    });
  } catch (error) {
    console.warn('read_state:', error);
    return {
      controllers: [],
      moduleHash: '-',
      did: ''
    };
  }
  console.log(res);
  // @ts-ignore
  const cert = await Certificate.create({
    certificate: res.certificate,
    rootKey: agent.rootKey,
    canisterId: Principal.from(canisterId)
  });
  console.log(cert);
  let certControllerIds;
  let moduleHash = '-';
  let controllers = [];
  let candid = '';
  try {
    const certControllers = cert.lookup(pathControllers);
    if (certControllers.status !== LookupStatus.Found) {
      return null;
    }
    if (!(certControllers.value instanceof ArrayBuffer)) {
      console.log('Module hash value is not an ArrayBuffer');
      return null;
    }
    controllers = (Cbor.decode(certControllers.value) as Array<Buffer>).map(
      (buf: Buffer) => Principal.fromUint8Array(buf).toText()
    );
  } catch (e) {
    console.log(e);
    controllers = [];
  }
  try {
    const certHash: LookupResult = cert.lookup(pathHash);
    if (certHash.status !== LookupStatus.Found) {
      return null;
    }
    if (!(certHash.value instanceof ArrayBuffer)) {
      console.log('Module hash value is not an ArrayBuffer');
      return null;
    }
    moduleHash = [...new Uint8Array(certHash.value)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    console.log(e);
    moduleHash = '-';
  }
  try {
    const certCandid: LookupResult = cert.lookup(pathCandid);
    if (certCandid.status !== LookupStatus.Found) {
      return null;
    }
    if (!(certCandid.value instanceof ArrayBuffer)) {
      console.log('Module hash value is not an ArrayBuffer');
      return null;
    }
    // console.log(Buffer.from(certCandid).toString('utf-8'));
    candid = Buffer.from(certCandid.value).toString('utf-8');
  } catch (e) {
    console.log(e);
    candid = '';
  }
  console.log(controllers);
  console.log(moduleHash);
  return {
    controllers: controllers,
    moduleHash: moduleHash,
    did: candid
  };
  // const cert: Certificate = new Certificate(res, agent);
  // if (await cert.verify()) {
  //   let certControllerIds;
  //   let moduleHash;
  //   try {
  //     const certControllers = cert.lookup(pathControllers);
  //     certControllerIds = (Cbor.decode(certControllers) as Array<Buffer>).map(
  //       (buf: Buffer) => Principal.fromUint8Array(buf).toText()
  //     );
  //   } catch (e) {
  //     console.log(e);
  //     return {
  //       controllers: [],
  //       moduleHash: '-'
  //     };
  //   }
  //   try {
  //     moduleHash = Buffer.from(cert.lookup(pathModuleHash))?.toString('hex');
  //   } catch (e) {
  //     console.log(e);
  //     return {
  //       controllers: [],
  //       moduleHash: '-'
  //     };
  //   }
  //   return {
  //     controllers: certControllerIds,
  //     moduleHash: moduleHash
  //   };
  // }
};
