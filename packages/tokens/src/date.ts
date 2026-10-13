/** Gregorian local values. These utilities never construct a timezone-bearing Date. */
export type LocalDate = Readonly<{ year: number; month: number; day: number }>;
export type LocalTime = Readonly<{ hour: number; minute: number }>;
export const isLeapYear = (year: number): boolean => year%4===0&&(year%100!==0||year%400===0);
export function daysInMonth(year: number, month: number): number {
  if (!Number.isInteger(year)||year<1||year>9999||!Number.isInteger(month)||month<1||month>12) throw new RangeError('Date outside Gregorian 0001–9999');
  return [31,isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31][month-1]!;
}
export function parseLocalDate(text: string): LocalDate | null {
  const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return null;
  const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
  if (year<1||year>9999||month<1||month>12||day<1||day>daysInMonth(year,month))return null;
  return Object.freeze({year,month,day});
}
export function formatLocalDate(value: LocalDate): string {
  const text=[String(value.year).padStart(4,'0'),String(value.month).padStart(2,'0'),String(value.day).padStart(2,'0')].join('-');
  if (!parseLocalDate(text))throw new RangeError('Invalid local date');
  return text;
}
export function parseLocalTime(text: string): LocalTime | null {
  const match=/^(\d{2}):(\d{2})$/.exec(text);
  if(!match)return null;
  const hour=Number(match[1]),minute=Number(match[2]);
  return hour<24&&minute<60?Object.freeze({hour,minute}):null;
}
export function formatLocalTime(value: LocalTime): string {
  const text=String(value.hour).padStart(2,'0')+':'+String(value.minute).padStart(2,'0');
  if(!parseLocalTime(text))throw new RangeError('Invalid local time');return text;
}
export function compareLocalDates(a: LocalDate,b: LocalDate): number {
  return formatLocalDate(a).localeCompare(formatLocalDate(b));
}
export function addLocalMonths(value: LocalDate, amount: number): LocalDate {
  formatLocalDate(value);if(!Number.isInteger(amount))throw new RangeError('Month offset must be integral');
  const index=(value.year-1)*12+value.month-1+amount;
  const year=Math.floor(index/12)+1,month=index%12+1;
  return Object.freeze({year,month,day:Math.min(value.day,daysInMonth(year,month))});
}
export function addLocalDays(value: LocalDate, amount: number): LocalDate {
  formatLocalDate(value);if(!Number.isInteger(amount)||Math.abs(amount)>3652425)throw new RangeError('Day offset outside supported calendar');
  let {year,month,day}=value;
  const step=amount<0?-1:1;
  for(let i=0;i<Math.abs(amount);i++) {
    day+=step;
    if(day>daysInMonth(year,month)){day=1;if(++month===13){month=1;year++;}}
    else if(day===0){if(--month===0){month=12;year--;}day=daysInMonth(year,month);}
    if(year<1||year>9999)throw new RangeError('Date outside Gregorian 0001–9999');
  }
  return Object.freeze({year,month,day});
}
/** Monday=0 through Sunday=6; 0001-01-01 was Monday in the proleptic Gregorian calendar. */
export function localWeekday(value: LocalDate): number {
  formatLocalDate(value);const y=value.year-1;
  let count=y*365+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)+value.day-1;
  for(let month=1;month<value.month;month++)count+=daysInMonth(value.year,month);
  return count%7;
}
