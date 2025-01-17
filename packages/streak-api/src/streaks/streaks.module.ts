import { Module } from '@nestjs/common';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [StreaksController],
  imports: [CommonModule],
  providers: [StreaksService],
})
export class StreaksModule {}
