import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotGateway } from './bot.gateway';

@Module({
  providers: [BotService, BotGateway],
})
export class BotModule {}
