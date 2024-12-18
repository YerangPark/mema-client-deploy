import styled from 'styled-components';
import {
  Icon1,
  Icon2,
  Icon3,
  Icon4,
  Icon5,
  Icon6,
  Icon7,
  Icon8,
  Icon9,
  Icon10,
  Icon11,
  Icon12,
} from '@/assets/profileIcons/svg';
import React from 'react';

const badges = [
  { Icon: Icon1, goal: '메마 첫 가입' },
  { Icon: Icon2, goal: '첫 미팅 생성' },
  { Icon: Icon3, goal: '메마 방문 5회' },
  { Icon: Icon4, goal: '메마 방문 20회' },
  { Icon: Icon5, goal: '미팅 3회 생성' },
  { Icon: Icon6, goal: '미팅 5회 생성' },
  { Icon: Icon7, goal: '출발 위치 3회 입력' },
  { Icon: Icon8, goal: '출발 위치 5회 입력' },
  { Icon: Icon9, goal: '정산 3회 이용' },
  { Icon: Icon10, goal: '정산 10회 이용' },
  { Icon: Icon11, goal: '미팅 10회 생성' },
  { Icon: Icon12, goal: '메마 방문 50회' },
];

const BadgeCollection = () => {
  return (
    <BadgeContainer>
      {badges.map(({ Icon, goal }, index) => (
        <BadgeItem key={index}>
          <Icon />
          <p className="title">{goal}</p>
        </BadgeItem>
      ))}
    </BadgeContainer>
  );
};
export default BadgeCollection;

const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 10px 0 64px;
`;

const BadgeItem = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[6]};
  border-radius: 15px;
  padding: 16px 12px;
  svg {
    fill: ${({ theme }) => theme.colors.primary.default};
    width: 150px;
    height: 150px;
    margin-bottom: 16px;
  }
  .title {
    text-align: center;
    ${({ theme }) => theme.fonts.title['xs']};
  }
`;
