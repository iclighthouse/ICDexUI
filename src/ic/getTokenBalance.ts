import { Icrc1Account, TokenStd } from '@/ic/common/icType';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { fromSubAccountId, principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { Address } from '@/ic/DRC20Token/model';
import { CYCLES_FINANCE_CANISTER_ID, getSubAccountArray } from '@/ic/utils';

export const getTokenBalance = async (
  tokenStd: TokenStd,
  tokenId: string,
  subAccountId = 0
): Promise<string> => {
  const currentDRC20TokenService = new DRC20TokenService();
  const principal = localStorage.getItem('principal');
  if (!principal || tokenId === CYCLES_FINANCE_CANISTER_ID) {
    return;
  }
  let balance = BigInt(0);
  try {
    if (tokenStd && (tokenStd as { icp: null }).icp === null) {
      balance = BigInt(await getIcpBalance(subAccountId));
    } else if (tokenStd && (tokenStd as { drc20: null }).drc20 === null) {
      balance = await currentDRC20TokenService.drc20_balanceOf(
        tokenId,
        principalToAccountIdentifier(
          Principal.fromText(principal),
          new Uint8Array(fromSubAccountId(subAccountId))
        )
      );
    } else if (tokenStd && (tokenStd as { dip20: null }).dip20 === null) {
      // deleted
      balance = await currentDRC20TokenService.balanceOf(
        tokenId,
        Principal.fromText(principal)
      );
    } else if (tokenStd && (tokenStd as { icrc1: null }).icrc1 === null) {
      const to = {
        owner: Principal.fromText(principal),
        subaccount: [getSubAccountArray(subAccountId)]
      };
      balance = await currentDRC20TokenService.icrc1_balance_of(tokenId, to);
    } else {
      balance = await currentDRC20TokenService.drc20_balanceOf(
        tokenId,
        principalToAccountIdentifier(
          Principal.fromText(principal),
          new Uint8Array(fromSubAccountId(subAccountId))
        )
      );
    }
    if (balance || balance.toString(10)) {
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      if (!currentInfo.tokensBalance) {
        currentInfo.tokensBalance = {};
      }
      if (
        !new BigNumber(currentInfo.tokensBalance[tokenId]).eq(
          balance.toString(10)
        )
      ) {
        currentInfo.tokensBalance[tokenId] = balance.toString(10);
        localStorage.setItem(principal, JSON.stringify(currentInfo));
      }
      return balance.toString(10);
    }
  } catch (e) {
    console.log(e);
  }
};
const getIcpBalance = async (subAccountId = 0): Promise<string> => {
  const ledgerService = new LedgerService();
  const principal = localStorage.getItem('principal');
  const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
  let balance;
  if (currentInfo.balance) {
    balance = new BigNumber(currentInfo.balance).times(10 ** 8).toString(10);
  } else {
    balance = '0';
  }
  const balanceRes = await ledgerService.getBalances({
    account: principalToAccountIdentifier(
      Principal.fromText(principal),
      new Uint8Array(fromSubAccountId(subAccountId))
    )
  });
  if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
    balance = new BigNumber(balanceRes?.e8s.toString(10)).toString(10);
  }
  return balance;
};
export const getDepositing = async (
  tokenStd: TokenStd,
  tokenId: string,
  icrc1Account: Icrc1Account | string
): Promise<string> => {
  const currentDRC20TokenService = new DRC20TokenService();
  let balance = '0';
  let address: string;
  if (typeof icrc1Account === 'string') {
    address = icrc1Account;
  } else {
    address = principalToAccountIdentifier(
      icrc1Account.owner,
      new Uint8Array(icrc1Account.subaccount[0])
    );
  }
  if (tokenStd && (tokenStd as { icp: null }).icp === null) {
    const ledgerService = new LedgerService();
    const balanceRes = await ledgerService.getBalances({
      account: address
    });
    if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
      balance = new BigNumber(balanceRes?.e8s.toString(10)).toString(10);
    }
  } else if (tokenStd && (tokenStd as { icrc1: null }).icrc1 === null) {
    const currentDRC20TokenService = new DRC20TokenService();
    if (
      icrc1Account &&
      (icrc1Account as Icrc1Account).subaccount &&
      (icrc1Account as Icrc1Account).subaccount.length
    ) {
      (icrc1Account as Icrc1Account).subaccount[0] = Array.from(
        (icrc1Account as Icrc1Account).subaccount[0]
      );
    }
    const res = await currentDRC20TokenService.icrc1_balance_of(
      tokenId,
      icrc1Account as Icrc1Account
    );
    balance = res.toString(10);
  } else if (tokenStd && (tokenStd as { drc20: null }).drc20 === null) {
    const res = await currentDRC20TokenService.drc20_balanceOf(
      tokenId,
      address
    );
    balance = res.toString(10);
  }
  // todo dip20
  // else if (tokenStd && (tokenStd as { dip20: null }).dip20 === null) {
  //   const res = await currentDRC20TokenService.balanceOf(
  //     tokenId,
  //     Principal.fromText(principal)
  //   );
  //   balance = res.toString(10);
  // }
  return balance;
};
export const getCompetitionsBalance = async (
  tokenStd: TokenStd,
  tokenId: string,
  account: [Icrc1Account, Address]
): Promise<string> => {
  const currentDRC20TokenService = new DRC20TokenService();
  let balance = '0';
  const std = Object.keys(tokenStd)[0].toLocaleLowerCase();
  if (std === 'icp') {
    const ledgerService = new LedgerService();
    const balanceRes = await ledgerService.getBalances({
      account: account[1]
    });
    if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
      balance = new BigNumber(balanceRes?.e8s.toString(10)).toString(10);
    }
  }
  if (std === 'icrc1') {
    const currentDRC20TokenService = new DRC20TokenService();
    const res = await currentDRC20TokenService.icrc1_balance_of(
      tokenId,
      account[0]
    );
    balance = res.toString(10);
  }
  if (std === 'drc20') {
    const res = await currentDRC20TokenService.drc20_balanceOf(
      tokenId,
      account[1]
    );
    balance = res.toString(10);
  }
  if (std === 'dip20') {
    const res = await currentDRC20TokenService.balanceOf(
      tokenId,
      account[0].owner
    );
    balance = res.toString(10);
  }
  return balance;
};
