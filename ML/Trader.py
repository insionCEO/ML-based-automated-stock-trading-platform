# import numpy as np
# import pandas as pd
# import yfinance as yf
# from sklearn.preprocessing import StandardScaler
# from keras.models import Sequential
# from keras.layers import Dense
# from lumibot.brokers import Alpaca
# from lumibot.backtesting import YahooDataBacktesting
# from lumibot.strategies.strategy import Strategy
# from lumibot.traders import Trader
# from datetime import datetime
# from alpaca_trade_api import REST
#from dotenv import load_dotenv
#load_dotenv() #to load the .env file


# API_KEY = os.getenv('TRADER_API_KEY')
# API_SECRET = os.getenv('TRADER_API_KEY_SECRET')
# BASE_URL = "https://paper-api.alpaca.markets"

# ALPACA_CREDS = {
#     "API_KEY": API_KEY,
#     "API_SECRET": API_SECRET,
#     "PAPER": True
# }

# def download_stock_data(stock_symbol):
#     return yf.download(stock_symbol)[["Close"]].pct_change(1)

# def preprocess_data(df):
#     df.columns = ["returns"]
#     df["returns t-1"] = df[["returns"]].shift(1)
#     df["mean returns 15"] = df[["returns"]].rolling(15).mean().shift(1)
#     df["mean returns 60"] = df[["returns"]].rolling(60).mean().shift(1)
#     df["volatility returns 15"] = df[["returns"]].rolling(15).std().shift(1)
#     df["volatility returns 60"] = df[["returns"]].rolling(60).std().shift(1)
#     df = df.dropna()
#     return df

# class MLTrader(Strategy):
#     def initialize(self, symbol: str = "AAPL", cash_at_risk: float = 0.5):
#         self.symbol = symbol
#         self.sleeptime = "24H"
#         self.last_trade = None
#         self.cash_at_risk = cash_at_risk
#         self.api = REST(base_url=BASE_URL, key_id=API_KEY, secret_key=API_SECRET)

#     def position_sizing(self):
#         cash = self.get_cash()
#         last_price = self.get_last_price(self.symbol)
#         quantity = round(cash * self.cash_at_risk / last_price, 0)
#         return cash, last_price, quantity

#     def on_trading_iteration(self):
#         cash, last_price, quantity = self.position_sizing()

#         df = download_stock_data(self.symbol)
#         df = preprocess_data(df)

#         split = int(0.80 * len(df))

#         X_train = df[
#             [
#                 "returns t-1",
#                 "mean returns 15",
#                 "mean returns 60",
#                 "volatility returns 15",
#                 "volatility returns 60",
#             ]
#         ].iloc[:split]

#         y_train_reg = df[["returns"]].iloc[:split]
#         y_train_cla = np.round(df[["returns"]].iloc[:split] + 0.5)

#         model = Sequential()
#         model.add(Dense(75, input_shape=(X_train.shape[1],), activation="relu"))
#         model.add(Dense(1, activation="sigmoid"))
#         model.compile(loss="binary_crossentropy", optimizer="adam")
#         model.fit(X_train, y_train_cla, epochs=10, batch_size=32, verbose=1)

#         df_pred = download_stock_data(self.symbol)
#         df_pred = preprocess_data(df_pred)

#         X_pred = df_pred[
#             [
#                 "returns t-1",
#                 "mean returns 15",
#                 "mean returns 60",
#                 "volatility returns 15",
#                 "volatility returns 60",
#             ]
#         ].tail(1)

#         sc = StandardScaler()
#         X_pred_scaled = sc.fit_transform(X_pred)
#         prediction = model.predict(X_pred_scaled)
#         prediction = np.where(prediction == 0, -1, 1)

#         if cash > last_price:
#             if prediction == 1:
#                 if self.last_trade == "sell":
#                     self.sell_all()
#                 order = self.create_order(
#                     self.symbol,
#                     quantity,
#                     "buy",
#                     type="bracket",
#                     take_profit_price=last_price * 1.20,
#                     stop_loss_price=last_price * 0.95
#                 )
#                 self.submit_order(order)
#                 self.last_trade = "buy"
#             elif prediction == -1:
#                 if self.last_trade == "buy":
#                     self.sell_all()
#                 order = self.create_order(
#                     self.symbol,
#                     quantity,
#                     "sell",
#                     type="bracket",
#                     take_profit_price=last_price * 0.80,
#                     stop_loss_price=last_price * 1.05
#                 )
#                 self.submit_order(order)
#                 self.last_trade = "sell"

# start_date = datetime(2023, 10, 1)
# end_date = datetime(2023, 12, 31)
# broker = Alpaca(ALPACA_CREDS)
# strategy = MLTrader(name='mlstrat', broker=broker,
#                     parameters={"symbol": "AAPL",
#                                 "cash_at_risk": 0.5})
# strategy.backtest(
#     YahooDataBacktesting, 
#     start_date, 
#     end_date, 
#     parameters={"symbol":"AAPL", "cash_at_risk":.5}
# )
# # trader = Trader()
# # trader.add_strategy(strategy)
# # trader.run_all()

import numpy as np
import pandas as pd
import yfinance as yf
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from lumibot.brokers import Alpaca
from lumibot.backtesting import YahooDataBacktesting
from lumibot.strategies.strategy import Strategy
from datetime import datetime
from dotenv import load_dotenv

load_dotenv() #to load the .env file


API_KEY = os.getenv('TRADER_API_KEY')
API_SECRET = os.getenv('TRADER_API_KEY_SECRET')
BASE_URL = "https://paper-api.alpaca.markets"

ALPACA_CREDS = {
    "API_KEY":API_KEY, 
    "API_SECRET": API_SECRET, 
    "PAPER": True
}

device = "cuda:0" if torch.cuda.is_available() else "cpu"

class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size):
        super(LSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(device)
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc(out[:, -1, :])
        return out

class MLTrader(Strategy):
    def initialize(self, symbol: str = "SPY", lookback_window: int = 50, cash_at_risk: float = 0.5):
        self.symbol = symbol
        self.sleeptime = "12H"
        self.lookback_window = lookback_window
        self.cash_at_risk = cash_at_risk
        self.last_trade = None
        self.api = REST(base_url=BASE_URL, key_id=API_KEY, secret_key=API_SECRET)


    def preprocess_data(self, df):
        df['returns'] = df['Close'].pct_change()
        df['target'] = np.where(df['returns'].shift(-1) > 0, 1, 0)
        df.dropna(inplace=True)
        return df

    def create_sequences(self, data):
        sequences = []
        for i in range(len(data) - self.lookback_window):
            seq = data[i:i+self.lookback_window]
            sequences.append((seq,))
        return sequences

    def train_lstm(self, train_loader):
        model = LSTMModel(input_size=1, hidden_size=64, num_layers=2, output_size=1).to(device)
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

        num_epochs = 10
        for epoch in range(num_epochs):
            for sequences, targets in train_loader:
                sequences = sequences.to(device).float()
                targets = targets.to(device).float()

                # Forward pass
                outputs = model(sequences)
                loss = criterion(outputs, targets)

                # Backward and optimize
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

    def on_trading_iteration(self):
        # Download historical data
        start_date = datetime.now() - pd.DateOffset(years=1) # Adjust as per your requirement
        end_date = datetime.now()
        df = yf.download(self.symbol, start=start_date, end=end_date)

        # Preprocess data
        df = self.preprocess_data(df)

        # Create sequences
        sequences = self.create_sequences(df['Close'].values.reshape(-1, 1))

        # Split data into train and test sets
        train_size = int(0.8 * len(sequences))
        train_data = sequences[:train_size]
        train_loader = DataLoader(train_data, batch_size=64, shuffle=False)

        # Train LSTM model
        self.train_lstm(train_loader)

        # Get last sequence for prediction
        last_sequence = torch.tensor(sequences[-1][0]).view(1, -1, 1).to(device).float()

        # Make prediction
        model = LSTMModel(input_size=1, hidden_size=64, num_layers=2, output_size=1).to(device)
        model.load_state_dict(torch.load('lstm_model.pth'))  # Load trained model
        model.eval()
        with torch.no_grad():
            pred = model(last_sequence)

        # Calculate cash, quantity, and last price
        cash = self.get_cash()
        last_price = self.get_last_price(self.symbol)
        quantity = round(cash * self.cash_at_risk / last_price, 0)

        # Generate trading signals
        if pred > 0.5 and self.last_trade != 'buy':
            # Buy signal
            self.buy(self.symbol, quantity)
            self.last_trade = 'buy'
        elif pred <= 0.5 and self.last_trade != 'sell':
            # Sell signal
            self.sell(self.symbol, quantity)
            self.last_trade = 'sell'

# Define parameters
symbol = "AAPL"  # Example symbol
lookback_window = 50
cash_at_risk = 0.5

# Initialize strategy
strategy = MLTrader(name='LSTM Trading Strategy', parameters={"symbol": symbol, "lookback_window": lookback_window, "cash_at_risk": cash_at_risk})

# Define backtesting period
start_date = datetime(2020, 1, 1)
end_date = datetime(2023, 12, 31)

# Run backtest
broker = Alpaca({"API_KEY": "your_api_key", "API_SECRET": "your_api_secret", "PAPER": True})  # Adjust with your Alpaca credentials
strategy.backtest(YahooDataBacktesting, start_date, end_date)
