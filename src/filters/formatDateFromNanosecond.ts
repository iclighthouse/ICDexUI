import {
  formatDateToSecond,
  formatDateToSecondUTC,
  formatDateToSecondUTCM,
  formatDateToSecondUTCD,
  formatDateToSecondUTCMD,
  formatDateTOSecondUTCToHour,
  formatDateToMinute
} from '@/ic/converter';
import BigNumber from 'bignumber.js';
export const formatDateFromNanosecond = (time: bigint): string => {
  if (time) {
    const timestamp = new Date(
      Number(new BigNumber(time.toString(10)).div(1000000))
    );
    return formatDateToSecond(timestamp);
  }
  return '';
};
export const formatDateFromNanosecondUTC = (time: bigint): string => {
  if (time) {
    const timestamp = new Date(
      Number(new BigNumber(time.toString(10)).div(1000000))
    );
    return formatDateToSecondUTC(timestamp);
  }
  return '';
};
export const formatDateFromSecondUTC = (timestamp: bigint): string => {
  if (timestamp) {
    return formatDateToSecondUTC(new Date(Number(timestamp) * 1000));
  }
  return '';
};
export const formatDateFromSecondUTCM = (timestamp: bigint): string => {
  if (timestamp) {
    return formatDateToSecondUTCM(new Date(Number(timestamp) * 1000));
  }
  return '';
};
export const formatDateFromSecondUTCD = (timestamp: bigint): string => {
  if (timestamp) {
    return formatDateToSecondUTCD(new Date(Number(timestamp) * 1000));
  }
  return '';
};
export const formatDateFromSecondUTCMD = (timestamp: bigint): string => {
  if (timestamp) {
    return formatDateToSecondUTCMD(new Date(Number(timestamp) * 1000));
  }
  return '';
};

export const formatDateFromSecondUTCToHour = (timestamp: bigint): string => {
  if (timestamp) {
    return formatDateTOSecondUTCToHour(new Date(Number(timestamp)));
  }
  return '';
};
export const formatDateToMinuteFilter = (timestamp: bigint): string => {
  if (timestamp) {
    return formatDateToMinute(new Date(Number(timestamp) * 1000));
  }
  return '';
};
