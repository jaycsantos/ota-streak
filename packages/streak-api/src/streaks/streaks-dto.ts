export class StreaksDto {
  total: number;

  activitiesToday: number;

  days: Array<StreakDayDto>;
}

export class StreakDayDto {
  date: string;
  activities: number;
  state: 'INCOMPLETE' | 'COMPLETED' | 'SAVED' | 'AT_RISK';
}

// TODO: Transform into a class DTO if streaks are to be stored in a database.
export interface Streaks {
  [date: string]: number;
}
