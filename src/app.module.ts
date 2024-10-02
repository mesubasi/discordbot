import { Module } from '@nestjs/common';
import { DiscordBotService } from './discord-bot/discord-bot.service';


@Module({
  imports: [],
  providers: [DiscordBotService],
})
export class AppModule {}
