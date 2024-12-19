'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TabBar from '@/components/TabBar';
import { userMeetStore } from '@/store/userMeetStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  ScheduleResponse,
  CalendarMode,
  MyScheduleResponse,
  ScheduleStatus,
  UpdateScheduleData,
} from '@/types/schedules';
import { editSchedule, getAllSchedules, getMySchedules } from '@/lib/api/schedules';
import CalendarView from '@/features/meet/schedule/CalendarView';
import { MeetResponse } from '@/types/meets';
import { getMeet } from '@/lib/api/meets';
import { CALENDAR_MODE, SCHEDULE_STATUS } from '@/constants/scheduleConst';
import Modal from '@/components/Modal';
import { Text } from '@/components/Modal/modalTypography';
import { formatDate } from '@/lib/utils/dateUtils';
import useToggle from '@/lib/hooks/useToggle';
import styled from 'styled-components';
import Button from '@/components/Button';
import { ErrorResponse } from '@/types/error';

function EditSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const { getMeetMemberId } = userMeetStore();
  const { getMeetScheduleStatus } = userMeetStore();
  const meetId = params?.id && Number(params.id);
  const [isOpenModal, toggleOpenModal] = useToggle();
  const [isOpenExpiredModal, toggleExpiredModal] = useToggle();
  const myMeetMemberId = meetId ? getMeetMemberId(meetId) : null;
  const [status, setStatus] = useState<ScheduleStatus>(SCHEDULE_STATUS.IN_PROGRESS);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isFirstVote, setIsFirstVote] = useState(true);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>(CALENDAR_MODE.SELECT_MULTI);

  /** API - useMutation */
  const addOrEditDateVoteMutation = useMutation({
    mutationFn: editSchedule,
    onSuccess: () => {
      toggleOpenModal();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data.code === 'VD002') {
        toggleExpiredModal();
      }
      console.error('Error editing schedule:', error);
    },
  });

  const handleAddOrEditSchedule = useCallback(() => {
    if (!meetId || !myMeetMemberId) return;
    const data: UpdateScheduleData = {
      meetMemberId: myMeetMemberId,
      voteDates: getFormattedDates(selectedDates),
    };
    addOrEditDateVoteMutation.mutate({ meetId, data });
  }, [addOrEditDateVoteMutation, meetId, myMeetMemberId, selectedDates]);

  /** API - useQuery */
  const { data: meet } = useQuery<AxiosResponse<MeetResponse>>({
    queryKey: ['meet', meetId],
    queryFn: () => getMeet(meetId as number),
    enabled: meetId !== null,
  });

  const { data: schedules } = useQuery<AxiosResponse<ScheduleResponse>>({
    queryKey: ['schedules', meetId],
    queryFn: () => getAllSchedules(meetId as number),
    enabled: meetId !== null,
  });

  const { data: mySchedule } = useQuery<AxiosResponse<MyScheduleResponse>>({
    queryKey: ['mySchedule', meetId],
    queryFn: () => getMySchedules(meetId as number),
    enabled: meetId !== null,
  });

  /** useEffect */
  // 나의 스케줄 Date 형식으로 변환 및 첫 투표 여부 저장
  useEffect(() => {
    if (!mySchedule) return;
    const dates = mySchedule.data.date.map((dateString) => new Date(dateString));
    setIsFirstVote(false);
    setSelectedDates(dates);
  }, [mySchedule]);

  // 미팅 상태 불러오기
  useEffect(() => {
    if (!meetId) return;
    setStatus((prevStatus) => getMeetScheduleStatus(meetId) ?? prevStatus);
  }, [meetId, getMeetScheduleStatus]);

  // 미팅 상태에 따른 스케줄 모드 변경
  useEffect(() => {
    switch (status) {
      case SCHEDULE_STATUS.IN_PROGRESS:
        setCalendarMode(CALENDAR_MODE.VIEW);
        break;
      case SCHEDULE_STATUS.NEED_REVOTE:
        setCalendarMode(CALENDAR_MODE.SELECT_MULTI);
        break;
      case SCHEDULE_STATUS.NEED_COMPLETE:
        setCalendarMode(CALENDAR_MODE.SELECT_ONE);
        break;
      case SCHEDULE_STATUS.COMPLETED:
        setCalendarMode(CALENDAR_MODE.VIEW);
        break;
    }
  }, [status]);

  // Custom Functions
  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const handleClickDate = (date: Date) => {
    setSelectedDates((prev) => {
      const exists = prev.some((selectedDate) => isSameDate(selectedDate, date));

      if (exists) {
        return prev.filter((selectedDate) => !isSameDate(selectedDate, date));
      } else {
        return [...prev, date];
      }
    });
  };

  const getFormattedDates = (dates: Date[]) => {
    return dates.map((date) => formatDate(date, 'YYYY-MM-DD'));
  };

  if (!meet || !schedules || !meetId) return;

  return (
    <>
      <TabBar onClickBack={() => router.push(`/meet/${meetId}`)} />
      <CalendarView
        calendarMode={calendarMode}
        status={status}
        mySelectedDates={selectedDates}
        allSchedule={schedules.data}
        onChangeDate={handleClickDate}
        meetId={meetId}
      />
      <StyledButton
        name={isFirstVote ? '선택 완료!' : '수정하기'}
        onClick={handleAddOrEditSchedule}
        disabled={selectedDates.length === 0}
      />
      {isOpenModal && (
        <Modal type="Ok" onOk={() => router.push(`/meet/${meetId}/schedule`)} width={326}>
          <Text>{isFirstVote ? '투표를 완료했어요!' : '수정을 완료했어요!'}</Text>
        </Modal>
      )}
      {isOpenExpiredModal && (
        <Modal
          type="Ok"
          okButtonName="미팅 현황 보러 가기"
          onOk={() => router.push(`/meet/${meetId}/schedule`)}
          width={326}
        >
          <Text>투표가 만료되었어요!</Text>
        </Modal>
      )}
    </>
  );
}

export default EditSchedulePage;

const StyledButton = styled(Button)`
  position: absolute;
  bottom: 34px;
  width: calc(100% - 32px);
`;
