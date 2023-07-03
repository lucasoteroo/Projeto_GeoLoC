import requests
from flask import Flask, request, render_template
import telebot
import json


# Token de acesso do bot do Telegram
token = '6148425947:AAFjBOwCHGFjc_pvR_Bjz1nCLwZ_euyyPgA'

# Cria uma nova instância do bot
bot = telebot.TeleBot(token)

# Cria uma instância do servidor web Flask
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/style.css')
def style():
    return app.send_static_file('style.css')

@app.route('/script.js')
def script():
    return app.send_static_file('script.js')

@app.route('/webhook', methods=['POST'])
def webhook():
    # Processa a atualização recebida
    bot.process_new_updates([telebot.types.Update.de_json(request.stream.read().decode("utf-8"))])
    return "OK"

# Rota para o comando /start
@bot.message_handler(commands=['start'])
def comando_start(message):
    chat_id = message.chat.id
    print(chat_id)
    bot.send_message(chat_id, 'Olá! Digite o comando /enviar_distancia para obter a distância.')

@app.route('/enviar_distancia', methods=['POST'])
def enviar_distancia():
    localizacoes = request.json['localizacoes']
    chat_id = request.json['chat_id']  # Obtém o chat ID do JSON recebido

    mensagem = "Distâncias:\n"
    for localizacao in localizacoes:
        distancia = localizacao['distancia']
        nome = localizacao['name']
        mensagem += f"Você está a {distancia} km de {nome}\n"

    # Envie a mensagem para o bot do Telegram usando a API do Telegram
    bot.send_message(chat_id, mensagem)

    return "OK"


def set_telegram_webhook(url):
    webhook_url = f'https://api.telegram.org/bot{token}/setWebhook?url={url}/webhook'
    response = requests.get(webhook_url)
    if response.ok:
        print('Webhook definido com sucesso')
    else:
        print('Falha ao definir o webhook')

if __name__ == '__main__':
    # Define a URL do webhook para receber as atualizações do bot do Telegram
    ngrok_url = 'https://9f42-179-127-33-48.ngrok-free.app'  # Substitua pela URL do ngrok
    set_telegram_webhook(ngrok_url)

    # Inicia o servidor web Flask
    app.run(host='0.0.0.0', port=5000)
