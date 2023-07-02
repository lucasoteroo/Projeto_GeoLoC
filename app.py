from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)

def enviar_mensagem_telegram(token, chat_id, mensagem):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": mensagem}
    response = requests.post(url, json=payload)
    return response.json()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enviar_mensagem', methods=['POST'])
def enviar_mensagem():
    token = "6103231923:AAH1sxXKyQMZrwbrjT9VsL5coUK7OD24qT4"
    chat_id = "1298484597"
    mensagem = request.form.get('mensagem')
    enviar_mensagem_telegram(token, chat_id, mensagem)
    print(mensagem)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
