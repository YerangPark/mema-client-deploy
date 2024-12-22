/**
 * Meeting Status Constants : 미팅 진행 상황
 */
export const MEET_STATUS = {
  /** 일정 생성 전 */
  SCHEDULE_BEFORE_USE: 'SCHEDULE_BEFORE_USE',

  /** 일정 생성되었지만 미투표 */
  SCHEDULE_CREATED_BUT_BEFORE_USE: 'SCHEDULE_CREATED_BUT_BEFORE_USE',

  // /** 일정 생성되었고, 미투표인데 만료됨 */
  // SCHEDULE_CREATED_BUT_EXPIRED: 'SCHEDULE_CREATED_BUT_EXPIRED',

  /** 일정 투표 완료 */
  SCHEDULE_AFTER_USE: 'SCHEDULE_AFTER_USE',

  /** 일정 최종 날짜 선택 완료, 장소 이용 전 */
  PLACE_BEFORE_USE: 'PLACE_BEFORE_USE',

  /** 장소 이용 중 */
  PLACE_AFTER_USE: 'PLACE_AFTER_USE',

  /** 장소 완료, 만남 이후 */
  BILL_AFTER_MEET: 'BILL_AFTER_MEET',
} as const;

export const MAX_UPCOMING_MEET_COUNT = 4;
export const MAX_VISIBLE_MEET_MEMBER_ICON_COUNT = 7;
