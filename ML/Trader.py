import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential
from keras.layers import Dense
from lumibot.brokers import Alpaca
from lumibot.backtesting import YahooDataBacktesting
from lumibot.strategies.strategy import Strategy
from lumibot.traders import Trader
from datetime import datetime
from alpaca_trade_api import REST

API_KEY = "PKZMNP63HL85U73H6BYY"
API_SECRET = "UoE2qOlDId6PIU0j08L5qOtH2tgZNYuFTf6RQ42J"
BASE_URL = "https://paper-api.alpaca.markets"

ALPACA_CREDS = {
    "API_KEY": API_KEY,
    "API_SECRET": API_SECRET,
    "PAPER": True
}

def download_stock_data(stock_symbol):
    return yf.download(stock_symbol)[["Close"]].pct_change(1)

def preprocess_data(df):
    df.columns = ["returns"]
    df["returns t-1"] = df[["returns"]].shift(1)
    df["mean returns 15"] = df[["returns"]].rolling(15).mean().shift(1)
    df["mean returns 60"] = df[["returns"]].rolling(60).mean().shift(1)
    df["volatility returns 15"] = df[["returns"]].rolling(15).std().shift(1)
    df["volatility returns 60"] = df[["returns"]].rolling(60).std().shift(1)
    df = df.dropna()
    return df

class MLTrader(Strategy):
    def initialize(self, symbol: str = "SPY", cash_at_risk: float = 0.5):
        self.symbol = symbol
        self.sleeptime = "12H"
        self.last_trade = None
        self.cash_at_risk = cash_at_risk
        self.api = REST(base_url=BASE_URL, key_id=API_KEY, secret_key=API_SECRET)

    def position_sizing(self):
        cash = self.get_cash()
        last_price = self.get_last_price(self.symbol)
        quantity = round(cash * self.cash_at_risk / last_price, 0)
        return cash, last_price, quantity

    def on_trading_iteration(self):
        cash, last_price, quantity = self.position_sizing()

        df = download_stock_data(self.symbol)
        df = preprocess_data(df)

        split = int(0.80 * len(df))

        X_train = df[
            [
                "returns t-1",
                "mean returns 15",
                "mean returns 60",
                "volatility returns 15",
                "volatility returns 60",
            ]
        ].iloc[:split]

        y_train_reg = df[["returns"]].iloc[:split]
        y_train_cla = np.round(df[["returns"]].iloc[:split] + 0.5)

        model = Sequential()
        model.add(Dense(75, input_shape=(X_train.shape[1],), activation="relu"))
        model.add(Dense(1, activation="sigmoid"))
        model.compile(loss="binary_crossentropy", optimizer="adam")
        model.fit(X_train, y_train_cla, epochs=1, batch_size=32, verbose=1)

        df = yf.download(self.symbol)[["Adj Close"]].pct_change(1)
        df.columns = ["returns"]

        # Features engineering (similar to the training process)
        df["returns t-1"] = df[["returns"]].shift(1)
        df["mean returns 15"] = df[["returns"]].rolling(15).mean().shift(1)
        df["mean returns 60"] = df[["returns"]].rolling(60).mean().shift(1)
        df["volatility returns 15"] = df[["returns"]].rolling(15).std().shift(1)
        df["volatility returns 60"] = df[["returns"]].rolling(60).std().shift(1)
        df = df.dropna()

        # Create features for prediction
        X_pred = df[["returns t-1", "mean returns 15", "mean returns 60",
                     "volatility returns 15", "volatility returns 60"]].tail(1)

        # Initialize the StandardScaler
        sc = StandardScaler()

        # Standardize the features
        X_pred_scaled = sc.fit_transform(X_pred)
        prediction = model.predict(X_pred_scaled)
        # Convert predictions to -1, 0, or 1
        prediction = np.where(prediction == 0, -1, 1)

        if cash > last_price:
            if prediction == 1:
                if self.last_trade == "sell":
                    self.sell_all()
                order = self.create_order(
                    self.symbol,
                    quantity,
                    "buy",
                    type="bracket",
                    take_profit_price=last_price * 1.20,
                    stop_loss_price=last_price * 0.95
                )
                self.submit_order(order)
                self.last_trade = "buy"
            elif prediction == -1:
                if self.last_trade == "buy":
                    self.sell_all()
                order = self.create_order(
                    self.symbol,
                    quantity,
                    "sell",
                    type="bracket",
                    take_profit_price=last_price * 0.80,
                    stop_loss_price=last_price * 1.05
                )
                self.submit_order(order)
                self.last_trade = "sell"

start_date = datetime(2020, 1, 1)
end_date = datetime(2023, 12, 31)
broker = Alpaca(ALPACA_CREDS)
strategy = MLTrader(name='mlstrat', broker=broker,
                    parameters={"symbol": "SPY",
                                "cash_at_risk": 0.5})
strategy.backtest(
    YahooDataBacktesting, 
    start_date, 
    end_date, 
    parameters={"symbol":"SPY", "cash_at_risk":.5}
)
# trader = Trader()
# trader.add_strategy(strategy)
# trader.run_all()
