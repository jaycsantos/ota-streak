import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { StreaksModule } from '../src/streaks/streaks.module';
import { StreaksService } from '../src/streaks/streaks.service';
import { CommonModule } from '../src/common/common.module';

describe('StreaksController (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication;
  let service: StreaksService;
  let spy: jest.SpyInstance;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [StreaksModule, CommonModule],
    }).compile();

    app = module.createNestApplication();
    service = module.get<StreaksService>(StreaksService);
    jest.useFakeTimers();

    await app.init();
  });

  it('/streaks/:id (GET)', async () => {
    jest.setSystemTime(new Date('2024-02-26'));
    spy = jest.spyOn(service, 'getStreakWeek').mockImplementation(async () => {
      return {
        '2024-02-23': 2,
        '2024-02-24': 0,
        '2024-02-25': 0,
        '2024-02-26': 3,
        '2024-02-27': 0,
        '2024-02-28': 0,
        '2024-02-29': 0,
      };
    });

    const res = await request(app.getHttpServer())
      .get('/streaks/1')
      .expect('Content-Type', /json/)
      .expect(200);

    const data = res.body;
    expect(data).toBeDefined();
    expect(data.activitiesToday).toBe(3);
    expect(data.total).toBe(4);
    expect(data.days).toHaveLength(7);
  });
});
