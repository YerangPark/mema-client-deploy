'use client';
import React from 'react';
import styled from 'styled-components';
import DateTimePicker from '@/components/DateTimePicker';
import Button from '@/components/Button';

type VoteDueDateProps = {
  onClickNext: () => void;
  date: Date;
  onChange: (date: Date) => void;
};

const VoteDueDate = ({ onClickNext, date, onChange }: VoteDueDateProps) => {
  return (
    <>
      <Container>
        <p className="title">언제까지 투표할까요?</p>
        <p className="description">
          날짜 투표 마감할 시간을 알려주세요
          <br />
          기한은 다음달까지 설정할 수 있어요.
        </p>
      </Container>
      <DateTimePicker date={date} onChange={onChange} />
      <StyledButton name="다음으로" onClick={onClickNext} />
    </>
  );
};

export default VoteDueDate;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px 0 50px;
  gap: 10px;

  .title {
    ${({ theme }) => theme.fonts.title.md};
  }
  .description {
    ${({ theme }) => theme.fonts.text.lg};
  }
`;

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
