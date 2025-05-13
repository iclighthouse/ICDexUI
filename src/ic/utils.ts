import { Principal } from '@dfinity/principal';
import { sha256 } from '@noble/hashes/sha256';
import * as convert from './converter';
import randomBytes from 'randombytes';
import CryptoJS from 'crypto-js';
import { Icrc1Account } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
const pbkdf2 = require('pbkdf2');
const sjcl = require('sjcl');
let ethereum = (window as any).ethereum;
if (ethereum && ethereum.providers) {
  ethereum = ethereum.providers.find((provider) => provider.isMetaMask);
}
const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const LEDGER_CANDID_CANISTER_ID = 'ockk2-xaaaa-aaaai-aaaua-cai';
const GOVERNANCE_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
const CYCLES_MINTING_CANISTER_ID = 'rkp4c-7iaaa-aaaaa-aaaca-cai';
const CREATE_CANISTER_MEMO = BigInt(0x41455243); // CREA,
const TOP_UP_CANISTER_MEMO = BigInt(0x50555054); // TPUP
const IC_MANAGEMENT_CANISTER_ID = 'aaaaa-aa';
const NNS_DAPP_CANISTER_ID = 'qoctq-giaaa-aaaaa-aaaea-cai';
const OGY_CANISTER_ID = 'rd6wb-lyaaa-aaaaj-acvla-cai';
const WICP_CANISTER_ID = 'utozz-siaaa-aaaam-qaaxq-cai';
// let IC_SWAP_ROUTER_CANISTER_ID = 'pwokq-miaaa-aaaak-act6a-cai';
let IC_SWAP_ROUTER_CANISTER_ID = 'j4d4d-pqaaa-aaaak-aanxq-cai';
// let IC_DEX_ROUTER_CANISTER_ID = 'pymhy-xyaaa-aaaak-act7a-cai';
// let IC_DEX_ROUTER_CANISTER_ID = 'ltyfs-qiaaa-aaaak-aan3a-cai';
let IC_DEX_ROUTER_CANISTER_ID = 'i5jcx-ziaaa-aaaar-qaazq-cai';
// let IC_SWAP_ROUTER_CANISTER_ID_Fiduciary = 'pwokq-miaaa-aaaak-act6a-cai';
let IC_SWAP_ROUTER_CANISTER_ID_Fiduciary = 'i2ied-uqaaa-aaaar-qaaza-cai';
let IC_ETH_MINTER_CANISTER_ID = 'pm5h6-jqaaa-aaaak-aejja-cai';
// let CK_ETH_MINTER_CANISTER_ID = 'jzenf-aiaaa-aaaar-qaa7q-cai';
let CK_ETH_MINTER_CANISTER_ID = 'sv3dd-oaaaa-aaaar-qacoa-cai';
// let CK_ETH_MINTER_CANISTER_ID_TEST = 'jzenf-aiaaa-aaaar-qaa7q-cai';
let CK_ETH_MINTER_CANISTER_ID_TEST = 'sv3dd-oaaaa-aaaar-qacoa-cai';
const CK_ETH_LEDGER_CANISTER_ID_TEST = 'apia6-jaaaa-aaaar-qabma-cai';
//let CK_ETH_LEDGER_CANISTER_ID = 'apia6-jaaaa-aaaar-qabma-cai';
let CK_ETH_LEDGER_CANISTER_ID = 'ss2fx-dyaaa-aaaar-qacoq-cai';
let IC_WALLET_ID = 'eife2-cqaaa-aaaai-qatkq-cai';
// let IC_WALLET_ID = 'u2nvr-zyaaa-aaaai-qgbaa-cai';
let IC_CANISTER_ID = 'foios-saaaa-aaaai-qa7aq-cai';
// let IC_CANISTER_ID = 'n5ndw-aqaaa-aaaai-qohhq-cai';
// let IC_TOKEN_CANISTER_ID = 'y2b5k-gqaaa-aaaak-aacqq-cai';
// let IC_TOKEN_CANISTER_ID = 'hac2z-3yaaa-aaaai-qfkwq-cai';
// let IC_TOKEN_CANISTER_ID = 'hac2z-3yaaa-aaaai-qfkwq-cai';
let IC_TOKEN_CANISTER_ID = 'igm6s-dqaaa-aaaar-qaa3a-cai';
let IC_LIGHTHOUSE_TOKEN_CANISTER_ID = 'hhaaz-2aaaa-aaaaq-aacla-cai';
const IC_SNS_TOKEN_CANISTER_ID = 'zfcdd-tqaaa-aaaaq-aaaga-cai';
// let IC_LIGHTHOUSE_TOKEN_CANISTER_ID = '2x2bb-qyaaa-aaaak-aaoqa-cai';
let CYCLES_FINANCE_CANISTER_ID = '6nmrm-laaaa-aaaak-aacfq-cai';
// let CYCLES_FINANCE_CANISTER_ID = 'ojpf6-3aaaa-aaaai-qbira-cai';
let IC_MINING_CANISTER_ID = '5iykh-wiaaa-aaaak-aacoa-cai';
// let IC_MINING_CANISTER_ID = 'q4kst-2iaaa-aaaai-qbgtq-cai';
let IC_STABLE_CANISTER_ID = '26zk5-gqaaa-aaaak-aaorq-cai';
let DUSD_CANISTER_ID = '2l63q-hyaaa-aaaak-aaosa-cai';
let NFT_CANISTER_ID = 'goncb-kqaaa-aaaap-aakpa-cai';
let IC_BTC_MINTER_CANISTER_ID = '3xqzw-tyaaa-aaaak-adzba-cai';
let IC_BTC_CANISTER_ID = '3qr7c-6aaaa-aaaak-adzbq-cai';
let CK_BTC_MINTER_CANISTER_ID = 'mqygn-kiaaa-aaaar-qaadq-cai';
let CK_BTC_CANISTER_ID = 'mxzaz-hqaaa-aaaar-qaada-cai';
const ME_ACCOUNT_CANISTER_ID = 'dnmrm-hqaaa-aaaao-aapuq-cai';
const SNS_WASM_CANISTER_ID = 'qaa6y-5yaaa-aaaaa-aaafa-cai';
const QUESTS_CANISTER_ID = 'iairp-iiaaa-aaaao-ahryq-cai';
const IC_TOKENS_SCAN_CANISTER_ID = 'ytcww-qyaaa-aaaak-aacra-cai';
const BLACKHOLE_CANISTER_ID = '7hdtw-jqaaa-aaaak-aaccq-cai';
const DID_CANISTER_ID = 'a4gq6-oaaaa-aaaab-qaa4q-cai';
// const AIRDROP_CANISTER_ID = '76a3l-5qaaa-aaaak-afqhq-cai';
const AIRDROP_CANISTER_ID = 'r43hs-lqaaa-aaaak-afoca-cai';
// let MINING_CANISTER_ID = 'o7d74-vqaaa-aaaar-qaapa-cai';
let MINING_CANISTER_ID = 'odhfn-cqaaa-aaaar-qaana-cai';
const ETHHttps = [
  'https://eth-sepolia.g.alchemy.com/v2/8orVKy1L-zwpKo0N2GdMCEzxpfJExva3',
  'https://eth-sepolia.g.alchemy.com/v2/Sz5D9aIo4L1UCBwif72PYS8K-B7TgLw3',
  'https://eth-sepolia.g.alchemy.com/v2/cxoNSpAs233I0lszO1j8n3eWLeEjjHf8'
];
const ETHHttpsMainnet = [
  'https://eth-mainnet.g.alchemy.com/v2/8orVKy1L-zwpKo0N2GdMCEzxpfJExva3',
  'https://eth-mainnet.g.alchemy.com/v2/Sz5D9aIo4L1UCBwif72PYS8K-B7TgLw3'
];
const ETHWebsocketProvider = [
  'wss://eth-sepolia.g.alchemy.com/v2/8orVKy1L-zwpKo0N2GdMCEzxpfJExva3',
  'wss://eth-sepolia.g.alchemy.com/v2/Sz5D9aIo4L1UCBwif72PYS8K-B7TgLw3',
  'wss://eth-sepolia.g.alchemy.com/v2/cxoNSpAs233I0lszO1j8n3eWLeEjjHf8'
];
const etherScanKey = [
  '72PIX2J7NKXMS5SQSZCYIEIY6GKU36Q5T3',
  'EI9RE3UZZ9B3UD43YXHCSJGXXN1F19F6Q6',
  '8IR9XPZHH25RRQX11Y3Q2U7PCYU913TGRM'
];
const ETHHttpsSepolia = [
  'https://eth-sepolia.g.alchemy.com/v2/8orVKy1L-zwpKo0N2GdMCEzxpfJExva3'
];
if (process.env.NODE_ENV === 'production') {
  IC_SWAP_ROUTER_CANISTER_ID = 'j4d4d-pqaaa-aaaak-aanxq-cai';
  // IC_SWAP_ROUTER_CANISTER_ID = 'pwokq-miaaa-aaaak-act6a-cai';
  IC_SWAP_ROUTER_CANISTER_ID_Fiduciary = 'i2ied-uqaaa-aaaar-qaaza-cai';
  // IC_SWAP_ROUTER_CANISTER_ID_Fiduciary = 'j4d4d-pqaaa-aaaak-aanxq-cai';
  // IC_SWAP_ROUTER_CANISTER_ID_Fiduciary = 'pwokq-miaaa-aaaak-act6a-cai';
  // IC_DEX_ROUTER_CANISTER_ID = 'ltyfs-qiaaa-aaaak-aan3a-cai';
  IC_DEX_ROUTER_CANISTER_ID = 'i5jcx-ziaaa-aaaar-qaazq-cai';
  // IC_DEX_ROUTER_CANISTER_ID = 'pymhy-xyaaa-aaaak-act7a-cai';
  // todo
  IC_ETH_MINTER_CANISTER_ID = 'pm5h6-jqaaa-aaaak-aejja-cai';
  CK_ETH_MINTER_CANISTER_ID = 'sv3dd-oaaaa-aaaar-qacoa-cai';
  // CK_ETH_MINTER_CANISTER_ID_TEST = 'jzenf-aiaaa-aaaar-qaa7q-cai';
  CK_ETH_MINTER_CANISTER_ID_TEST = 'sv3dd-oaaaa-aaaar-qacoa-cai';
  CK_ETH_LEDGER_CANISTER_ID = 'ss2fx-dyaaa-aaaar-qacoq-cai';
  IC_WALLET_ID = 'eife2-cqaaa-aaaai-qatkq-cai';
  IC_CANISTER_ID = 'foios-saaaa-aaaai-qa7aq-cai';
  IC_TOKEN_CANISTER_ID = 'igm6s-dqaaa-aaaar-qaa3a-cai';
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID = 'hhaaz-2aaaa-aaaaq-aacla-cai';
  CYCLES_FINANCE_CANISTER_ID = '6nmrm-laaaa-aaaak-aacfq-cai';
  IC_MINING_CANISTER_ID = '5iykh-wiaaa-aaaak-aacoa-cai';
  IC_STABLE_CANISTER_ID = '26zk5-gqaaa-aaaak-aaorq-cai';
  DUSD_CANISTER_ID = '2l63q-hyaaa-aaaak-aaosa-cai';
  NFT_CANISTER_ID = 'goncb-kqaaa-aaaap-aakpa-cai';
  // Mainnet
  IC_BTC_MINTER_CANISTER_ID = '36tsk-fqaaa-aaaak-adzaq-cai';
  IC_BTC_CANISTER_ID = '3fwop-7iaaa-aaaak-adzca-cai';
  // Test
  // IC_BTC_MINTER_CANISTER_ID = '3xqzw-tyaaa-aaaak-adzba-cai';
  // IC_BTC_CANISTER_ID = '3qr7c-6aaaa-aaaak-adzbq-cai';
  CK_BTC_MINTER_CANISTER_ID = 'mqygn-kiaaa-aaaar-qaadq-cai';
  CK_BTC_CANISTER_ID = 'mxzaz-hqaaa-aaaar-qaada-cai';
  // MINING_CANISTER_ID = 'o7d74-vqaaa-aaaar-qaapa-cai';
  MINING_CANISTER_ID = 'odhfn-cqaaa-aaaar-qaana-cai';
}
const MINING_CANISTER_ID_CHAT = 'orbsu-oaaaa-aaaar-qaaoa-cai';
const MINING_CANISTER_ID_MOTOKO = 'owaua-dyaaa-aaaar-qaaoq-cai';
const MINING_CANISTER_ID_EXE = 'oyczi-yiaaa-aaaar-qaapq-cai';
const plugWhitelist = [
  NNS_DAPP_CANISTER_ID,
  IC_MANAGEMENT_CANISTER_ID,
  LEDGER_CANISTER_ID,
  GOVERNANCE_CANISTER_ID,
  CYCLES_MINTING_CANISTER_ID,
  IC_CANISTER_ID,
  IC_TOKEN_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  CYCLES_FINANCE_CANISTER_ID,
  IC_MINING_CANISTER_ID,
  IC_SWAP_ROUTER_CANISTER_ID,
  IC_STABLE_CANISTER_ID,
  DUSD_CANISTER_ID,
  WICP_CANISTER_ID,
  NFT_CANISTER_ID,
  IC_SNS_TOKEN_CANISTER_ID,
  IC_BTC_MINTER_CANISTER_ID,
  IC_BTC_CANISTER_ID,
  CK_BTC_MINTER_CANISTER_ID,
  CK_BTC_CANISTER_ID,
  SNS_WASM_CANISTER_ID,
  QUESTS_CANISTER_ID,
  IC_TOKENS_SCAN_CANISTER_ID,
  IC_ETH_MINTER_CANISTER_ID,
  IC_DEX_ROUTER_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID_TEST,
  CK_ETH_LEDGER_CANISTER_ID,
  IC_SWAP_ROUTER_CANISTER_ID_Fiduciary,
  BLACKHOLE_CANISTER_ID,
  AIRDROP_CANISTER_ID,
  CK_ETH_LEDGER_CANISTER_ID_TEST,
  MINING_CANISTER_ID,
  MINING_CANISTER_ID_CHAT,
  MINING_CANISTER_ID_MOTOKO,
  MINING_CANISTER_ID_EXE
];
const ICXWhitelist = [
  NNS_DAPP_CANISTER_ID,
  ME_ACCOUNT_CANISTER_ID,
  LEDGER_CANISTER_ID,
  CYCLES_FINANCE_CANISTER_ID,
  CYCLES_MINTING_CANISTER_ID,
  IC_CANISTER_ID,
  IC_TOKEN_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_MINING_CANISTER_ID,
  IC_SWAP_ROUTER_CANISTER_ID,
  NFT_CANISTER_ID,
  IC_SNS_TOKEN_CANISTER_ID,
  IC_BTC_MINTER_CANISTER_ID,
  IC_BTC_CANISTER_ID,
  CK_BTC_MINTER_CANISTER_ID,
  CK_BTC_CANISTER_ID,
  SNS_WASM_CANISTER_ID,
  QUESTS_CANISTER_ID,
  IC_TOKENS_SCAN_CANISTER_ID,
  IC_ETH_MINTER_CANISTER_ID,
  IC_DEX_ROUTER_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID_TEST,
  CK_ETH_LEDGER_CANISTER_ID,
  IC_SWAP_ROUTER_CANISTER_ID_Fiduciary,
  BLACKHOLE_CANISTER_ID,
  AIRDROP_CANISTER_ID,
  CK_ETH_LEDGER_CANISTER_ID_TEST,
  MINING_CANISTER_ID,
  MINING_CANISTER_ID_CHAT,
  MINING_CANISTER_ID_MOTOKO,
  MINING_CANISTER_ID_EXE
];
const SUB_ACCOUNT_BYTE_LENGTH = 32;
const ICLighthouseNeuronId =
  '78ea67a9a0e03055e76cf71380f3bdb9d83ec19552e5cc58d6c596173a72156c';
const ICLNeuronId =
  '1107e1481282291f8ae6811735edefabeb86958b79844ca0b0adff34ffdb987e';
const ICLighthouseCHATNeuronId =
  '68f6723cf5d95cd320baf016b1d85cf58cda88301b1fa867c527699de746555b';
const getEthereumAccount = async (): Promise<string> => {
  const accounts: string[] = await ethereum.request({
    method: 'eth_accounts'
  });
  return accounts[0] || '';
};
const isHexString = (value: any): boolean => {
  if (value.substr(0, 2) === '0x') {
    value = value.replace(/^0x/i, '');
  }
  return isHex(value);
};
const isHex = (h: any): boolean => {
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(h);
};
const validateAccount = (a: any): boolean => {
  return isHex(a) && a.length === 64;
};
const validatePrincipal = (principal: string): boolean => {
  try {
    return principal === Principal.fromText(principal).toText();
  } catch (e) {
    return false;
  }
};
const validateCyclesWallet = (principal: string): boolean => {
  return validatePrincipal(principal) && principal.length < 63;
};
const getSubAccountArray = (s: Array<number> | number): number[] => {
  if (Array.isArray(s)) {
    return s.concat(Array(32 - s.length).fill(0));
  } else {
    //32 bit number only
    return Array(28)
      .fill(0)
      .concat(to32bits(s ? s : 0));
  }
};
const to32bits = (num: number): number[] => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};
const encrypt = (
  message: string,
  password: string,
  salt: string,
  keylen = 256,
  digest = 'sha512'
): Promise<string> => {
  let iterations = 100;
  if (process.env.NODE_ENV === 'production') {
    iterations = 210000;
  }
  if (salt === 'ICLightHouse' && process.env.NODE_ENV === 'production') {
    iterations = 10000;
  }
  return new Promise((resolve, reject) => {
    pbkdf2.pbkdf2(
      password,
      salt,
      iterations,
      keylen,
      digest,
      (err: Error | null, derivedKey: Buffer) => {
        if (err) {
          reject(err);
        }
        resolve(sjcl.encrypt(derivedKey.toString(), btoa(message)));
      }
    );
  });
};
const decrypt = (
  data,
  password: string,
  salt: string,
  keylen = 256,
  digest = 'sha512'
): Promise<string> => {
  let iterations = 100;
  if (process.env.NODE_ENV === 'production') {
    iterations = 210000;
  }
  if (salt === 'ICLightHouse' && process.env.NODE_ENV === 'production') {
    iterations = 10000;
  }
  return new Promise((resolve, reject) => {
    pbkdf2.pbkdf2(
      password,
      salt,
      iterations,
      keylen,
      digest,
      (err: Error | null, derivedKey: Buffer) => {
        if (err) {
          reject(err);
        }
        try {
          resolve(atob(sjcl.decrypt(derivedKey.toString(), data)));
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};
/**
 * encrypt
 * @param msg
 * @param key
 * @returns {*|string} base64
 */
const encryptMessage = (msg: string, key: string): string => {
  const encryptedData = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(msg),
    CryptoJS.enc.Utf8.parse(key),
    {
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.ECB
    }
  );
  return encryptedData.ciphertext.toString();
};
/**
 * decrypt
 * @param msg base64
 * @param key
 * @returns {string}
 */
const decryptMessage = (msg: string, key: string): string => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(msg);
  const data = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
  // const data = CryptoJS.AES.decrypt(msg, CryptoJS.enc.Utf8.parse(key), {
  //   padding: CryptoJS.pad.Pkcs7,
  //   mode: CryptoJS.mode.ECB
  // });
  // return CryptoJS.enc.Base64.stringify(data);
};
/**
 * @param principal: your principal
 */
// https://github.com/dfinity/nns-dapp/blob/55a89a9b5d5d4241277822197efc62f3d3e8d6ce/frontend/ts/src/canisters/createNeuron.ts#L92
const createSubAccount = (
  principal: Principal,
  governanceCanisterId = GOVERNANCE_CANISTER_ID
): {
  nonce: bigint;
  accountIdentifier: string;
} => {
  const nonceBytes = new Uint8Array(randomBytes(8));
  const nonce = convert.uint8ArrayToBigInt(nonceBytes);
  const toSubAccount = buildSubAccount(nonceBytes, principal);
  const accountIdentifier = convert.principalToAccountIdentifier(
    Principal.fromText(governanceCanisterId),
    toSubAccount
  );
  return {
    nonce: nonce,
    accountIdentifier: accountIdentifier
  };
};
const createSNSSubAccount = (
  principal: Principal,
  governanceCanisterId = GOVERNANCE_CANISTER_ID
): {
  memo: Uint8Array;
  account: Icrc1Account;
} => {
  const nonceBytes = new Uint8Array(randomBytes(8));
  const nonce = nonceBytes; // [Array.from(nonceBytes)]
  const toSubAccount = [Array.from(buildSubAccount(nonceBytes, principal))];
  return {
    memo: nonce,
    account: {
      owner: Principal.fromText(governanceCanisterId),
      subaccount: toSubAccount
    }
  };
};
const buildSubAccount = (
  nonce: Uint8Array,
  principal: Principal
): Uint8Array => {
  const padding = convert.asciiStringToByteArray('neuron-stake');
  const shaObj = sha256.create();
  shaObj.update(
    new Uint8Array([0x0c, ...padding, ...principal.toUint8Array(), ...nonce])
  );
  return new Uint8Array(shaObj.digest());
};
const getSNSNeuronId = (
  principal: Principal,
  governanceCanisterId = GOVERNANCE_CANISTER_ID,
  memo: bigint
): string => {
  // err
  const toSubAccount = buildSubAccount(
    convert.bigIntToUint8Array(memo),
    principal
  );
  return convert.principalToAccountIdentifier(
    Principal.fromText(governanceCanisterId),
    toSubAccount
  );
};
// const createStarSubAccount = (tokenPrincipal: Principal): Array<number> => {
//   const a = [0, 0, 0, 1]
//   tokenPrincipal.toUint8Array()
// };
const buildMemo = (nonce: bigint): bigint => {
  const year = new Date().getUTCFullYear();
  let memo = year.toString(10) + '0' + nonce.toString(10) + '0';
  if (
    new BigNumber(year.toString(10))
      .plus(nonce.toString(10))
      .mod(2)
      .toNumber() === 0
  ) {
    memo = memo + '2';
  } else {
    memo = memo + '1';
  }
  let count = 0;
  year
    .toString(10)
    .split('')
    .forEach((item) => {
      count += Number(item);
    });
  nonce
    .toString(10)
    .split('')
    .forEach((item) => {
      count += Number(item);
    });
  if (count % 2 === 0) {
    memo = memo + '2';
  } else {
    memo = memo + '1';
  }
  return BigInt(memo);
};
export {
  LEDGER_CANISTER_ID,
  GOVERNANCE_CANISTER_ID,
  CYCLES_MINTING_CANISTER_ID,
  LEDGER_CANDID_CANISTER_ID,
  TOP_UP_CANISTER_MEMO,
  CREATE_CANISTER_MEMO,
  IC_WALLET_ID,
  IC_CANISTER_ID,
  IC_TOKEN_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_MANAGEMENT_CANISTER_ID,
  SUB_ACCOUNT_BYTE_LENGTH,
  CYCLES_FINANCE_CANISTER_ID,
  IC_MINING_CANISTER_ID,
  plugWhitelist,
  IC_SWAP_ROUTER_CANISTER_ID,
  IC_STABLE_CANISTER_ID,
  DUSD_CANISTER_ID,
  WICP_CANISTER_ID,
  NFT_CANISTER_ID,
  OGY_CANISTER_ID,
  ME_ACCOUNT_CANISTER_ID,
  IC_ETH_MINTER_CANISTER_ID,
  ICXWhitelist,
  IC_SNS_TOKEN_CANISTER_ID,
  IC_BTC_MINTER_CANISTER_ID,
  IC_BTC_CANISTER_ID,
  CK_BTC_MINTER_CANISTER_ID,
  CK_BTC_CANISTER_ID,
  SNS_WASM_CANISTER_ID,
  QUESTS_CANISTER_ID,
  ICLNeuronId,
  ICLighthouseNeuronId,
  ICLighthouseCHATNeuronId,
  IC_TOKENS_SCAN_CANISTER_ID,
  ETHHttps,
  ETHHttpsMainnet,
  ETHWebsocketProvider,
  etherScanKey,
  ETHHttpsSepolia,
  NNS_DAPP_CANISTER_ID,
  IC_DEX_ROUTER_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID_TEST,
  CK_ETH_LEDGER_CANISTER_ID,
  IC_SWAP_ROUTER_CANISTER_ID_Fiduciary,
  BLACKHOLE_CANISTER_ID,
  DID_CANISTER_ID,
  AIRDROP_CANISTER_ID,
  MINING_CANISTER_ID,
  isHex,
  isHexString,
  getEthereumAccount,
  validateAccount,
  validatePrincipal,
  getSubAccountArray,
  encrypt,
  decrypt,
  encryptMessage,
  decryptMessage,
  createSubAccount,
  createSNSSubAccount,
  validateCyclesWallet,
  to32bits,
  buildMemo,
  getSNSNeuronId
};
