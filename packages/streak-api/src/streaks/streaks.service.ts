import { Inject, Injectable } from '@nestjs/common';
import { StreaksDto, StreakDayDto, Streaks } from './streaks-dto';
import type Moment from 'moment';

@Injectable()
export class StreaksService {
  constructor(@Inject('Moment') private readonly moment: typeof Moment) {}

  // TODO: can later be a configuration
  private readonly maxDebt = 2;

  async getStreaks(id: number): Promise<StreaksDto | null> {
    const data = await this.loadStreakWeek(id);
    if (!data) return null;

    const today = this.moment().format();
    const dates = Object.keys(data).sort();
    const days: Array<StreakDayDto> = [];

    for (let i = 0, debt = 0; i < 7; i++) {
      const date = this.moment(dates[0]).add(i, 'days').format();
      const activities = data[date] || 0;
      const current = <StreakDayDto>{
        date,
        activities,
        state: activities > debt ? 'COMPLETED' : 'INCOMPLETE',
      };
      days.push(current);

      if (activities > 0) {
        // can payoff only if day before debt was completed or saved
        if (
          debt > 0 &&
          ['SAVED', 'COMPLETED'].includes(days[i - debt - 1]?.state)
        ) {
          // traverse back to payoff debt, start at farthest day
          for (
            let j = 0, p = i - debt + j;
            p > 0 && j < Math.min(debt, activities);
            j++, p = i - debt + j
          ) {
            days[p].state = 'SAVED';

            // check if at risk
            if (j == 0 && date == today && current.state == 'INCOMPLETE')
              days[p].state = 'AT_RISK';
          }
        } else {
        }
        // reduce debt by activities
        debt = Math.max(debt - activities + 1, 0);
      } else {
        // accumulate for this day
        debt = Math.min(debt + 1, this.maxDebt);
      }
    }

    let total = 0;
    for (const day of days) {
      if (day.date <= today) {
        if (day.state != 'INCOMPLETE') {
          total++;
        } else {
          total = 0;
        }
      }
    }

    days.reverse();

    return {
      activitiesToday: data[today] || 0,
      total,
      days,
    };
  }

  async loadStreakWeek(id: number): Promise<Streaks | null> {
    return this.mock(id);
  }

  private mock(id: number): Streaks | null {
    switch (id) {
      case 0: {
        return { [this.moment().format()]: 1 };
      }
      case 1:
        return {
          [this.moment().subtract(3, 'days').format()]: 1,
          [this.moment().format()]: 3,
        };
      case 2:
        return {
          [this.moment().subtract(4, 'days').format()]: 1,
          [this.moment().subtract(3, 'days').format()]: 1,
          [this.moment().format()]: 1,
        };
      case 3:
        return {
          [this.moment().subtract(4, 'days').format()]: 1,
          [this.moment().subtract(1, 'days').format()]: 3,
        };
      case 4:
        return {
          [this.moment().subtract(3, 'days').format()]: 1,
          [this.moment().format()]: 2,
        };
      case 5:
        return {
          [this.moment().subtract(5, 'days').format()]: 2,
          [this.moment().subtract(2, 'days').format()]: 2,
          [this.moment().format()]: 2,
        };
      case 6:
        return {
          [this.moment().subtract(3, 'days').format()]: 1,
          [this.moment().format()]: 5,
        };
      default:
        return null;
    }
  }
}
