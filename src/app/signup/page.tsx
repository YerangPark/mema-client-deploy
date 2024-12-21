'use client';
import Logo from '/public/svgs/common/logo.svg';
import React, { useState } from 'react';
import { useInputState } from '@/lib/hooks/useInputState';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import useToggle from '@/lib/hooks/useToggle';
import NicknameInput from '@/features/account/signup/NicknameInput';
import TabBar from '@/components/TabBar';
import { Text } from '@/components/Modal/modalTypography';
import TitleWithDescription from '@/components/common/TitleWithDescription';
import EmailVerificationInputs from '@/features/account/EmailVerificationInputs';
import styled from 'styled-components';
import Button from '@/components/Button';
import PasswordInput from '@/features/account/PasswordInput';
import { useMutation } from '@tanstack/react-query';
import { sendEmail, signup, verifyCode } from '@/lib/api/account';

const passwordValidation = (value: string): boolean => {
  // 알파벳, 숫자 조합의 8~12자리 확인
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
  return passwordRegex.test(value);
};

const SignupPage = () => {
  const router = useRouter();
  const nickname = useInputState();
  const email = useInputState();
  const password = useInputState({ validate: passwordValidation });
  const verificationCode = useInputState();
  const [isVerified, setVerification] = useState(false);
  const [isEmailSent, setEmailSent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpenModal, toggleOpenModal] = useToggle();

  const next = () => {
    setCurrentStep((prev) => ++prev);
  };

  const sendEmailMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      // 이메일 요청 버튼 비활
      setEmailSent(true);
    },
    onError: (error) => {
      console.error('Send email failed:', error);
      setEmailSent(false);
    },
  });

  const handleRequestVerification = () => {
    if (!email.value) return;
    sendEmailMutation.mutate({
      email: email.value,
    });
  };

  const verifyCodeMutation = useMutation({
    mutationFn: verifyCode,
    onSuccess: () => {
      setVerification(true);
    },
    onError: (error) => {
      console.error('Send email failed:', error);
      setVerification(false);
    },
  });

  const handleVerifyCode = () => {
    if (!verificationCode.value) return;
    verifyCodeMutation.mutate({ email: email.value, code: verificationCode.value });
    setVerification(!isVerified);
  };

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toggleOpenModal();
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });

  const handleSignup = () => {
    if (!(email.value && password.value && nickname.value)) return;
    signupMutation.mutate({
      email: email.value,
      password: password.value,
      nickname: nickname.value,
    });
  };

  const steps = [
    {
      id: 1,
      content: (
        <>
          <Container>
            <EmailVerificationInputs
              onClickRequestVerification={handleRequestVerification}
              onClickVerifyCode={handleVerifyCode}
              email={email}
              verificationCode={verificationCode}
              isEmailSent={isEmailSent}
              isVerified={isVerified}
            />
            <PasswordInput password={password} />
          </Container>
          <StyledButton name="다음으로" disabled={!isVerified || !password.value} onClick={next} />
        </>
      ),
      description: '서비스를 이용하실 이메일과 비밀번호를 알려주세요!',
    },
    {
      id: 2,
      content: <NicknameInput nickname={nickname} onClickNext={handleSignup} />,
      description: '메마에서 사용하실 닉네임을 알려주세요!',
    },
  ];
  return (
    <>
      <TabBar />
      <TitleWithDescription
        title={
          <>
            어서오세요!
            <br />
            <Logo fill="#238AFF" /> 가 처음이신가요?
          </>
        }
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

export default SignupPage;

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
