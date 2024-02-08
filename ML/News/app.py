from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from alpaca_trade_api.rest import REST
from transformers import pipeline
import threading

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

BASE_URL = "https://paper-api.alpaca.markets"
API_KEY = "PKZMNP63HL85U73H6BYY"
SECRET_KEY = "UoE2qOlDId6PIU0j08L5qOtH2tgZNYuFTf6RQ42J"

api = REST(key_id=API_KEY, secret_key=SECRET_KEY, base_url=BASE_URL)

average_sentiment = 72.4
lock = threading.Lock()

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

def calculate_average_sentiment():
    global average_sentiment
    try:
        current_date = datetime.now()
        six_months_ago = current_date - timedelta(days=180)
        current_date = current_date.strftime("%Y-%m-%d")
        six_months_ago = six_months_ago.strftime("%Y-%m-%d")

        news = api.get_news(symbol, start=six_months_ago, end=current_date)

        total_score = 0
        count = 0

        for story in news:
            result = analyze_sentiment(story)
            if 'error' in result:
                print(f"Error analyzing sentiment for {story.headline}: {result['error']}")
                continue
            total_score += result['score']
            count += 1

        with lock:
            if count > 0:
                average_sentiment = total_score / count
            else:
                average_sentiment = 0
        print(f"Average sentiment updated: {average_sentiment}")
    except Exception as e:
        print(f"Error calculating average sentiment: {e}")

@app.route('/get_sentiment', methods=['POST'])
def get_sentiment():
    global average_sentiment
    try:
        with lock:
            response_data = average_sentiment
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    symbol = "SPY" 
    threading.Thread(target=calculate_average_sentiment, daemon=True).start()  
    app.run(port=5050)
