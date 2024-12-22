'use client';
import TabBar from '@/components/TabBar';
import SettingListItem from '@/features/mypage/SettingListItem';
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Account } from '@/types/account';
import { getUser } from '@/lib/api/account';

const AccountSettingPage = () => {
  const { data: user } = useQuery<AxiosResponse<Account>>({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const router = useRouter();
  return (
    <>
      <TabBar />
      <Container>
        <SettingListItem name="이메일" text={user?.data.email || ''} />
        <SettingListItem
          name="비밀번호 변경"
          showButton={true}
          onClick={() => {
            router.push('/mypage/setting/password');
          }}
        />
      </Container>
    </>
  );
};

export default AccountSettingPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
