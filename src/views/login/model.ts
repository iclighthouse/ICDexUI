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
  SignerNFID,
  OISY
}
export type LoginType = keyof typeof LoginEnum;
