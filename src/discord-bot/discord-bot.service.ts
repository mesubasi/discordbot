import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config()

@Injectable()
export class DiscordBotService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  async onModuleInit() {
    try {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

      const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

      await this.client.login(DISCORD_BOT_TOKEN);
      console.log(`Bot ${this.client.user.tag} başarıyla giriş yaptı!`);

      this.client.on('messageCreate', (message) => {
        
        if (message.author.id === this.client.user.id) {
            return; 
          }
  
          
          const author = message.author;
          const userInfo = `User Info:\nUsername: ${author.username}\nID: ${author.id}\nAvatar: ${author.displayAvatarURL()}`;
          
          message.channel.send(userInfo);
        });
      

    } catch (error) {
      console.error('Error', error);
    }
  }

  async onModuleDestroy() {
    await this.client.destroy();
    console.log('Bot bağlantısı kesildi!');
  }
}
