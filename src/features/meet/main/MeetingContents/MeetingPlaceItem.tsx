import React from 'react';
import MeetingStatusItem from '@/features/meet/main/MeetingStatusItem';

type Props = {
  totalMembers: number;
  meetLocation: string | null;
  votedMembers: number;
  warningMessage?: string;
};

const MeetingPlaceItem = ({
  totalMembers,
  meetLocation,
  votedMembers = 0,
  warningMessage,
}: Props) => {
  const status: 'notStarted' | 'inProgress' | 'completed' =
    meetLocation !== null ? 'completed' : votedMembers > 0 ? 'inProgress' : 'notStarted';

  return (
    <MeetingStatusItem
      status={status}
      title="만나는 장소 정하기"
      totalMembers={totalMembers}
      votedMembers={votedMembers}
      warningMessage={warningMessage}
    />
  );
};

export default MeetingPlaceItem;
