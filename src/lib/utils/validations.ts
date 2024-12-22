// 알파벳, 숫자 조합의 8~12자리 확인
export const passwordValidation = (value: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
  return passwordRegex.test(value);
};
