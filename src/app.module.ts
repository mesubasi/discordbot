import { Module, OnModuleInit } from '@nestjs/common';
import { DiscordBotService } from './discord-bot/discord-bot.service';
import { db } from './drizzle/db';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as dotenv from 'dotenv';
import { Pool } from 'pg'; 
dotenv.config();

@Module({
  providers: [DiscordBotService],
})
export class AppModule {
  private pool: Pool;

  constructor() {
  
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL, 
    });
  }

}
