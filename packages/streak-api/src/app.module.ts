import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreaksModule } from './streaks/streaks.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [StreaksModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
