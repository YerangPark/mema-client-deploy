'use client';
import React, { useState } from 'react';
import { useInputState } from '@/lib/hooks/useInputState';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import useToggle from '@/lib/hooks/useToggle';
import TabBar from '@/components/TabBar';
import PasswordInput from '../../features/account/PasswordInput';
import { Text } from '@/components/Modal/modalTypography';
import TitleWithDescription from '@/components/common/TitleWithDescription';
import EmailVerificationInputs from '../../features/account/EmailVerificationInputs';
import styled from 'styled-components';
import Button from '@/components/Button';

const FindPwPage = () => {
  const router = useRouter();
  const email = useInputState();
  const password = useInputState();
  const verificationCode = useInputState();

  const [currentStep, setCurrentStep] = useState(0);
  const [isOpenModal, toggleOpenModal] = useToggle();
  const [isVerified, setVerification] = useState(false);
  const [isEmailSent, setEmailSent] = useState(false);

  const next = () => {
    setCurrentStep((prev) => ++prev);
  };

  const handleRequestVerification = () => {
    console.log('이메일 인증 요청 보내기');
    setVerification(!isVerified);
  };

  const handleVerifyCode = () => {
    console.log('인증 코드 검증');
    setVerification(!isVerified);
  };

  const steps = [
    {
      id: 1,
      content: (
        <>
          <EmailVerificationInputs
            onClickRequestVerification={handleRequestVerification}
            onClickVerifyCode={handleVerifyCode}
            email={email}
            verificationCode={verificationCode}
            isEmailSent={isEmailSent}
            isVerified={isVerified}
          />
          <StyledButton name="다음으로" disabled={!isVerified} onClick={next} />
        </>
      ),
      description: '비밀번호 재설정을 위해 이메일 인증을 해야해요',
    },
    {
      id: 2,
      content: (
        <>
          <PasswordInput password={password} />
          <StyledButton name="변경하기" disabled={!password.value} onClick={toggleOpenModal} />
        </>
      ),
      description: '새로운 비밀번호를 입력해주세요',
    },
  ];
  return (
    <>
      <TabBar />
      <TitleWithDescription
        title="비밀번호를 잊으셨나요?"
        description={steps[currentStep].description}
      />
      {steps[currentStep].content}
      {isOpenModal && (
        <Modal
          type="Ok"
          okButtonName="로그인하기"
          onOk={() => {
            router.push('/login');
          }}
          width={326}
        >
          <Text>메마에 온 것을 환영합니다!</Text>
        </Modal>
      )}
    </>
  );
};

export default FindPwPage;

const StyledButton = styled(Button)`
  position: absolute;
  bottom: 34px;
  width: calc(100% - 32px);
`;
