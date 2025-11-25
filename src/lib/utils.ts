import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export function toBengaliNumber(num: number | string): string {
  const strNum = String(num);
  let bengaliStr = '';
  for (let i = 0; i < strNum.length; i++) {
    const char = strNum[i];
    if (char >= '0' && char <= '9') {
      bengaliStr += bengaliDigits[parseInt(char, 10)];
    } else {
      bengaliStr += char;
    }
  }
  return bengaliStr;
}
