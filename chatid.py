import telebot

# Token de acesso do bot do Telegram
token = '6148425947:AAFjBOwCHGFjc_pvR_Bjz1nCLwZ_euyyPgA'

# Cria uma nova instância do bot
bot = telebot.TeleBot(token)

# Rota para o comando /start
@bot.message_handler(commands=['start'])
def comando_start(message):
    chat_id = message.chat.id
    bot.send_message(chat_id, f"Seu Chat ID é: {chat_id}")

# Inicia o bot
bot.polling()
