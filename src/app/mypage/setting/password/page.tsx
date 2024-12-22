'use client';
import TabBar from '@/components/TabBar';
import TitleWithDescription from '@/components/common/TitleWithDescription';
import Modal from '@/components/Modal';
import { Text } from '@/components/Modal/modalTypography';
import React, { useCallback } from 'react';
import useToggle from '@/lib/hooks/useToggle';
import styled from 'styled-components';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import PasswordInput from '@/features/account/PasswordInput';
import { useInputState } from '@/lib/hooks/useInputState';
import { passwordValidation } from '@/lib/utils/validations';
import { useMutation } from '@tanstack/react-query';
import { updatePassword } from '@/lib/api/account';

const EditPasswordPage = () => {
  const router = useRouter();
  const [isModalOpen, toggleModal] = useToggle();
  const password = useInputState({ validate: passwordValidation });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toggleModal();
    },
  });

  const handleUpdate = useCallback(() => {
    updatePasswordMutation.mutate({
      password: password.value,
    });
  }, [password.value, updatePasswordMutation]);

  return (
    <>
      <TabBar />
      <TitleWithDescription
        title="비밀번호를 잊으셨나요?"
        description="새로운 비밀번호를 입력해주세요"
      />
      <PasswordInput password={password} />
      <StyledButton name="변경하기" onClick={handleUpdate} disabled={!password.value} />
      {isModalOpen && (
        <Modal
          type="Ok"
          okButtonName="확인"
          onOk={() => {
            router.back();
          }}
          width={326}
        >
          <Text>비밀번호가 변경되었어요!</Text>
        </Modal>
      )}
    </>
  );
};
export default EditPasswordPage;

const StyledButton = styled(Button)`
  position: absolute;
  bottom: 34px;
  width: calc(100% - 32px);
`;
