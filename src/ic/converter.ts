import { Principal } from '@dfinity/principal';
import { sha224, sha256 } from '@noble/hashes/sha256';
import { SubAccount } from './common/icType';
// @ts-ignore no type definitions for crc are available)
import crc from 'crc';
import {
  CYCLES_FINANCE_CANISTER_ID,
  GOVERNANCE_CANISTER_ID,
  SUB_ACCOUNT_BYTE_LENGTH,
  to32bits,
  validateAccount,
  validatePrincipal
} from '@/ic/utils';

/**
 * uint8ArrayToBigInt
 * @param array: Uint8Array
 * @return bigint
 */

const uint8ArrayToBigInt = (array: Uint8Array): bigint => {
  const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  if (typeof view.getBigUint64 === 'function') {
    return view.getBigUint64(0);
  } else {
    const high = BigInt(view.getUint32(0));
    const low = BigInt(view.getUint32(4));

    return (high << BigInt(32)) + low;
  }
};
const TWO_TO_THE_32 = BigInt(1) << BigInt(32);
const bigIntToUint8Array = (value: bigint): Uint8Array => {
  const array = new Uint8Array(8);
  const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  if (typeof view.setBigUint64 === 'function') {
    view.setBigUint64(0, value);
  } else {
    view.setUint32(0, Number(value >> BigInt(32)));
    view.setUint32(4, Number(value % TWO_TO_THE_32));
  }

  return array;
};
const asciiStringToByteArray = (text: string): Array<number> => {
  return Array.from(text).map((c) => c.charCodeAt(0));
};

const principalToAccountIdentifier = (
  principal: Principal,
  subAccount?: Uint8Array
): string => {
  // convert to a hex string
  const bytes = new Uint8Array(principalToAccount(principal, subAccount));
  return toHexString(bytes);
};
const principalToAccount = (
  principal: Principal,
  subAccount?: Uint8Array
): Array<number> => {
  // Hash (sha224) the principal, the subAccount and some padding
  const padding = asciiStringToByteArray('\x0Aaccount-id');
  const shaObj = sha224.create();
  shaObj.update(
    new Uint8Array([
      ...padding,
      ...principal.toUint8Array(),
      ...(subAccount ?? Array(32).fill(0))
    ])
  );
  const hash = new Uint8Array(shaObj.digest());
  // Prepend the checksum of the hash
  const checksum = calculateCrc32(hash);
  return [...checksum, ...hash];
};
const principalToSubAccount = (principal: Principal): SubAccount => {
  const bytes = principal.toUint8Array();
  const subAccount = new Uint8Array(32);
  subAccount[0] = bytes.length;
  subAccount.set(bytes, 1);
  return subAccount;
};
const toHexString = (bytes: Uint8Array): string => {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    ''
  );
};

// 4 bytes
const calculateCrc32 = (bytes: Uint8Array): Uint8Array => {
  const checksumArrayBuf = new ArrayBuffer(4);
  const view = new DataView(checksumArrayBuf);
  view.setUint32(0, crc.crc32(Buffer.from(bytes)), false);
  return Buffer.from(checksumArrayBuf);
};
const hexToBytes = (hex: string): number[] => {
  if (hex.substr(0, 2) === '0x') {
    hex = hex.replace(/^0x/i, '');
  }
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
};
const neuronAccountToAccountIdentifier = (neuronAccount: number[]): string => {
  return principalToAccountIdentifier(
    Principal.fromText(GOVERNANCE_CANISTER_ID),
    new Uint8Array(neuronAccount)
  );
};
const formatDateToMinute = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return (
    year +
    '-' +
    Appendzero(month) +
    '-' +
    Appendzero(day) +
    ' ' +
    Appendzero(hour) +
    ':' +
    Appendzero(minute)
  );
};
const formatDateToCalendarSecond = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  return (
    Appendzero(day) +
    '/' +
    Appendzero(month) +
    ' ' +
    year +
    ' ' +
    Appendzero(hour) +
    ':' +
    Appendzero(minute) +
    ' UTC'
  );
};
const formatDateToDay = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year + '-' + Appendzero(month) + '-' + Appendzero(day);
};
const formatDateToSecond = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    year +
    '-' +
    Appendzero(month) +
    '-' +
    Appendzero(day) +
    ' ' +
    Appendzero(hour) +
    ':' +
    Appendzero(minute) +
    ':' +
    Appendzero(second)
  );
};
const formatDateToSecondUTC = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  return (
    year +
    '-' +
    Appendzero(month) +
    '-' +
    Appendzero(day) +
    ' ' +
    Appendzero(hour) +
    ':' +
    Appendzero(minute) +
    ':' +
    Appendzero(second) +
    ' UTC'
  );
};
const formatDateToSecondUTCM = (date: Date): string => {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();

  return (
    Appendzero(month) +
    '-' +
    Appendzero(day) +
    ' ' +
    Appendzero(hour) +
    ':' +
    Appendzero(minute) +
    ' UTC'
  );
};
const formatDateToSecondUTCD = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year + '-' + Appendzero(month) + '-' + Appendzero(day);
};
const formatDateToSecondUTCMD = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return Appendzero(month) + '-' + Appendzero(day);
};
const formatDateTOSecondUTCToHour = (date: Date): string => {
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  return (
    Appendzero(hour) +
    ':' +
    Appendzero(minute) +
    ':' +
    Appendzero(second) +
    ' UTC'
  );
};
/**
 * @return {string}
 */
function Appendzero(obj: number) {
  if (obj < 10) {
    return '0' + obj;
  } else {
    return obj;
  }
}
const numberToArrayBuffer = (
  value: number,
  byteLength: number
): ArrayBuffer => {
  const buffer = new ArrayBuffer(byteLength);
  new DataView(buffer).setUint32(byteLength - 4, value);
  return buffer;
};
const arrayBufferToArrayOfNumber = (buffer: ArrayBuffer): Array<number> => {
  const typedArray = new Uint8Array(buffer);
  return Array.from(typedArray);
};
const fromSubAccountId = (subAccountId: number): Array<number> => {
  const buffer = numberToArrayBuffer(subAccountId, SUB_ACCOUNT_BYTE_LENGTH);
  return arrayBufferToArrayOfNumber(buffer);
};
const generateTxid = (
  _caller: Principal,
  _nonce: bigint,
  subAccount?: Uint8Array,
  canister = CYCLES_FINANCE_CANISTER_ID
): Array<number> => {
  const appType = [83, 87, 65, 80]; //SWAP
  const nonce = arrayBufferToArrayOfNumber(
    numberToArrayBuffer(Number(_nonce), 4)
  );
  const shaObj = sha224.create();
  shaObj.update(
    new Uint8Array([
      ...appType,
      ...Principal.fromText(canister).toUint8Array(),
      ...new Uint8Array(principalToAccount(_caller, subAccount)),
      ...nonce
    ])
  );
  const hash = new Uint8Array(shaObj.digest());
  return nonce.concat(Array.from(hash));
};
const isHex = (h: any): boolean => {
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(h);
};
const getTokenIdentifier = (principal: string, index: number): string => {
  const padding = Buffer.from('\x0Atid');
  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principal).toUint8Array(),
    ...to32bits(index)
  ]);
  return Principal.fromUint8Array(array).toText();
};
const generateMeatMaskSeed = (
  password: string,
  signature: string
): Uint8Array => {
  const padding = Buffer.from('\x0AMeatMask');
  const shaObj = sha224.create();
  shaObj.update(
    new Uint8Array([
      ...padding,
      ...hexToBytes(password),
      ...hexToBytes(signature)
    ])
  );
  const hash = new Uint8Array(shaObj.digest());
  console.log(hash);
  console.log([...Buffer.from(hash)].slice(0, 16));
  return new Uint8Array([...Buffer.from(hash)].slice(0, 16));
};
const toPrincipalAndAccountId = (
  val: string
): { principal: string; subaccount: string; accountId: string } => {
  if (!val) {
    return {
      principal: null,
      subaccount: null,
      accountId: null
    };
  }
  try {
    if (val.includes('|') || val.includes('.')) {
      let account;
      if (val.includes('|')) {
        account = val.split('|');
      } else {
        account = val.split('.');
      }
      const principal = account[0].trim();
      let subaccount = hexToBytes(account[1].trim());
      const flag = subaccount.every((item) => {
        return item === 0;
      });
      if (!subaccount || flag) {
        return {
          principal: principal,
          subaccount: null,
          accountId: principalToAccountIdentifier(Principal.from(principal))
        };
      }
      subaccount = new Array(32 - subaccount.length).fill(0).concat(subaccount);
      if (validatePrincipal(principal)) {
        return {
          principal: principal,
          subaccount: toHexString(new Uint8Array(subaccount)),
          accountId: principalToAccountIdentifier(
            Principal.from(principal),
            new Uint8Array(subaccount)
          )
        };
      } else {
        return {
          principal: null,
          subaccount: null,
          accountId: null
        };
      }
    } else {
      if (validatePrincipal(val)) {
        return {
          principal: val,
          subaccount: null,
          accountId: principalToAccountIdentifier(Principal.from(val))
        };
      } else if (validateAccount(val)) {
        return {
          principal: null,
          subaccount: null,
          accountId: val
        };
      }
      return {
        principal: null,
        subaccount: null,
        accountId: null
      };
    }
  } catch (e) {
    console.log(e);
    return {
      principal: null,
      subaccount: null,
      accountId: null
    };
  }
};

const SerializableIC = (x) => {
  if (x === undefined || x === null) return x;
  if (ArrayBuffer.isView(x) || x instanceof ArrayBuffer) {
    // @ts-ignore
    return [...x].map((y) => SerializableIC(y));
  }
  if (Array.isArray(x)) {
    return x.map((y) => SerializableIC(y));
  }
  if (typeof x === 'object') {
    if (x._isPrincipal) {
      return x;
    }
    return Object.fromEntries(
      Object.keys(x).map((k) => {
        return [k, SerializableIC(x[k])];
      })
    );
  }
  return x;
};

const compute_distribution_subaccount_bytes = (
  principal: Principal,
  nonce: number
) => {
  const padding = asciiStringToByteArray('token-distribution');
  const shaObj = sha256.create();
  shaObj.update(
    new Uint8Array([
      0x12,
      ...padding,
      ...principal.toUint8Array(),
      ...arrayBufferToArrayOfNumber(numberToArrayBuffer(nonce, 8))
    ])
  );
  return new Uint8Array(shaObj.digest());
};

export {
  bigIntToUint8Array,
  uint8ArrayToBigInt,
  asciiStringToByteArray,
  principalToAccountIdentifier,
  principalToSubAccount,
  toHexString,
  calculateCrc32,
  hexToBytes,
  formatDateToSecond,
  formatDateToSecondUTC,
  formatDateToMinute,
  formatDateToDay,
  formatDateToSecondUTCM,
  formatDateToSecondUTCD,
  formatDateToSecondUTCMD,
  formatDateTOSecondUTCToHour,
  neuronAccountToAccountIdentifier,
  numberToArrayBuffer,
  principalToAccount,
  fromSubAccountId,
  arrayBufferToArrayOfNumber,
  generateTxid,
  getTokenIdentifier,
  generateMeatMaskSeed,
  toPrincipalAndAccountId,
  SerializableIC,
  compute_distribution_subaccount_bytes,
  formatDateToCalendarSecond
};
