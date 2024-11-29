enum LoginEnum {
  Mnemonic,
  Existing,
  InternetIdentitiy,
  Plug,
  Infinity,
  MetaMask,
  HardwareWallet,
  NFID,
  Signer,
  SignerPlug,
  SignerNFID
}
export type LoginType = keyof typeof LoginEnum;
