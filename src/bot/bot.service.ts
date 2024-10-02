import { Injectable } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class BotService {
  private client: Client;

  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    this.client.login(process.env.DISCORD_TOKEN); // Token'ı environment variable'dan alıyoruz

    this.client.on('ready', () => {
      console.log(`Bot ${this.client.user?.tag} olarak giriş yaptı!`);
    });
  }
}
