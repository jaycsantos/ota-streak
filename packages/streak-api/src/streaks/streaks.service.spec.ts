import { Test, TestingModule } from '@nestjs/testing';
import { StreaksService } from './streaks.service';
import { CommonModule } from '../common/common.module';
import type Moment from 'moment';
import { StreaksDto } from './streaks-dto';

describe('StreaksService', () => {
  let service: StreaksService;
  let moment: typeof Moment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreaksService],
      imports: [CommonModule],
    }).compile();

    service = module.get<StreaksService>(StreaksService);
    moment = module.get('Moment');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: no need to unit test this if this will connect to an actual database
  describe('loadStreakWeek', () => {
    it('should return streaks within the week', async () => {
      const lastWeekDate = moment().subtract(6, 'days').format();
      const streaks = await service.loadStreakWeek(1);

      expect(
        Object.keys(streaks).find((date) => date < lastWeekDate),
      ).toBeUndefined();
    });
  });

  describe('getStreaks', () => {
    let spy: jest.SpyInstance;
    let payload: StreaksDto;

    beforeAll(() => {
      jest.useFakeTimers();
    });
    beforeEach(() => {
      spy = jest
        .spyOn(service, 'loadStreakWeek')
        .mockImplementation(async () => {
          return payload.days.reduce((obj, { date, activities }) => {
            if (activities > 0) obj[date] = activities;
            return obj;
          }, {});
        });
    });
    afterEach(() => {
      spy.mockRestore();
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it('should return streaks for the week #1', async () => {
      jest.setSystemTime(new Date('2024-02-26'));
      payload = {
        activitiesToday: 3, // 2024-02-26 is today
        total: 4,
        days: [
          { date: '2024-02-29', activities: 0, state: 'INCOMPLETE' },
          { date: '2024-02-28', activities: 0, state: 'INCOMPLETE' },
          { date: '2024-02-27', activities: 0, state: 'INCOMPLETE' },
          { date: '2024-02-26', activities: 3, state: 'COMPLETED' },
          { date: '2024-02-25', activities: 0, state: 'SAVED' },
          { date: '2024-02-24', activities: 0, state: 'SAVED' },
          { date: '2024-02-23', activities: 2, state: 'COMPLETED' },
        ],
      };

      const results = await service.getStreaks(1);

      expect(results).toBeDefined();
      expect(results.activitiesToday).toBe(payload.activitiesToday);
      expect(results.total).toBe(payload.total);
      expect(results.days).toEqual(payload.days);
    });
    it('should return streaks for the week #2', async () => {
      jest.setSystemTime(new Date('2000-01-06'));
      payload = {
        activitiesToday: 2,
        total: 0,
        days: [
          { date: '2000-01-07', activities: 0, state: 'INCOMPLETE' },
          { date: '2000-01-06', activities: 2, state: 'INCOMPLETE' },
          { date: '2000-01-05', activities: 0, state: 'SAVED' },
          { date: '2000-01-04', activities: 0, state: 'AT_RISK' },
          { date: '2000-01-03', activities: 2, state: 'COMPLETED' },
          { date: '2000-01-02', activities: 0, state: 'SAVED' },
          { date: '2000-01-01', activities: 2, state: 'COMPLETED' },
        ],
      };

      const results = await service.getStreaks(1);

      expect(results).toBeDefined();
      expect(results.activitiesToday).toBe(payload.activitiesToday);
      expect(results.total).toBe(payload.total);
      expect(results.days).toEqual(payload.days);
    });
  });
});
