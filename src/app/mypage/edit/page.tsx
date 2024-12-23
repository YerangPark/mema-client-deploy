'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import MyPageProfileIcon from '@/features/mypage/MyPageProfileIcon/MyPageProfileIcon';
import TabBar from '@/components/TabBar';
import { useInputState } from '@/lib/hooks/useInputState';
import MyPageNicknameInput from '@/features/mypage/MyPageNicknameInput';
import OwnedBadgeGrid from '@/features/mypage/OwnedBadgeGrid';
import ColorPalette from '@/features/mypage/ColorPalette';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Account, Badges } from '@/types/account';
import { getBadges, getUser, updateUser } from '@/lib/api/account';
import { MAX_BADGE_COUNT } from '@/constants/accountConst';
import Button from '@/components/Button';
import useToggle from '@/lib/hooks/useToggle';
import Modal from '@/components/Modal';
import { Text } from '@/components/Modal/modalTypography';
import { useRouter } from 'next/navigation';

const EditMyPage = () => {
  const router = useRouter();
  const nickname = useInputState();
  const [puzzleId, setPuzzleId] = useState<number>(1);
  const [puzzleColor, setPuzzleColor] = useState<string>('blue');
  const [isOpenModal, toggleOpenModal] = useToggle();

  const { data: user } = useQuery<AxiosResponse<Account>>({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const { data: badges } = useQuery<AxiosResponse<Badges>>({
    queryKey: ['badges'],
    queryFn: getBadges,
  });

  const updateMyPageMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toggleOpenModal();
    },
  });

  const handleUpdate = useCallback(() => {
    updateMyPageMutation.mutate({
      nickname: nickname.value,
      puzzleId,
      puzzleColor,
    });
  }, [nickname.value, puzzleId, puzzleColor, updateMyPageMutation]);

  const getActiveBadges = () => {
    if (!badges) return [1];
    return Array.from({ length: MAX_BADGE_COUNT })
      .map((_, i) => i + 1)
      .filter((badgeNumber) => badges.data[`badge${badgeNumber}` as keyof Badges]);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    nickname.setValue(user.data.nickname);
    setPuzzleId(user.data.puzzleId);
    setPuzzleColor(user.data.puzzleColor);
  }, [user]);

  return (
    <>
      <TabBar />
      <Container>
        <MyPageProfileIcon puzzleId={puzzleId} puzzleColor={puzzleColor} />
        <MyPageNicknameInput nickname={nickname} />
        <OwnedBadgeGrid
          selectedId={puzzleId}
          ownedBadges={getActiveBadges()}
          onClick={(id: number) => setPuzzleId(id)}
        />
        <ColorPalette
          selectedColor={puzzleColor}
          onClick={(color: string) => setPuzzleColor(color)}
        />
      </Container>
      <StyledButton name="수정하기" onClick={handleUpdate} />
      {isOpenModal && (
        <Modal type="Ok" onOk={() => router.back()} width={326}>
          <Text>수정되었어요!</Text>
        </Modal>
      )}
    </>
  );
};
export default EditMyPage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 100px;
`;

const StyledButton = styled(Button)`
  position: fixed;
  bottom: 34px;
  width: 358px;
  @media (max-width: 390px) {
    width: calc(100% - 32px);
  }
`;
