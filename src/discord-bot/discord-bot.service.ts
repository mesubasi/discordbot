import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './discord-bot.entity'; // 

dotenv.config();

@Injectable()
export class DiscordBotService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

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

      this.client.on('messageCreate', async (message) => {
        if (message.author.id === this.client.user.id) {
          return;
        }

       
        if (
          message.content.toLowerCase() === 'selam' ||
          message.content.toUpperCase() === 'selam' ||
          message.content === 'Selam'
        ) {
          return message.reply(`Aleyküm Selam ${message.author}`);
        }

       
        const newMessage = this.messageRepository.create({
          username: message.author.username,
          content: message.content,
          createdAt: new Date(), 
        });


        await this.messageRepository.save(newMessage);

        const userInfo = `User Info:\nUsername: ${message.author.username}\nID: ${message.author.id}\nAvatar: ${message.author.displayAvatarURL()}\nMessage Time: ${message.createdAt.toLocaleString()}\nMessage Content: ${message.content}`;
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
