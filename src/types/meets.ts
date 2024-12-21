// 미팅 단건 조회 response
import { MEET_STATUS } from '@/constants/meetConst';

export type Member = {
  userId: number; // 유저 고유 ID
  nickname: string; // 닉네임
  puzzleId: number; // 프로필 퍼즐 ID
  puzzleColor: string; // 프로필 퍼즐 색상
};

export type MeetMember = {
  meetMemberId: number; // 미팅에서의 유저 고유 ID
  isMe?: boolean; // 본인인지 아닌지
  userInfo: Member; // 멤버 정보
};

export type MeetResponse = {
  meetId: number; // 약속 고유 ID
  joinCode: string; // 약속 참여 코드
  meetName: string; // 약속명
  meetState: string; // 약속 상태값
  meetDate: null | string; // 만남 날짜
  meetLocation: null | string; // 만남 장소
  voteExpiredDate: string; // 날짜 투표 만료일
  voteExpiredLocation: string; // 장소 투표 만료일
  members: MeetMember[];
};

export type Meet = {
  meetId: number; // 모임 ID
  joinCode: number; // 참여 코드
  meetName: string; // 모임 이름
  meetDate: string | null; // 모임 날짜 (YYYY-MM-DD 형식 또는 null)
  memberCount: number; // 멤버 수
  members: MeetMember[]; // 멤버 목록
};

// 홈 미팅 리스트 조회 (최대 4 + 4 = 8개의 미팅만 조회 가능)
export type HomeMeetsResponse = {
  upcomingMeets: Meet[]; // 다가올 모임 목록
  pastMeets: Meet[]; // 지난 모임 목록
};

export type MeetStatus = (typeof MEET_STATUS)[keyof typeof MEET_STATUS];
