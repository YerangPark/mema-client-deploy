'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import IntroButtons from '@/features/Intro/IntroButtons';
import WelcomeHeader from '@/features/Intro/WelcomeHeader';
import TabBar from '@/components/TabBar';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import MeetingHistoryNull from '@/features/home/main/MeetingHistoryNull';
import BottomNavigation from '@/components/BottomNavigation';
import { ChevronRight } from 'react-feather';
import MeetingHistoryGrid from '@/features/home/main/MeetingHistoryGrid';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { HomeMeetsResponse } from '@/types/meets';
import { getHomeMeets } from '@/lib/api/meets';
import Modal from '@/components/Modal';
import { DisabledText, Emphasize, Text } from '@/components/Modal/modalTypography';
import useToggle from '@/lib/hooks/useToggle';
import { MAX_UPCOMING_MEET_COUNT } from '@/constants/meetConst';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpenModal, toggleModal] = useToggle();

  useEffect(() => {
    // 이메일 로그인 : 로컬 스토리지
    const token = localStorage.getItem('authToken');

    // 소셜 로그인 : 쿠키
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const sessionId = getCookie('JSESSIONID');

    if (token || sessionId) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const { data: meets } = useQuery<AxiosResponse<HomeMeetsResponse>>({
    queryKey: ['meets'],
    queryFn: getHomeMeets,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <>
        <WelcomeHeader />
        <IntroButtons />
      </>
    );
  }

  const meetingCreateHandler = () => {
    if (!meets || meets.data.upcomingMeets.length < MAX_UPCOMING_MEET_COUNT) {
      router.push('/meet/create');
    } else {
      toggleModal();
    }
  };

  return (
    <>
      <TabBar leftType="logo" />
      <Button
        buttonType="ghost"
        name="참여코드 입력하기"
        onClick={() => router.push('/meet/join')}
      />
      {!meets ? (
        <MeetingHistoryNull />
      ) : (
        <>
          <RecentMeetingTitle>
            <p>최근 미팅 내역</p>
            <ChevronRight
              onClick={() => {
                router.push('/meet/management');
              }}
            />
          </RecentMeetingTitle>
          <MeetingHistoryGrid meets={meets.data} />
        </>
      )}
      <StyledButton name="미팅 만들기" onClick={meetingCreateHandler} />
      <BottomNavigation />
      {isOpenModal && (
        <Modal type="Ok" onOk={toggleModal} width={326}>
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
}

const StyledButton = styled(Button)`
  position: fixed;
  bottom: 106px;
  z-index: 50;
  width: calc(390px - 32px);
`;

const RecentMeetingTitle = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.fonts.title.md};
  margin: 38px 0 20px;

  svg {
    padding: 4px;
    cursor: pointer;
  }
`;
