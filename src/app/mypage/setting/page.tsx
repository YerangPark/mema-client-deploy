'use client';
import TabBar from '@/components/TabBar';
import styled from 'styled-components';
import SettingListItem from '@/features/mypage/SettingListItem';
import Modal from '@/components/Modal';
import { DisabledText, Text } from '@/components/Modal/modalTypography';
import React from 'react';
import useToggle from '@/lib/hooks/useToggle';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { resign } from '@/lib/api/account';

const SettingMyPage = () => {
  const router = useRouter();
  const [isOpenLogoutModal, toggleLogoutModal] = useToggle();
  const [isOpenDeleteAccountModal, toggleDeleteAccountModal] = useToggle();
  const [isOpenDeleteCompleteModal, toggleDeleteCompleteModal] = useToggle();

  const resignMutation = useMutation({
    mutationFn: resign,
    onSuccess: () => {
      toggleDeleteAccountModal();
      toggleDeleteCompleteModal();
    },
  });

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    router.push('/');
  };

  const handleDeleteAccount = () => {
    resignMutation.mutate();
  };

  return (
    <>
      <TabBar />
      <Container>
        <SettingListItem
          name="계정 관리"
          showButton={true}
          onClick={() => {
            router.push('/mypage/setting/account');
          }}
        />
        <SettingListItem
          name="약관 및 정책"
          showButton={true}
          onClick={() => {
            router.push('/mypage/setting/terms');
          }}
        />
        <SettingListItem name="로그아웃" onClick={toggleLogoutModal} />
        <SettingListItem name="탈퇴하기" onClick={toggleDeleteAccountModal} />
      </Container>
      {isOpenLogoutModal && (
        <Modal
          type="OkCancel"
          okButtonName="로그아웃"
          closeButtonName="취소"
          onOk={handleLogout}
          onClose={toggleLogoutModal}
          width={326}
        >
          <Text>로그아웃하시겠어요?</Text>
        </Modal>
      )}
      {isOpenDeleteAccountModal && (
        <Modal
          type="OkCancel"
          okButtonName="삭제하기"
          closeButtonName="취소"
          onOk={handleDeleteAccount}
          onClose={toggleDeleteAccountModal}
          width={326}
        >
          <Text>계정을 삭제하시겠어요?</Text>
          <DisabledText>삭제하면 계정을 복구할 수 없어요.</DisabledText>
        </Modal>
      )}
      {isOpenDeleteCompleteModal && (
        <Modal type="Ok" okButtonName="확인" onOk={handleLogout} width={326}>
          <Text>계정이 삭제되었습니다.</Text>
        </Modal>
      )}
    </>
  );
};
export default SettingMyPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
