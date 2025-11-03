from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'Pipeline CI funcionando!',
        'status': 'healthy',
        'version': '1.0.0'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

def add_numbers(a, b):
    """Função simples para testar"""
    return a + b

def multiply_numbers(a, b):
    """Outra função para testar"""
    return a * b

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
