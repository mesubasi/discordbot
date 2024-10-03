import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './discord-bot.entity'; 
import ollama from 'ollama';

@Injectable()
export class DiscordBotService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private isActive: boolean = false;
  private aiContent:[String];

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

      const start = new SlashCommandBuilder()
        .setName("baslat")
        .setDescription("Yapay zeka ile sohbet başlatır.");

      const stop = new SlashCommandBuilder()
        .setName("durdur")
        .setDescription("Yapay zeka ile sohbeti durdurur.");

      await this.client.application.commands.create(start);
      await this.client.application.commands.create(stop);

      this.client.on('messageCreate', async (message) => {
      this.client.on("interactionCreate", async (interaction) => {

        if (message.author.id === this.client.user.id) {
          return;
        }

        if (message.content.toLowerCase() === 'selam') {
          return message.reply(`Aleyküm Selam ${message.author}`);
        }
        
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === "baslat") {
          this.isActive = true; 
          await interaction.reply("Sohbet başlatılıyor...");

          while (this.isActive) {
            const filter = (response) => {
              return response.author.id === interaction.user.id; 
            };

            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
            if (!collected) {
              await interaction.channel.send("30 saniye içinde yanıt alamadım. Sohbeti durduruyorum.");
              this.isActive = false; 
              return;
            }

            const userMessage = collected.first();
            const response = await ollama.chat({
              model: 'llama3.2',
              messages: [{ role: 'user', content: userMessage.content }],
            });

            await interaction.channel.send(response.message.content);
            const aiContent = response.message.content
          }
        } else if (interaction.commandName === "durdur") {
          this.isActive = false; 
            interaction.reply("Sohbet durduruldu.");
        }

        const newMessage = this.messageRepository.create({
          username: message.author.username,
          usercontent: message.content,
          aicontent: aiContent,
          createdAt: new Date(),
        });

        await this.messageRepository.save(newMessage);
      });

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
