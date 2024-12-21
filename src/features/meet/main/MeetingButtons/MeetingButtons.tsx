import Button from '@/components/Button';
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { MeetStatus } from '@/types/meets';

type Props = {
  status: MeetStatus;
  meetId: number;
};

const MeetingButtons = ({ status, meetId }: Props) => {
  const router = useRouter();
  const buttonConfig = {
    SCHEDULE_BEFORE_USE: {
      mainButton: {
        name: '만나는 날짜 정하기',
        route: `/meet/${meetId}/schedule/create`,
      },
      subButtons: [],
    },
    SCHEDULE_CREATED_BUT_BEFORE_USE: {
      mainButton: {
        name: '만나는 날짜 정하기',
        route: `/meet/${meetId}/schedule/vote`,
      },
      subButtons: [],
    },
    // SCHEDULE_CREATED_BUT_EXPIRED: {
    //   mainButton: {
    //     name: '날짜 투표 현황 보기',
    //     route: `/meet/${meetId}/schedule`,
    //   },
    //   subButtons: [],
    // },
    SCHEDULE_AFTER_USE: {
      mainButton: {
        name: '날짜 투표 현황 보기',
        route: `/meet/${meetId}/schedule`,
      },
      subButtons: [],
    },
    PLACE_BEFORE_USE: {
      mainButton: {
        name: '만나는 장소 정하기',
        route: `/meet/${meetId}/place`,
      },
      subButtons: [{ name: '만나는 날짜 확인하기', route: `/meet/${meetId}/schedule` }],
    },
    PLACE_AFTER_USE: {
      mainButton: {
        name: '장소 입력 현황 보기',
        route: `/meet/${meetId}/place`,
      },
      subButtons: [{ name: '만나는 날짜 확인하기', route: `/meet/${meetId}/schedule` }],
    },
    BILL_BEFORE_MEET: {
      mainButton: {
        name: '정산하기',
        route: '/meet/1/bill',
      },
      subButtons: [
        { name: '날짜 확인하기', route: `/meet/${meetId}/schedule` },
        { name: '장소 확인하기', route: `/meet/${meetId}/place` },
      ],
    },
    BILL_AFTER_MEET: {
      mainButton: {
        name: '정산하기',
        route: '/meet/1/bill',
      },
      subButtons: [
        { name: '날짜 확인하기', route: `/meet/${meetId}/schedule` },
        { name: '장소 확인하기', route: `/meet/${meetId}/place` },
      ],
    },
  };

  const config = buttonConfig[status] || {
    mainButton: { name: '작업 없음', route: '/' },
    subButtons: [],
  };

  return (
    <ButtonContainer>
      <SubButtonContainer>
        {config.subButtons.map((subButton, index) => (
          <Button
            key={index}
            name={subButton.name}
            onClick={() => router.push(subButton.route)}
            buttonType="ghost"
          />
        ))}
      </SubButtonContainer>
      <Button name={config.mainButton.name} onClick={() => router.push(config.mainButton.route)} />
    </ButtonContainer>
  );
};

export default MeetingButtons;

const ButtonContainer = styled.div`
  position: fixed;
  width: 358px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 34px;
  @media (max-width: 390px) {
    width: calc(100% - 32px);
  }
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SubButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
