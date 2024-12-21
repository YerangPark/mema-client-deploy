'use client';
import React, { useState } from 'react';
import TabBar from '@/components/TabBar';
import Button from '@/components/Button';
import MeetingJoinGuide from '@/features/meet/join/MeetingJoinGuide';
import JoinCodeInput from '@/features/meet/join/JoinCodeInput';
import { useInputState } from '@/lib/hooks/useInputState';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { DisabledText, Emphasize, Text } from '@/components/Modal/modalTypography';
import useToggle from '@/lib/hooks/useToggle';
import { useMutation } from '@tanstack/react-query';
import { joinMeet } from '@/lib/api/meets';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/error';

const JoinMeetingPage = () => {
  const router = useRouter();
  const joinCode = useInputState();
  const [isOpenInvalidCodeModal, toggleInvalidCodeModal] = useToggle();
  const [isOpenMeetLimitModal, toggleMeetLimitModal] = useToggle();
  const [errorMessage, setErrorMessage] = useState('유효하지 않은 참여 코드에요!');

  const joinMeetMutation = useMutation({
    mutationFn: joinMeet,
    onSuccess: () => {
      router.push('/');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data) {
        switch (error.response?.data.code) {
          case 'U002':
            setErrorMessage('이미 등록된 미팅이에요!');
            break;
          case 'ME002':
            setErrorMessage('유효하지 않은 참여 코드에요!');
            break;
          case 'M005':
            toggleMeetLimitModal();
            break;
          default:
            setErrorMessage('유효하지 않은 참여 코드에요!');
        }
      }
      toggleInvalidCodeModal();
    },
  });

  const handleJoinMeet = () => {
    if (!joinCode.value) {
      toggleInvalidCodeModal();
      return;
    }
    joinMeetMutation.mutate({ joinCode: joinCode.value });
  };

  return (
    <>
      <TabBar />
      <MeetingJoinGuide />
      <JoinCodeInput joinCode={joinCode} />
      <StyledButton name="입력 완료" disabled={!joinCode.value} onClick={handleJoinMeet} />
      {isOpenInvalidCodeModal && (
        <Modal type="Ok" onOk={toggleInvalidCodeModal} width={326}>
          <Text>{errorMessage}</Text>
        </Modal>
      )}
      {isOpenMeetLimitModal && (
        <Modal type="Ok" onOk={() => router.push('/')} width={326}>
          <Text>
            미팅은 <Emphasize>최대 4개</Emphasize>까지 생성 가능해요!
          </Text>
          <DisabledText>
            기존 미팅이 끝나면
            <br />
            추가로 생성할 수 있어요.
          </DisabledText>
        </Modal>
      )}
    </>
  );
};

export default JoinMeetingPage;

const StyledButton = styled(Button)`
  position: fixed;
  width: 358px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 34px;
  @media (max-width: 390px) {
    width: calc(100% - 32px);
  }
`;
