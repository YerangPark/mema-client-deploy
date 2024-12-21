'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDate } from '@/lib/utils/dateUtils';
import CustomCalendar from '@/components/CustomCalendar/CustomCalendar';
import { ScheduleResponse, CalendarMode, ScheduleStatus, VoteDate } from '@/types/schedules';
import {
  CALENDAR_MODE,
  MAX_SCHEDULE_SELECTABLE_DATE,
  SCHEDULE_STATUS,
} from '@/constants/scheduleConst';
import CalendarTitle from '@/features/meet/schedule/CalendarTitle';
import { userMeetStore } from '@/store/userMeetStore';

type VoteDatesProps = {
  calendarMode: CalendarMode;
  status: ScheduleStatus;
  allSchedule: ScheduleResponse;
  mySelectedDates: Date[];
  onChangeDate: (dates: Date) => void;
  fixedDate?: Date;
  meetId: number;
};

const CalendarView = ({
  calendarMode,
  status = SCHEDULE_STATUS.IN_PROGRESS,
  allSchedule,
  mySelectedDates,
  onChangeDate,
  meetId,
  fixedDate,
}: VoteDatesProps) => {
  const [nicknameList, setNicknameList] = useState<string[]>([]);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const { getMeetMemberId } = userMeetStore();

  const hasUserVotedSchedule = (schedules: VoteDate[], memberId: number | null): boolean => {
    return schedules.some((voteDate) =>
      voteDate.members.some((member) => member.meetMemberId === memberId),
    );
  };

  const othersSelectedDates = () => {
    if (calendarMode !== CALENDAR_MODE.SELECT_MULTI) return allSchedule.voteDates;
    const myMeetMemberId = getMeetMemberId(meetId);
    return allSchedule.voteDates
      .map((voteDate) => ({
        ...voteDate,
        members: voteDate.members.filter((member) => member.meetMemberId !== myMeetMemberId),
      }))
      .filter((voteDate) => voteDate.members.length > 0);
  };

  const onClickHandler = (date: Date) => {
    onChangeDate(date);
    if (
      calendarMode === CALENDAR_MODE.VIEW &&
      mySelectedDates.some((selectedDate) => selectedDate.getTime() === date.getTime())
    ) {
      setClickedDate(null);
    } else {
      setClickedDate(date);
    }
    const clickedDateString = formatDate(date, 'YYYY-MM-DD');
    const votedNicknameList = othersSelectedDates()
      .filter((voteDate) => voteDate.date === clickedDateString)
      .flatMap((voteDate) => voteDate.members.map((member) => member.meetMemberName));
    setNicknameList(votedNicknameList);
  };

  return (
    <>
      <Container>
        <CalendarTitle
          status={status}
          date={fixedDate}
          voted={hasUserVotedSchedule(allSchedule.voteDates, getMeetMemberId(meetId))}
        />
        <CustomCalendar
          mode={calendarMode}
          voteStartDay={new Date()}
          allSelectedDates={othersSelectedDates().map((voteDate) => new Date(voteDate.date))}
          mySelectedDates={fixedDate ? [fixedDate] : mySelectedDates}
          maxSelectableDate={MAX_SCHEDULE_SELECTABLE_DATE}
          onClick={onClickHandler}
          clickedDate={clickedDate}
        />
        <Description>
          {clickedDate ? (
            nicknameList.length > 0 ? (
              <>
                <span className="emphasize-desc">{formatDate(clickedDate, 'MM월 DD일')}</span>
                에 만날 수 있는 사람은
                <br />
                <span className="bold-desc">
                  {nicknameList.map((nickname, index) =>
                    index === nicknameList.length - 1 ? `${nickname}` : `${nickname}, `,
                  )}{' '}
                  이에요.
                </span>
              </>
            ) : (
              <>
                <span className="emphasize-desc">{formatDate(clickedDate, 'MM월 DD일')}</span>에
                만날 수 있는 사람은 아직 없어요.
              </>
            )
          ) : (
            <p className="grayish-desc">
              날짜를 선택하면 그 날에
              <br />
              누구와 만날 수 있는지 알 수 있어요!
            </p>
          )}
        </Description>
      </Container>
    </>
  );
};

export default CalendarView;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
`;

const Description = styled.div`
  padding: 12px 16px;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.colors.gray[6]};
  border-radius: 15px;
  color: black;
  ${({ theme }) => theme.fonts.text.xl};
  .grayish-desc {
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
