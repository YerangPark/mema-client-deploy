import styled from 'styled-components';
import { MoreHorizontal } from 'react-feather';
import { MeetMember } from '@/types/meets';
import MemberIcon from '@/components/common/MemberIcon';
import { MAX_VISIBLE_MEET_MEMBER_ICON_COUNT } from '@/constants/meetConst';

type IconStackProps = {
  members: MeetMember[];
};

const MemberIconStack: React.FC<IconStackProps> = ({ members }) => {
  const sortMeetMembers = (members: MeetMember[]): MeetMember[] => {
    return members.sort((a, b) => {
      if (a.isMe && !b.isMe) return -1;
      if (!a.isMe && b.isMe) return 1;
      return 0;
    });
  };

  return (
    <MembersWrapper>
      {sortMeetMembers(members)
        .slice(0, MAX_VISIBLE_MEET_MEMBER_ICON_COUNT)
        .map((member, index) => (
          <StackedIcon
            key={index}
            style={{ zIndex: MAX_VISIBLE_MEET_MEMBER_ICON_COUNT - index }} // 앞쪽 아이콘이 위로 쌓이도록 설정
          >
            <MemberIcon
              puzzleId={member.userInfo.puzzleId}
              puzzleColor={member.userInfo.puzzleColor}
              size={40}
              showShadow={true}
            />
          </StackedIcon>
        ))}
      {members.length > MAX_VISIBLE_MEET_MEMBER_ICON_COUNT && (
        <MoreWrapper>
          <MoreHorizontal />
        </MoreWrapper>
      )}
    </MembersWrapper>
  );
};

export default MemberIconStack;

const MembersWrapper = styled.div`
  position: relative; /* 자식 요소의 위치 기준 */
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const StackedIcon = styled.div`
  position: relative;
  margin-left: -10px; /* 아이콘이 10px씩 겹치도록 설정 */
`;

const MoreWrapper = styled.div`
  position: relative;
  margin-left: -10px; /* 마지막 아이콘도 동일하게 겹침 */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    stroke: ${({ theme }) => theme.colors.gray[4]};
    width: 24px;
    height: 24px;
  }
`;
