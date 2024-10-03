import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DiscordBotService } from './discord-bot/discord-bot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './discord-bot/discord-bot.entity';
import * as dotenv from "dotenv"
dotenv.config()


@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_DATABASE,
      entities: [Message],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [DiscordBotService],
})
export class AppModule {}
