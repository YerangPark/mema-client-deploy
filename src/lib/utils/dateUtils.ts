export const toDate = (value: string | null | undefined): Date | null => {
  return value ? new Date(value) : null;
};

export const formatDateToMMDD = (dateString: string): string => {
  // input dateString 형식: YYYY-MM-DD
  const [, month, day] = dateString.split('-');
  return `${parseInt(month, 10)}/${parseInt(day, 10)}`;
};

export const formatDateForRequset = (date: Date) => {
  // UTC+9 한국 시간으로 변환
  const offset = 9 * 60 * 60 * 1000; // 9시간
  const localDate = new Date(date.getTime() + offset);

  return localDate.toISOString().split('.')[0];
};

export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// 사용 예제
// const date = new Date();
// console.log(formatDate(date)); // 기본: "2024-12-02"
// console.log(formatDate(date, 'YYYY/MM/DD HH:mm')); // "2024/12/02 15:30"

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const compareDateWithToday = (dateString: string) => {
  // 'YYYY-MM-DD' 문자열 비교
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(dateString);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return -1;
  } else if (inputDate.getTime() === today.getTime()) {
    return 0;
  } else {
    return 1;
  }
};
