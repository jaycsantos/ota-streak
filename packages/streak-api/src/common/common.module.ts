import { Module } from '@nestjs/common';
import moment from 'moment';
moment.defaultFormat = 'YYYY-MM-DD';

@Module({
  providers: [
    {
      provide: 'Moment',
      useValue: moment,
    },
  ],
  exports: ['Moment'],
})
export class CommonModule {}
