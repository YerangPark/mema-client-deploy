'use client';
import TabBar from '@/components/TabBar';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import React from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import MyPageCounter from '@/features/mypage/MyPageCounter';
import MyPageProfileIcon from '@/features/mypage/MyPageProfileIcon/MyPageProfileIcon';
import NicknameButton from '@/features/mypage/NicknameButton/NicknameButton';
import { Account } from '@/types/account';
import { getUser } from '@/lib/api/account';
import { AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';

const MyPage = () => {
  const router = useRouter();

  const { data: user } = useQuery<AxiosResponse<Account>>({
    queryKey: ['user'],
    queryFn: getUser,
  });

  return (
    <>
      <TabBar
        leftType="logo"
        rightType="settingBtn"
        onClick={() => router.push('/mypage/setting')}
      />
      <Container>
        <MyPageProfileIcon
          puzzleId={user?.data.puzzleId || 0}
          puzzleColor={user?.data.puzzleColor || 'blue'}
        />
        <NicknameButton nickname={user?.data.nickname || ''} />
        <MyPageCounter
          meetCount={user?.data.meetCount || 0}
          visitCount={user?.data.visitCount || 0}
          badgeCount={user?.data.badgeCount || 0}
        />
      </Container>
      <BottomNavigation tab="mypage" />
    </>
  );
};

export default MyPage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 150px;
`;
