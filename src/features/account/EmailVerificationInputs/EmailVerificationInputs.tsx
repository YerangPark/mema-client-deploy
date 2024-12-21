'use client';
import styled from 'styled-components';
import React from 'react';
import { UseInputStateReturn } from '@/lib/hooks/useInputState';
import InputWrapper from '@/components/Input/InputWrapper';
import Label from '@/components/common/Label';
import Input from '@/components/Input';

interface Props {
  onClickRequestVerification: () => void;
  onClickVerifyCode: () => void;
  email: UseInputStateReturn;
  verificationCode: UseInputStateReturn;
  isEmailSent: boolean;
  isVerified: boolean;
}

const EmailVerificationInputs: React.FC<Props> = ({
  onClickRequestVerification,
  onClickVerifyCode,
  email,
  verificationCode,
  isEmailSent,
  isVerified,
}) => {
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
            disabled={isEmailSent}
          />
          <VerificationButton disabled={isEmailSent} onClick={onClickRequestVerification}>
            {isEmailSent ? '전송 완료' : '인증 요청'}
          </VerificationButton>
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
            disabled={isVerified}
          />
          <VerificationButton disabled={isVerified} onClick={onClickVerifyCode}>
            {isVerified ? '인증 완료' : '확인'}
          </VerificationButton>
        </InputWrapper>
      </Container>
    </>
  );
};

export default EmailVerificationInputs;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const VerificationButton = styled.button`
  ${({ theme }) => theme.fonts.text.sm};
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  color: ${({ theme }) => theme.colors.gray[4]};
  background-color: white;
  padding: 4px 10px;
  &:disabled {
    border: none;
    background-color: ${({ theme }) => theme.colors.primary.default};
    color: white;
  }
`;
