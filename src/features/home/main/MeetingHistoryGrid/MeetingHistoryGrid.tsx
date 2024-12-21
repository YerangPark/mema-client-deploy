import React from 'react';
import styled from 'styled-components';
import MemberIconStack from '@/features/home/main/MemberIconStack';
import { useRouter } from 'next/navigation';
import { HomeMeetsResponse } from '@/types/meets';

type Props = {
  meets: HomeMeetsResponse;
};

const MeetingHistoryGrid = ({ meets }: Props) => {
  const router = useRouter();

  return (
    <Container>
      {meets.upcomingMeets.length > 0 && (
        <>
          <p className="title">곧 만나요!</p>
          <BlockContainer>
            {meets.upcomingMeets.map((meet) => (
              <MeetingBlock
                key={meet.meetId}
                $isActive={true}
                onClick={() => {
                  router.push(`/meet/${meet.meetId}`);
                }}
              >
                <p className="title">{meet.meetName}</p>
                <Row>
                  <p className="description">인원 {meet.memberCount}명</p>
                  <MemberIconStack members={meet.members} />
                </Row>
              </MeetingBlock>
            ))}
          </BlockContainer>
        </>
      )}

      {meets.pastMeets.length > 0 && (
        <>
          <p className="title">즐거웠어요!</p>
          <BlockContainer>
            {meets.pastMeets.map((meet) => (
              <MeetingBlock
                key={meet.meetId}
                $isActive={false}
                onClick={() => {
                  router.push(`/meet/${meet.meetId}`);
                }}
              >
                <p className="title">{meet.meetName}</p>
                <Row>
                  <p className="description">인원 {meet.memberCount}명</p>
                  <MemberIconStack members={meet.members} />
                </Row>
              </MeetingBlock>
            ))}
          </BlockContainer>
        </>
      )}
    </Container>
  );
};

export default MeetingHistoryGrid;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 150px;
  .title {
    ${({ theme }) => theme.fonts.title.sm};
    color: ${({ theme }) => theme.colors.gray[3]};
    margin-bottom: 10px;
  }
`;

const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 0 40px;
`;

const MeetingBlock = styled.div<{ $isActive: boolean }>`
  border-radius: 15px;
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary.lighter : theme.colors.gray[6]};
  padding: 16px;
  cursor: pointer;
  .title {
    ${({ theme }) => theme.fonts.title.xs};
    color: black;
  }
  .description {
    ${({ theme }) => theme.fonts.text.lg};
    color: ${({ theme, $isActive }) => ($isActive ? 'white' : theme.colors.gray[4])};
    margin-right: 10px;
    align-content: center;
  }
`;

const Row = styled.div`
  display: flex;
  align-content: center;
`;
