export type ScheduleTable = {
  title: string;
  date: string;
  beforeTime: string | null;
  afterTime: string | null;
  memo: string | null;
  allday: boolean;
  color: string;
  id: number;
};
// 下、取ってきた後の型
export type Schedule = {
  title: string;
  date: string;
  beforeTime: string | null;
  afterTime: string | null;
  memo: string | null;
  allday: boolean;
  color: string;
  id: number;
};
export type addSchedule = {
  title: string;
  date: string;
  beforeTime: string | null;
  afterTime: string | null;
  memo: string | null;
  allday: boolean;
  color: string;
};
