'use client';
import React, { useState } from 'react';
import TabBar from '@/components/TabBar';
import TitleWithDescription from '@/components/common/TitleWithDescription';
import MeetingNameInput from '@/features/meet/create/MeetingNameInput';
import { useInputState } from '@/lib/hooks/useInputState';
import styled from 'styled-components';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import MeetingCreatedGuide from '@/features/meet/create/MeetingCreatedGuide';
import Modal from '@/components/Modal';
import { DisabledText, Emphasize, LargeText, Text } from '@/components/Modal/modalTypography';
import useToggle from '@/lib/hooks/useToggle';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useMutation } from '@tanstack/react-query';
import { createMeet } from '@/lib/api/meets';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/error';

const CreateMeetingPage = () => {
  const router = useRouter();
  const meetingName = useInputState();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpenCopyCompleteModal, toggleCopyCompleteModal] = useToggle();
  const [isOpenMeetLimitModal, toggleMeetLimitModal] = useToggle();
  const [joinCode, setJoinCode] = useState('');

  const next = () => {
    setCurrentStep((prev) => ++prev);
  };

  const createMeetMutation = useMutation({
    mutationFn: createMeet,
    onSuccess: (res) => {
      setJoinCode(res.data.meetCode);
      next();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.status === 400 && error.response && error.response.data.code === 'M005') {
        toggleMeetLimitModal();
      }
    },
  });

  const handleCreateMeet = () => {
    if (!meetingName) return;
    createMeetMutation.mutate({ meetName: meetingName.value });
  };

  const steps = [
    {
      id: 1,
      contents: (
        <>
          <TitleWithDescription
            title="새로운 미팅의 이름을 알려주세요!"
            description="미팅 이름은 최대 8글자까지 설정할 수 있어요"
          />
          <MeetingNameInput meetingName={meetingName} />
          <StyledButton name="다음으로" disabled={!meetingName.value} onClick={handleCreateMeet} />
        </>
      ),
    },
    {
      id: 2,
      contents: (
        <>
          <MeetingCreatedGuide />
          <CopyToClipboard text={joinCode} onCopy={toggleCopyCompleteModal}>
            <TextButton>참여 코드 복사하기</TextButton>
          </CopyToClipboard>
          <StyledButton
            name="홈으로"
            disabled={!meetingName.value}
            onClick={() => router.push('/')}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <TabBar />
      {steps[currentStep].contents}
      {isOpenCopyCompleteModal && (
        <Modal type="Ok" onOk={toggleCopyCompleteModal} width={326}>
          <Text>
            참여코드 복사 완료!
            <br />
          </Text>
          <LargeText>{joinCode}</LargeText>
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

export default CreateMeetingPage;

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

const TextButton = styled.p`
  ${({ theme }) => theme.fonts.text['2xl']};
  color: ${({ theme }) => theme.colors.gray[4]};
  cursor: pointer;
  bottom: 110px;
  text-align: center;
  width: fit-content;
  margin: 0 auto;
  left: 0;
  right: 0;
  position: fixed;
  @media (max-width: 390px) {
    width: calc(100% - 32px);
  }
`;
