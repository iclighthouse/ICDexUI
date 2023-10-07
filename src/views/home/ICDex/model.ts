import { TrieListData } from '@/ic/ICSwapRouter/model';
import { Stats } from '@/ic/ICDex/model';
import { KLineData } from 'klinecharts';

export interface KLData extends KLineData {
  token0volume: number,
  token1volume: number
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
export enum GridModeEnum {
  Arithmetic = 'Arithmetic',
  Geometric = 'Geometric'
}
export type GridModeMenu = keyof typeof GridModeEnum;
export enum GridAmountEnum {
  Percent = 'Percent',
  Token1 = 'Token1',
  Token0 = 'Token0'
}
export type GridAmountMenu = keyof typeof GridAmountEnum;

export type Token0Balance = string;
export type Token1Balance = string;
