import { useEffect, useState } from 'react';
import { ScheduleResponse, ScheduleStatus, VoteDate } from '@/types/schedules';
import { SCHEDULE_STATUS } from '@/constants/scheduleConst';
import { userMeetStore } from '@/store/userMeetStore';
import { MeetResponse } from '@/types/meets';

type UseScheduleStatusProps = {
  meetId: number | null;
  meet: MeetResponse | undefined;
  schedules: ScheduleResponse | undefined;
};

export const useScheduleStatus = ({ meetId, meet, schedules }: UseScheduleStatusProps) => {
  const { setMeetScheduleStatus } = userMeetStore();
  const [status, setStatus] = useState<ScheduleStatus>(SCHEDULE_STATUS.IN_PROGRESS);
  const [isUpdated, setIsUpdated] = useState(false);

  const getTotalVotedMembers = (voteDates: VoteDate[]) => {
    const uniqueMemberIds = new Set<number>();
    voteDates.forEach((voteDate) => {
      voteDate.members.forEach((member) => uniqueMemberIds.add(member.meetMemberId));
    });
    return uniqueMemberIds.size;
  };

  const getFullParticipationDateCount = (voteDates: VoteDate[], totalMemberCount: number) => {
    return voteDates.filter((voteDate) => voteDate.members.length === totalMemberCount).length;
  };

  useEffect(() => {
    if (!meetId || !meet?.members || !schedules) return;

    const isVoteExpired = new Date() > new Date(meet.voteExpiredDate);
    const totalMemberCount = meet.members.length;
    const votedMemberCount = getTotalVotedMembers(schedules.voteDates);
    const fullParticipationDateCount = getFullParticipationDateCount(
      schedules.voteDates,
      votedMemberCount,
    );

    let calculatedStatus: ScheduleStatus = SCHEDULE_STATUS.IN_PROGRESS;

    if (meet.meetDate) {
      calculatedStatus = SCHEDULE_STATUS.COMPLETED;
    } else {
      if (!isVoteExpired && votedMemberCount < totalMemberCount) {
        calculatedStatus = SCHEDULE_STATUS.IN_PROGRESS;
      } else if (isVoteExpired || votedMemberCount === totalMemberCount) {
        if (fullParticipationDateCount === 0) {
          calculatedStatus = SCHEDULE_STATUS.NEED_REVOTE;
        } else if (fullParticipationDateCount > 0) {
          calculatedStatus = SCHEDULE_STATUS.NEED_COMPLETE;
        }
      }
    }

    setStatus(calculatedStatus);
    setMeetScheduleStatus(meetId, calculatedStatus);
    setIsUpdated(true);
  }, [meetId, meet, schedules, setMeetScheduleStatus]);

  return { status, isUpdated };
};
