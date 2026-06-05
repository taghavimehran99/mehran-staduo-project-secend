export const formatToman = (val: number): string => {
  return val.toLocaleString("fa-IR") + " تومان";
};

export const toPersianDigits = (str: string | number): string => {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[0-9]/g, (w) => id[+w]);
};
