'use client';
import React, { useCallback, useEffect, useState } from 'react';
import useToggle from '@/lib/hooks/useToggle';
import Modal from '@/components/Modal';
import { Emphasize, Text } from '@/components/Modal/modalTypography';
import { useParams, useRouter } from 'next/navigation';
import CalendarView from '@/features/meet/schedule/CalendarView';
import { formatDate } from '@/lib/utils/dateUtils';
import CalendarViewButtons from '@/features/meet/schedule/CalendarViewButtons';
import { CALENDAR_MODE, SCHEDULE_STATUS } from '@/constants/scheduleConst';
import { ScheduleResponse, CalendarMode, MyScheduleResponse } from '@/types/schedules';
import TabBar from '@/components/TabBar';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { deleteSchedule, getAllSchedules, getMySchedules, setFinalDate } from '@/lib/api/schedules';
import { MeetResponse } from '@/types/meets';
import { getMeet } from '@/lib/api/meets';
import { ErrorResponse } from '@/types/error';
import { useScheduleStatus } from '@/lib/hooks/useScheduleStatus';

function SchedulePage() {
  const router = useRouter();
  const params = useParams();
  const meetId = (params?.id && Number(params.id)) || null;
  const [isOpenSubmitModal, toggleSubmitModal] = useToggle();
  const [isOpenErrorModal, toggleErrorModal] = useToggle();
  const [clickedDay, setDay] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('날짜를 선택해주세요.');
  const [calendarMode, setCalendarMode] = useState<CalendarMode>(CALENDAR_MODE.VIEW);

  const movePrevPage = () => {
    router.push(`/meet/${meetId}`);
  };

  // 만남 조회
  const { data: meet } = useQuery<AxiosResponse<MeetResponse>>({
    queryKey: ['meet', meetId],
    queryFn: () => getMeet(meetId as number),
    enabled: meetId !== null,
  });

  // 일정 전체 조회
  const { data: schedules } = useQuery<AxiosResponse<ScheduleResponse>>({
    queryKey: ['schedules', meetId],
    queryFn: () => getAllSchedules(meetId as number),
    enabled: meetId !== null,
  });

  // 내 일정 조회
  const { data: mySchedule } = useQuery<AxiosResponse<MyScheduleResponse>>({
    queryKey: ['mySchedule', meetId],
    queryFn: () => getMySchedules(meetId as number),
    enabled: meetId !== null,
  });

  // 최종 일자 선택
  const setFinalDateMutation = useMutation({
    mutationFn: setFinalDate,
    onSuccess: () => {
      router.push(`/meet/${meetId}/schedule`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data.code === 'VD004') {
        toggleSubmitModal();
        setErrorMessage('모두가 참석 가능한 날짜를 선택해주세요.');
        toggleErrorModal();
      }
      console.error('Error editing schedule:', error);
    },
  });

  const handleSubmitFinalDate = useCallback(() => {
    if (!meetId || !clickedDay) return;
    const finalDate = formatDate(clickedDay, 'YYYY-MM-DD');
    setFinalDateMutation.mutate({ meetId, finalDate });
  }, [meetId, setFinalDateMutation, clickedDay]);

  const { status } = useScheduleStatus({
    meetId,
    meet: meet?.data,
    schedules: schedules?.data,
  });

  // 재투표 (기존 Vote 삭제)
  const deleteVoteMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      router.push(`/meet/${meetId}/schedule/create`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Error editing schedule:', error);
    },
  });

  const handleReVote = useCallback(() => {
    if (!meetId) return;
    deleteVoteMutation.mutate(meetId);
  }, [meetId, deleteVoteMutation]);

  // 미팅 상태에 따른 스케줄 모드 변경
  useEffect(() => {
    switch (status) {
      case SCHEDULE_STATUS.IN_PROGRESS:
        setCalendarMode(CALENDAR_MODE.VIEW);
        break;
      case SCHEDULE_STATUS.NEED_REVOTE:
        setCalendarMode(CALENDAR_MODE.VIEW);
        break;
      case SCHEDULE_STATUS.NEED_COMPLETE:
        setCalendarMode(CALENDAR_MODE.SELECT_ONE);
        break;
      case SCHEDULE_STATUS.COMPLETED:
        setCalendarMode(CALENDAR_MODE.VIEW);
        break;
    }
  }, [status]);

  if (!meet || !schedules || !meetId) return;
  return (
    <>
      <TabBar onClickBack={movePrevPage} />
      <CalendarView
        calendarMode={calendarMode}
        status={status}
        mySelectedDates={
          mySchedule?.data.date.map((dateString: string) => new Date(dateString)) || []
        }
        allSchedule={schedules.data}
        onChangeDate={setDay}
        meetId={meetId}
        fixedDate={meet.data?.meetDate ? new Date(meet.data.meetDate) : undefined}
      />
      <CalendarViewButtons
        meetId={meetId}
        type={status}
        date={clickedDay}
        onClickSelectFinalDate={toggleSubmitModal}
        errorModalToggle={toggleErrorModal}
        setErrorMessage={setErrorMessage}
        onClickReVote={handleReVote}
      />
      {isOpenSubmitModal && (
        <Modal type="OkCancel" onOk={handleSubmitFinalDate} onClose={toggleSubmitModal} width={326}>
          <Text>
            <Emphasize>{clickedDay && formatDate(clickedDay, 'MM월 DD일')}</Emphasize>에 만날까요?
          </Text>
        </Modal>
      )}
      {isOpenErrorModal && (
        <Modal type="Ok" onOk={toggleErrorModal} width={326}>
          <Text>{errorMessage}</Text>
        </Modal>
      )}
    </>
  );
}

export default SchedulePage;
