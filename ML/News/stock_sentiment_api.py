from flask import Flask, request, jsonify
import datetime
from alpaca_trade_api.rest import REST
from datetime import timedelta
from transformers import pipeline

app = Flask(__name__)

BASE_URL = "https://paper-api.alpaca.markets"
API_KEY = "PK7C5OO9M7HYPW5SVI1T"
SECRET_KEY = "vE2VroALLWqEVzoQdSpjtBGSOaMyHQ2cIf2i1yPr"

api = REST(key_id=API_KEY, secret_key=SECRET_KEY, base_url=BASE_URL)

@app.route('/get_sentiment', methods=['POST'])
def get_sentiment():
    try:
        data = request.get_json()
        symbol = data['symbol']

        current_date = datetime.now()
        six_months_ago = current_date - timedelta(days=180)
        current_date = current_date.strftime("%Y-%m-%d")
        six_months_ago = six_months_ago.strftime("%Y-%m-%d")

        news = api.get_news(symbol, six_months_ago, current_date)

        classifier = pipeline('sentiment-analysis')

        results = []
        for story in news:
            result = {
                'headline': story.headline,
                'sentiment': classifier(story.summary)[0]
            }
            results.append(result)

        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
