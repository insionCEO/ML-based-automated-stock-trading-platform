from concurrent.futures import ThreadPoolExecutor
from lumibot.brokers import Alpaca
from lumibot.backtesting import YahooDataBacktesting
from lumibot.strategies.strategy import Strategy
from datetime import datetime
from alpaca_trade_api import REST
from timedelta import Timedelta
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from typing import Tuple
import torch
import pymongo
from app import estimate_sentiment
from dotenv import load_dotenv

device = "cuda:0" if torch.cuda.is_available() else "cpu"

tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert").to(
    device
)
labels = ["positive", "negative", "neutral"]

BASE_URL = "https://paper-api.alpaca.markets"

load_dotenv() #to load the .env file


API_KEY = os.getenv('TRADER_API_KEY')
API_SECRET = os.getenv('TRADER_API_KEY_SECRET')


class MLTrader(Strategy):
    def initialize(
        self,
        symbol: str = "SPY",
        cash_at_risk: float = 0.5,
        api_key: str = None,
        api_secret: str = None,
    ):
        self.symbol = symbol
        self.sleeptime = "24H"
        self.last_trade = None
        self.cash_at_risk = cash_at_risk
        self.api = REST(base_url=BASE_URL, key_id=api_key, secret_key=api_secret)

    def position_sizing(self):
        cash = self.get_cash()
        last_price = self.get_last_price(self.symbol)
        quantity = round(cash * self.cash_at_risk / last_price, 0)
        return cash, last_price, quantity

    def get_dates(self):
        today = self.get_datetime()
        three_days_prior = today - Timedelta(days=3)
        return today.strftime("%Y-%m-%d"), three_days_prior.strftime("%Y-%m-%d")

    def get_sentiment(self):
        today, three_days_prior = self.get_dates()
        news = self.api.get_news(symbol=self.symbol, start=three_days_prior, end=today)
        news = [ev.__dict__["_raw"]["headline"] for ev in news]
        probability, sentiment = estimate_sentiment(news)
        return probability, sentiment

    def on_trading_iteration(self):
        cash, last_price, quantity = self.position_sizing()
        probability, sentiment = self.get_sentiment()

        if cash > last_price:
            if sentiment == "positive" and probability > 0.999:
                if self.last_trade == "sell":
                    self.sell_all()
                order = self.create_order(
                    self.symbol,
                    quantity,
                    "buy",
                    type="bracket",
                    take_profit_price=last_price * 1.20,
                    stop_loss_price=last_price * 0.95,
                )
                self.submit_order(order)
                self.last_trade = "buy"
            elif sentiment == "negative" and probability > 0.999:
                if self.last_trade == "buy":
                    self.sell_all()
                order = self.create_order(
                    self.symbol,
                    quantity,
                    "sell",
                    type="bracket",
                    take_profit_price=last_price * 0.8,
                    stop_loss_price=last_price * 1.05,
                )
                self.submit_order(order)
                self.last_trade = "sell"


client = pymongo.MongoClient(
    "mongodb+srv://zephop:test123@cluster0.yh1mk1u.mongodb.net/?retryWrites=true&w=majority"
)
db = client["models"]
collection = db["modeldetails"]


def run_strategy(api_key, api_secret):
    # print(api_key,api_secret)
    broker = Alpaca({"API_KEY": api_key, "API_SECRET": api_secret, "PAPER": True})
    strategy = MLTrader(
        name="mlstrat", broker=broker, parameters={"symbol": "SPY", "cash_at_risk": 0.5}
    )
    strategy.run()


client_keys = collection.find_one({"model_id": 1})["buyers"]
# print(client_keys)

with ThreadPoolExecutor() as executor:
    executor.map(
        lambda keys: run_strategy(keys["apiKey"], keys["apiSecretKey"]), client_keys
    )
