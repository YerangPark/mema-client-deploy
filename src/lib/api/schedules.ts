import { defaultAxios } from '@/lib/api/defaultAxios';
import { CreateScheduleData, UpdateScheduleData } from '@/types/schedules';

export const getAllSchedules = async (meetId: number) => {
  return await defaultAxios.get(`/meets/${meetId}/vote/date/total`);
};

export const getMySchedules = async (meetId: number) => {
  return await defaultAxios.get(`/meets/${meetId}/vote/date/my`);
};

export const createSchedule = async ({
  meetId,
  data,
}: {
  meetId: number;
  data: CreateScheduleData;
}) => {
  return await defaultAxios.post(`/meets/${meetId}/vote/date`, data);
};

export const editSchedule = async ({
  meetId,
  data,
}: {
  meetId: number;
  data: UpdateScheduleData;
}) => {
  return await defaultAxios.patch(`/meets/${meetId}/vote/date`, data);
};

export const setFinalDate = async ({
  meetId,
  finalDate,
}: {
  meetId: number;
  finalDate: string;
}) => {
  return await defaultAxios.patch(`/meets/${meetId}/vote/date/final`, { finalDate });
};

export const deleteSchedule = async (meetId: number) => {
  return await defaultAxios.delete(`/meets/${meetId}/vote/date`);
};
