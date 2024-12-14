'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import MyPageProfileIcon from '@/features/mypage/MyPageProfileIcon/MyPageProfileIcon';
import TabBar from '@/components/TabBar';
import { useInputState } from '@/hooks/useInputState';
import MyPageNicknameInput from '@/features/mypage/MyPageNicknameInput';
import OwnedBadgeGrid from '@/features/mypage/OwnedBadgeGrid';
import ColorPalette from '@/features/mypage/ColorPalette';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Account } from '@/types/account';
import { getUser, updateUser } from '@/lib/api/account';
import Button from '@/components/Button';

const EditMyPage = () => {
  const nickname = useInputState();
  const [puzzleId, setPuzzleId] = useState<number>(1);
  const [puzzleColor, setPuzzleColor] = useState<string>('blue');
  const { data: user } = useQuery<AxiosResponse<Account>>({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const updateMyPageMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {},
  });

  const handleUpdate = useCallback(() => {
    updateMyPageMutation.mutate({
      nickname: nickname.value,
      puzId: puzzleId,
      puzColor: puzzleColor,
    });
  }, [nickname.value, puzzleId, puzzleColor, updateMyPageMutation]);

  useEffect(() => {
    if (!user) {
      return;
    }
    nickname.setValue(user.data.nickname);
    setPuzzleId(user.data.puzId);
    setPuzzleColor(user.data.puzColor);
  }, [user]);

  return (
    <>
      <TabBar />
      <Container>
        {/*<MyPageProfileIcon puzzleId={user?.puzzleId} puzzleColor={user?.puzzleColor} />*/}
        {/*<MyPageNicknameInput nickname={nickname} />*/}
        {/*<OwnedBadgeGrid selectedId={user?.puzzleId} ownedBadges={user?.badgeList} />*/}
        {/*<ColorPalette selectedColor={user?.puzzleColor} />*/}
        <MyPageProfileIcon puzzleId={puzzleId} puzzleColor={puzzleColor} />
        <MyPageNicknameInput nickname={nickname} />
        <OwnedBadgeGrid
          selectedId={puzzleId}
          ownedBadges={[1, 2, 4, 6, 9]}
          onClick={(id: number) => setPuzzleId(id)}
        />
        <ColorPalette
          selectedColor={puzzleColor}
          onClick={(color: string) => setPuzzleColor(color)}
        />
      </Container>
      <StyledButton name="수정하기" onClick={handleUpdate} />
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
