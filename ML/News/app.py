from concurrent.futures import ThreadPoolExecutor
from urllib import response
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
from alpaca_trade_api.rest import REST
from datetime import timedelta
from transformers import pipeline

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

BASE_URL = "https://paper-api.alpaca.markets"
API_KEY = "PKI1EBX5LM1D0WUN7WU5"
SECRET_KEY = "CxSsspL84jDujfTUxxGNhWibaexutf18Uf513ABM"

api = REST(key_id=API_KEY, secret_key=SECRET_KEY, base_url=BASE_URL)

def analyze_sentiment(story):
    try:
        classifier = pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english')
        sentiment_result = classifier(story.summary)[0]
        result = {
            'headline': story.headline,
            'sentiment': sentiment_result['label'],
            'score': sentiment_result['score']
        }
        return result
    except Exception as e:
        return {'error': str(e)}

@app.route('/get_sentiment', methods=['POST'])
def get_sentiment():
    try:
        data = request.get_json()
        symbol = data['symbol']

        current_date = datetime.datetime.now()
        six_months_ago = current_date - timedelta(days=180)
        current_date = current_date.strftime("%Y-%m-%d")
        six_months_ago = six_months_ago.strftime("%Y-%m-%d")

        news = api.get_news(symbol, start=six_months_ago, end=current_date)

        results = []
        total_score = 0
        count = 0

        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(analyze_sentiment, story) for story in news]
        
        for future in futures:
            result = future.result()
            if 'error' in result:
                return jsonify(result), 500

            results.append(result)
            total_score += result['score']
            count += 1

        average_sentiment = total_score / count
        response = jsonify(average_sentiment)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        return response
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
