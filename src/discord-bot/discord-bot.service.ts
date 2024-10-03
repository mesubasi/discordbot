import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './discord-bot.entity'; 
import ollama from 'ollama';

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

      
      const baslat = new SlashCommandBuilder()
        .setName("baslat")
        .setDescription("Yapay zeka ile sohbet başlatır.");

        const durdur = new SlashCommandBuilder()
        .setName("durdur")
        .setDescription("Yapay zeka ile sohbeti durdurur.")

      await this.client.application.commands.create(baslat);
      await this.client.application.commands.create(durdur);

      this.client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName === "baslat") {
        try {
          await interaction.reply("Sohbet başlatılıyor...");
          
          const response = await ollama.chat({
            model: 'llama3.2',
            messages: [{ role: 'user',content: "Merhaba! Ben bir yapay zeka destekli sohbet botuyum. Herhangi bir konuda seninle sohbet etmek, sorularını yanıtlamak veya bilgi sağlamak için buradayım. İstediğin konuyu seçebilirsin: genel bilgi, teknoloji, bilim, sanat, günlük yaşam veya başka bir şey. Ne hakkında konuşmak istersin?" }],
          });
          await interaction.channel.send(response.message.content);
        } catch (error) {
          console.log(error);
        }        
        } else if (interaction.commandName === "durdur"){
          try {
            await interaction.reply("Sohbet durduruldu.");
          } catch (error) {
            console.log(error);
          }
        }
      });

      this.client.on('messageCreate', async (message) => {
        if (message.author.id === this.client.user.id) {
          return;
        }

        if (
          message.content.toLowerCase() === 'selam' ||
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
