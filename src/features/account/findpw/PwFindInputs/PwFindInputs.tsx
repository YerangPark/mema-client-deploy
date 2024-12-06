'use client';
import styled from 'styled-components';
import React, { useState } from 'react';
import { UseInputStateReturn } from '@/hooks/useInputState';
import InputWrapper from '@/components/Input/InputWrapper';
import Label from '@/components/common/Label';
import Input from '@/components/Input';
import Button from '@/components/Button';

type PwFindInputsProps = {
  onClickNext: () => void;
  email: UseInputStateReturn;
  verificationCode: UseInputStateReturn;
};

const PwFindInputs: React.FC<PwFindInputsProps> = ({ onClickNext, email, verificationCode }) => {
  const [isVerify, setIsVerify] = useState(false);

  const handleRequestVerification = () => {
    console.log('이메일 인증 요청 보내기');
    setIsVerify(!isVerify);
  };

  const handleVerifyCode = () => {
    console.log('인증 코드 검증');
    setIsVerify(!isVerify);
  };

  return (
    <>
      <Container>
        <InputWrapper isFocused={email.isFocused} isEmpty={email.isEmpty}>
          <Label isFocused={email.isFocused} isEmpty={email.isEmpty}>
            이메일
          </Label>
          <Input
            type="email"
            value={email.value}
            placeholder="이메일을 입력하세요"
            onChange={email.handleChange}
            onFocus={email.handleFocus}
            onBlur={email.handleBlur}
          />
          <VerificationButton onClick={handleRequestVerification}>인증 요청</VerificationButton>
        </InputWrapper>
        <InputWrapper isFocused={verificationCode.isFocused} isEmpty={verificationCode.isEmpty}>
          <Label isFocused={verificationCode.isFocused} isEmpty={verificationCode.isEmpty}>
            인증 번호
          </Label>
          <Input
            type="text"
            value={verificationCode.value}
            placeholder="인증번호를 입력하세요"
            onChange={verificationCode.handleChange}
            onFocus={verificationCode.handleFocus}
            onBlur={verificationCode.handleBlur}
          />
          <VerificationButton disabled={true} onClick={handleVerifyCode}>
            {isVerify ? '인증 완료' : '확인'}
          </VerificationButton>
        </InputWrapper>
      </Container>
      <StyledButton name="다음으로" disabled={!isVerify} onClick={onClickNext} />
    </>
  );
};

export default PwFindInputs;

const StyledButton = styled(Button)`
  position: absolute;
  bottom: 34px;
  width: calc(100% - 32px);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const VerificationButton = styled.button`
  ${({ theme }) => theme.fonts.text.sm};
  color: white;
  background-color: ${({ theme }) => theme.colors.primary.default};
  border-radius: 15px;
  border: none;
  padding: 4px 10px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.lighter};
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.primary.darker};
  }
  &:disabled {
    background-color: white;
    color: ${({ theme }) => theme.colors.gray[4]};
    border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  }
`;
