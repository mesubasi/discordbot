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

        if (message.content.toLowerCase() === "selam" || message.content.toUpperCase() === "selam" || message.content === "Selam") {
            return message.reply("Aleyküm Selam")
        }

        const author = message.author;
        const messageTime = message.createdAt.toLocaleString(); 
        const userInfo = `User Info:\nUsername: ${author.username}\nID: ${author.id}\nAvatar: ${author.displayAvatarURL()}\nMessage Time: ${messageTime}`;
        
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
