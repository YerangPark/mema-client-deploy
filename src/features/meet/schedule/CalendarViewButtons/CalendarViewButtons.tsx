import styled from 'styled-components';
import Button from '@/components/Button';
import { ScheduleStatus } from '@/types/schedules';
import { SCHEDULE_STATUS } from '@/constants/scheduleConst';
import { useRouter } from 'next/navigation';

interface Props {
  meetId: number | null;
  type: ScheduleStatus;
  date: Date | null;
  onClickSelectFinalDate: () => void;
  onClickReVote: () => void;
  errorModalToggle: () => void;
  setErrorMessage: (str: string) => void;
}

const CalendarViewButtons = ({
  meetId,
  type,
  date,
  onClickSelectFinalDate,
  onClickReVote,
  errorModalToggle,
  setErrorMessage,
}: Props) => {
  const router = useRouter();
  const handleClickFinalDate = () => {
    if (date !== null) onClickSelectFinalDate();
    else {
      setErrorMessage('날짜를 선택해주세요.');
      errorModalToggle();
    }
  };
  return (
    <Container>
      {type === SCHEDULE_STATUS.IN_PROGRESS && (
        <Button name="수정하기" onClick={() => router.push(`/meet/${meetId}/schedule/vote`)} />
      )}
      {type === SCHEDULE_STATUS.NEED_REVOTE && (
        <>
          <Button name="재투표하기" onClick={onClickReVote} />
          <Button
            name="수정하기"
            buttonType="gray"
            onClick={() => router.push(`/meet/${meetId}/schedule/vote`)}
          />
        </>
      )}
      {type === SCHEDULE_STATUS.NEED_COMPLETE && (
        <>
          <Button name="재투표하기" buttonType="gray" onClick={onClickReVote} />
          <Button name="날짜 고르기" onClick={handleClickFinalDate} />
        </>
      )}
    </Container>
  );
};

export default CalendarViewButtons;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  position: fixed;
  width: 358px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 34px;
  @media (max-width: 390px) {
    width: calc(100% - 32px);
  }
`;
