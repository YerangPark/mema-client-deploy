'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import { formatDate, isSameDate } from '@/lib/utils/dateUtils';
import CustomCalendar from '@/components/CustomCalendar/CustomCalendar';
import { CALENDAR_MODE, MAX_SCHEDULE_SELECTABLE_DATE } from '@/constants/scheduleConst';

type Props = {
  type: 'create' | 'edit';
  onClickComplete: () => void;
  mySelectedDates: Date[];
  onChangeDates: (dates: Date[]) => void;
};

const CreateCalendarView = ({
  type = 'create',
  onClickComplete,
  mySelectedDates,
  onChangeDates,
}: Props) => {
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | null>(null);

  const onClickDate = (clickedDate: Date) => {
    const isAlreadySelected = mySelectedDates.some((date) => isSameDate(date, clickedDate));
    if (isAlreadySelected) {
      setLastSelectedDate(null);
    } else {
      setLastSelectedDate(clickedDate);
    }
  };

  return (
    <>
      <Container>
        <p className="title">
          만남이 가능한 날짜를
          <br />
          모두 선택해주세요!
        </p>

        <CustomCalendar
          mode={CALENDAR_MODE.SELECT_MULTI}
          voteStartDay={new Date()}
          mySelectedDates={mySelectedDates}
          maxSelectableDate={MAX_SCHEDULE_SELECTABLE_DATE}
          onChangeSelected={(dates) => onChangeDates(dates)}
          onClick={onClickDate}
        />

        <StyledDiv>
          {mySelectedDates.length === 0 || lastSelectedDate === null ? (
            <p className="grayish-desc">
              날짜를 선택하면 그 날에
              <br />
              누구와 만날 수 있는지 알 수 있어요!
            </p>
          ) : (
            <>
              <span className="emphasize-desc">{formatDate(lastSelectedDate, 'MM월 DD일')}</span>
              에 만날 수 있는 사람은 아직 없어요.
              <br />
              <span className="bold-desc"></span>
            </>
          )}
        </StyledDiv>
        {type === 'create' ? (
          <StyledButton
            name="선택 완료!"
            onClick={onClickComplete}
            disabled={mySelectedDates.length === 0}
          />
        ) : (
          <StyledButton name="수정하기" onClick={onClickComplete} />
        )}
      </Container>
    </>
  );
};

export default CreateCalendarView;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
  .title {
    ${({ theme }) => theme.fonts.title.md};
    margin: 20px 0 20px;
  }
`;

const StyledDiv = styled.div`
  padding: 12px 16px;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.colors.gray[6]};
  border-radius: 15px;
  color: black;
  ${({ theme }) => theme.fonts.text.xl};
  .grayish-desc {
    ${({ theme }) => theme.fonts.text.xl};
    color: ${({ theme }) => theme.colors.gray[2]};
  }
  .emphasize-desc {
    ${({ theme }) => theme.fonts.title.xs};
    color: ${({ theme }) => theme.colors.primary.default};
  }
  .bold-desc {
    ${({ theme }) => theme.fonts.title.xs};
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
