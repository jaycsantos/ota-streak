import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { StreaksDto } from './streaks-dto';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksSvc: StreaksService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'id is valid.' })
  @ApiNotFoundResponse({ description: 'id is invalid.' })
  async getStreaks(@Param('id', ParseIntPipe) id: number): Promise<StreaksDto> {
    const result = this.streaksSvc.getStreaks(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
