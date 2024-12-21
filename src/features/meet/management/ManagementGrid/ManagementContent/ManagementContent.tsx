'use client';
import Button from '@/components/Button';
import { Meet } from '@/types/meets';
import { useRouter } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

type ManagementContentProps = {
  meet: Meet;
  onDelete: (id: number) => void;
};

function ManagementContent({ meet, onDelete }: ManagementContentProps) {
  const router = useRouter();
  console.log(meet);

  return (
    <Container>
      <p className="title">{meet.meetName}</p>
      <p className="totalPerson">인원 {meet.memberCount}명</p>
      <div className="person">
        {meet.members.map((user, index) => (
          <p key={user.userInfo.userId}>
            {user.userInfo.nickname}
            {index !== meet.memberCount - 1 && ','}
          </p>
        ))}
      </div>
      <div className="btnGroup">
        <Button name="미팅 삭제" buttonType="gray" onClick={() => onDelete(meet.meetId)} />
        <Button name="미팅명 변경" onClick={() => router.push(`/meet/management/${meet.meetId}`)} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.gray[6]};
  .title {
    ${({ theme }) => theme.fonts.title['xs']};
    margin-bottom: 20px;
  }
  .totalPerson {
    margin-bottom: 4px;
    ${({ theme }) => theme.fonts.text['lg']};
    color: ${({ theme }) => theme.colors.gray[3]};
  }
  .person {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }
  .btnGroup {
    display: flex;
    gap: 8px;
  }
`;

export default ManagementContent;
