import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, GatewayIntentBits, SlashCommandBuilder, Message as DiscordMessage } from 'discord.js';
import { discordBotTable } from './discord-bot.entity'; 
import ollama from 'ollama';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DiscordBotService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private isActive: boolean = false;
  private db: any; 

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL, 
    });
    this.db = drizzle(pool);
  }

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

      const start = new SlashCommandBuilder()
        .setName("baslat")
        .setDescription("Yapay zeka ile sohbet başlatır.");

      const stop = new SlashCommandBuilder()
        .setName("durdur")
        .setDescription("Yapay zeka ile sohbeti durdurur.");

      await this.client.application.commands.create(start);
      await this.client.application.commands.create(stop);

      this.client.on('messageCreate', this.handleMessage.bind(this));

      this.client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === "baslat") {
          this.isActive = true; 
          await interaction.reply("Lütfen mesaj giriniz:");
        } else if (interaction.commandName === "durdur") {
          this.isActive = false; 
          await interaction.reply("Sohbet durduruldu.");
        }
      });

    } catch (error) {
      console.error('Error:', error);
    }
  }

  private async handleMessage(message: DiscordMessage) {
    if (message.author.bot) return;

    await this.saveMessageToDatabase(message.author.username, message.content, '');

    if (message.content.toLowerCase() === 'selam') {
      const reply = `Aleyküm Selam ${message.author}`;
      await message.reply(reply);
      await this.saveMessageToDatabase('Bot', reply, message.content);
      return;
    }

    if (this.isActive) {
      try {
        const aiResponse = await this.AIResponse(message.content);
        await message.reply(aiResponse);
        await this.saveMessageToDatabase('Bot', aiResponse, message.content);
      } catch (error) {
        console.error('Error', error);
        await message.reply("Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    }
  }

  private async AIResponse(userMessage: string): Promise<string> {
    try {
      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: userMessage }],
      });
      return response.message.content;
    } catch (error) {
      console.error('Error', error);
      throw error; 
    }
  }

  private async saveMessageToDatabase(username: string, content: string, aiPrompt: string) {
    try {
      const newMessage = {
        username,
        content,
        usercontent: aiPrompt,
        timestamp: new Date(),
      };
      await this.db.insert(discordBotTable).values(newMessage);
    } catch (error) {
      console.error('Error', error);
    }
  }

  async onModuleDestroy() {
    await this.client.destroy();
    console.log('Bot bağlantısı kesildi!');
  }
}