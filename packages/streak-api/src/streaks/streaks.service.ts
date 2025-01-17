import { Inject, Injectable } from '@nestjs/common';
import { StreaksDto, StreakDayDto, Streaks } from './streaks-dto';
import type Moment from 'moment';

@Injectable()
export class StreaksService {
  constructor(@Inject('Moment') private readonly moment: typeof Moment) {}

  // TODO: can later be a configuration
  private readonly maxDebt = 2;

  /**
   * Loads the streak data for the week.
   *
   * Note: Entry point for fetching streak data from a database.
   * Imp: Make sure this queries for the last 7 days from today.
   *
   * @param id
   * @returns
   */
  async getStreakWeek(id: number): Promise<Streaks | null> {
    return this.mock(id);
  }

  /**
   * Processes the streak data for the week from a given date.
   *
   * @param {Streaks} data - payload of week streaks from `loadStreakWeek`
   * @param {string} curDay - targeted day YYYY-MM-DD, defaults to today
   * @returns
   */
  processWeekStreak(data: Streaks, curDay?: string): StreaksDto {
    curDay ??= this.moment().format();
    const dates = Object.keys(data).sort();
    const days: Array<StreakDayDto> = [];

    for (let i = 0, debt = 0; i < 7; i++) {
      const date = this.moment(dates[0]).add(i, 'days').format();
      const activities = data[date] || 0;
      days.push({
        date,
        activities,
        state: activities > 0 ? 'COMPLETED' : 'INCOMPLETE',
      });
      // stop if it's the current day
      if (date == curDay) break;
    }

    for (let i = 0, debt = 0; i < days.length; i++) {
      const day = days[i];
      if (day.activities > 0) {
        // has debt & day before debt has activity
        if (debt > 0 && days[i - debt - 1]?.activities) {
          // today or can pay all debt
          if (curDay == day.date || day.activities > debt) {
            const budget = Math.min(debt, day.activities);
            for (let j = 0; j < budget; j++) {
              days[i - 1 - j].state = 'SAVED';

              if (j == budget - 1 && curDay == day.date && day.activities <= debt)
                days[i - 1 - j].state = 'AT_RISK';
            }
          }
          if (curDay == day.date && day.activities <= debt) {
            day.state = 'INCOMPLETE';
          }
        }
        debt = 0;
      } else {
        debt = Math.min(debt + 1, this.maxDebt);
      }
    }

    let total = 0;
    for (let i = 1; i <= days.length; i++) {
      const day = days[days.length - i];
      if (day.state != 'INCOMPLETE') {
        total++;
      } else if (i > this.maxDebt) {
        break;
      }
    }

    // fill missing future days
    for (let i = 0, left = 7 - days.length; i < left; i++) {
      days.push({
        date: this.moment(curDay)
          .add(i + 1, 'days')
          .format(),
        activities: 0,
        state: 'INCOMPLETE',
      });
    }

    return {
      activitiesToday: data[curDay] || 0,
      total,
      days,
    };
  }

  private mock(id: number): Streaks | null {
    switch (id) {
      case 0: {
        return {};
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
