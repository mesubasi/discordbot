import { Module, OnModuleInit } from '@nestjs/common';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './drizzle/db';
import { resolve } from 'path';
import { Pool } from 'pg';
export class AppModule implements OnModuleInit {
    private pool: Pool;
  
    constructor() {
    
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL, 
      });
    }
  
    async onModuleInit() {
      try {
        await this.pool.connect();
        await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });
        console.log('Migrations have been applied successfully.');
      } catch (error) {
        console.error('Error during migration:', error);
      } finally {
        await this.pool.end(); 
      }
    }
  }