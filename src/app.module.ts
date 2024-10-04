import { Module, OnModuleInit } from '@nestjs/common';
import { DiscordBotService } from './discord-bot/discord-bot.service';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
dotenv.config();

@Module({
  providers: [DiscordBotService],
})
export class AppModule implements OnModuleInit{
  private db:any;
  async onModuleInit() {
    const pool = new Pool({
      connectionString: process.env.DB_URL
    })
    this.db = drizzle(pool)
  }
}
