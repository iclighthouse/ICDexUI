import { TrieListData } from '@/ic/ICSwapRouter/model';
import { Stats } from '@/ic/ICDex/model';
import { KLineData } from 'klinecharts';

export interface KLData extends KLineData {
  change?: number;
  token0volume: number;
  token1volume: number;
}

export type DePairs = [...TrieListData, Stats?];

export enum OrderBookType {
  All = 'All',
  Buy = 'Buy',
  Sell = 'Sell'
}
export enum TradeCompetitionsEnum {
  Info = 'Info',
  Referral = 'Referral'
  // Competitions = 'Competitions'
}
export type TradeCompetitionsMenu = 'Info' | 'Referral' | 'Competitions';

export enum OrderTypeEnum {
  LMT = 'LMT',
  MKT = 'MKT',
  FAK = 'FAK',
  FOK = 'FOK'
}

export type OrderTypeMenu = keyof typeof OrderTypeEnum;

export interface MarketMenu {
  value: string;
  name: string;
}

export type Token0Balance = string;
export type Token1Balance = string;
