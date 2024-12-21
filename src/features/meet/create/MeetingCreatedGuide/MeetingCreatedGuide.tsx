import React from 'react';
import CreateMeetingIcon from '@/assets/icons/svg/create.svg';
import styled from 'styled-components';

const MeetingCreatedGuide = () => {
  return (
    <>
      <Container>
        <CreateMeetingIcon />
        <p className="title">미팅이 생성되었어요!</p>
        <p className="description">
          함께하고 싶은 사람들에게
          <br />
          참여 코드를 공유해요!
        </p>
      </Container>
    </>
  );
};
export default MeetingCreatedGuide;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 70px 0 150px;
  text-align: center;
  svg {
    margin-bottom: 50px;
    width: 160px;
    height: 252px;
  }
  .title {
    margin-bottom: 10px;
    ${({ theme }) => theme.fonts.title.md};
  }
  .description {
    ${({ theme }) => theme.fonts.text.lg};
  }
`;
