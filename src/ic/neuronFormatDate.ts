const getDisparityMonth = (
  disparityDay?: number,
  month = new Date().getMonth() + 1
): number => {
  let disparityMonth = 0;
  const countFc = () => {
    if (disparityDay >= getMonthDay(month)) {
      disparityDay -= getMonthDay(month);
      disparityMonth++;
      if (month === 11) {
        month = 0;
      } else {
        month++;
      }
      countFc();
    } else {
      return disparityMonth;
    }
  };
  countFc();
  return disparityMonth;
};
const getMonthDay = (month = new Date().getMonth() + 1): number => {
  let day = 0;
  if (
    month == 1 ||
    month == 3 ||
    month == 5 ||
    month == 7 ||
    month == 8 ||
    month == 10 ||
    month == 12
  ) {
    day = 31;
  } else if (month == 2) {
    if (getYearDay() == 366) day = 29;
    if (getYearDay() == 365) day = 28;
  } else {
    day = 30;
  }
  return day;
};
const getDisparityYear = (
  disparityDay?: number,
  year = new Date().getFullYear()
): number => {
  let disparityYear = 0;
  const countFc = () => {
    if (disparityDay >= getYearDay(year)) {
      disparityDay -= getYearDay(year);
      disparityYear++;
      year++;
      countFc();
    } else {
      return disparityYear;
    }
  };
  countFc();
  return disparityYear;
};
const getYearDay = (year = new Date().getFullYear()): number => {
  const isLeap = (0 === year % 4 && 0 === year % 100) || 0 === year % 400;
  return isLeap ? 366 : 365;
};
export { getDisparityMonth, getYearDay, getMonthDay, getDisparityYear };
