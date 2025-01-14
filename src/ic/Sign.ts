import { Signature } from '@dfinity/agent/lib/cjs/auth';
import { SignIdentity } from '@dfinity/agent';
import { lebEncode } from '@dfinity/candid';
import borc from 'borc';
import { sha256 } from '@noble/hashes/sha256';
import { Principal } from '@dfinity/principal';
import * as cbor from 'simple-cbor';
const domainSeparator = new TextEncoder().encode('\x0Aic-request');
const DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS = 5 * 60 * 1000;
const NANOSECONDS_PER_MILLISECONDS = BigInt(1000000);
const REPLICA_PERMITTED_DRIFT_MILLISECONDS = BigInt(60 * 1000);
export const sign = async (
  identity: SignIdentity,
  blob: ArrayBuffer
): Promise<Signature> => {
  return await identity.sign(blob);
};
export const senderSig = async (
  identity: SignIdentity,
  canisterId: string,
  requestType: 'call' | 'query',
  methodName: string,
  arg: ArrayBuffer // A binary encoded argument.
): Promise<Signature> => {
  const sender = identity.getPrincipal();
  const body = {
    request_type: requestType,
    canister_id: Principal.from(canisterId),
    method_name: methodName,
    arg: arg,
    sender: sender,
    ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS)
  };
  const requestId = await requestIdOf(body);
  return await sign(identity, concat(domainSeparator, requestId));
};
/**
 * Get the RequestId of the provided ic-ref request.
 * RequestId is the result of the representation-independent-hash function.
 * https://sdk.dfinity.org/docs/interface-spec/index.html#hash-of-map
 * @param request - ic-ref request to hash into RequestId
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requestIdOf = (request): ArrayBuffer => {
  const traversed = Object.entries(request)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const hashedKey = hashString(key);
      const hashedValue = hashValue(value);
      return [hashedKey, hashedValue];
    });
  const sorted = traversed.sort(([k1], [k2]) => {
    return compare(k1, k2);
  });
  const concatenated = concat(...sorted.map((x) => concat(...x)));
  return hash(concatenated);
};
export const compare = (b1, b2): number => {
  if (b1.byteLength !== b2.byteLength) {
    return b1.byteLength - b2.byteLength;
  }
  const u1 = new Uint8Array(b1);
  const u2 = new Uint8Array(b2);
  for (let i = 0; i < u1.length; i++) {
    if (u1[i] !== u2[i]) {
      return u1[i] - u2[i];
    }
  }
  return 0;
};
/**
 * sha256 hash the provided Buffer
 * @param data - input to hash function
 */
export const hash = (data): ArrayBuffer => {
  return sha256.create().update(new Uint8Array(data)).digest();
};
/**
 * Concatenate multiple array buffers.
 * @param buffers The buffers to concatenate.
 */
export const concat = (...buffers): ArrayBufferLike => {
  const result = new Uint8Array(
    buffers.reduce((acc, curr) => acc + curr.byteLength, 0)
  );
  let index = 0;
  for (const b of buffers) {
    result.set(new Uint8Array(b), index);
    index += b.byteLength;
  }
  return result.buffer;
};
/**
 *
 * @param value unknown value
 * @returns ArrayBuffer
 */
export const hashValue = (value): ArrayBuffer => {
  if (value instanceof borc.Tagged) {
    return hashValue(value.value);
  } else if (typeof value === 'string') {
    return hashString(value);
  } else if (typeof value === 'number') {
    return hash(lebEncode(value));
  } else if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    return hash(value);
  } else if (Array.isArray(value)) {
    const vals = value.map(hashValue);
    return hash(concat(...vals));
  } else if (value && typeof value === 'object' && value._isPrincipal) {
    return hash(value.toUint8Array());
  } else if (
    typeof value === 'object' &&
    value !== null &&
    typeof value.toHash === 'function'
  ) {
    return hashValue(value.toHash());
    // TODO This should be move to a specific async method as the webauthn flow required
    // the flow to be synchronous to ensure Safari touch id works.
    // } else if (value instanceof Promise) {
    //   return value.then(x => hashValue(x));
  } else if (typeof value === 'bigint') {
    // Do this check much later than the other bigint check because this one is much less
    // type-safe.
    // So we want to try all the high-assurance type guards before this 'probable' one.
    return hash(lebEncode(value));
  }
  throw Object.assign(
    new Error(`Attempt to hash a value of unsupported type: ${value}`),
    {
      // include so logs/callers can understand the confusing value.
      // (when stringified in error message, prototype info is lost)
      value
    }
  );
};
const hashString = (value: string): ArrayBuffer => {
  const encoded = new TextEncoder().encode(value);
  return hash(encoded);
};
class Expiry {
  private readonly _value: bigint;
  constructor(deltaInMSec: number) {
    // Use bigint because it can overflow the maximum number allowed in a double float.
    this._value =
      (BigInt(Date.now()) +
        BigInt(deltaInMSec) -
        REPLICA_PERMITTED_DRIFT_MILLISECONDS) *
      NANOSECONDS_PER_MILLISECONDS;
  }
  toCBOR() {
    // TODO: change this to take the minimum amount of space (it always takes 8 bytes now).
    return cbor.value.u64(this._value.toString(16), 16);
  }
  toHash() {
    return lebEncode(this._value);
  }
}
