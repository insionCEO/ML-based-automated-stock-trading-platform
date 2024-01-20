import yfinance as yf
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
import time

def run_strategy_for_symbol(symbol, trading_client):
    pos_held = False

    stock_data = yf.download(symbol, start="2024-01-01", end="2200-12-31", interval="5m")
    close_list = stock_data['Close'].to_numpy()

    X = np.array([close_list[i-5:i] for i in range(5, len(close_list))])
    y = [1 if close_list[i] > np.mean(close_list[i - 5:i]) else 0 for i in range(5, len(close_list))]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf = RandomForestClassifier()
    rf.fit(X_train, y_train)

    while True:
        stock_data = yf.download(symbol, period="1d", interval="5m")
        close_list = stock_data['Close'].to_numpy()
        symbol_alpaca = symbol.replace('-', '/')
        x = close_list[-5:].reshape(1, -1)
        latest_price = close_list[-1]
        pred = rf.predict(x)

        if pred == 1 and not pos_held:
            print(f"Buy signal for {symbol_alpaca}")

            limit_price = float(latest_price) - 0.5
            take_profit_limit_price = round(latest_price * 1.02, 2)
            stop_loss_stop_price = round(latest_price * 0.99, 2)
            loss_per_1 = latest_price - stop_loss_stop_price
            percent_1_cash = float(trading_client.get_account().cash) / 100
            qty_to_buy = min(100, percent_1_cash / loss_per_1)

            print("limit_price:", limit_price)
            print("qty_to_buy:", qty_to_buy)
            print("take_profit_limit_price:", take_profit_limit_price)
            print("stop_loss_stop_price:", stop_loss_stop_price)
            print("percent_1_cash", percent_1_cash)
            print("loss_per_1", loss_per_1)

            market_order_data = MarketOrderRequest(
                symbol=symbol_alpaca,
                qty=int(qty_to_buy),
                side=OrderSide.BUY,
                type='limit',
                order_class="bracket",
                limit_price=limit_price,
                stop_loss=dict(stop_price=stop_loss_stop_price),
                take_profit=dict(limit_price=take_profit_limit_price),
                time_in_force=TimeInForce.DAY
            )

            market_order = trading_client.submit_order(order_data=market_order_data)
            pos_held = True

        elif pred == 0 and pos_held:
            print(f"Sell signal for {symbol_alpaca}")

            qty_to_sell = trading_client.get_open_position(symbol_alpaca).qty
            print(qty_to_sell)

            market_order_data = MarketOrderRequest(
                symbol=symbol_alpaca,
                qty=int(qty_to_sell),
                side=OrderSide.SELL,
                time_in_force=TimeInForce.DAY
            )

            market_order = trading_client.submit_order(order_data=market_order_data)
            pos_held = False

        # time.sleep(60)

# List of stocks in the S&P 500
sp500_symbols = [
    "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "JNJ", "JPM", "V", "PG",
    "WMT", "KO", "INTC", "XOM", "BA", "DIS", "PFE", "CVX", "VZ",
    "CSCO", "IBM", "ADBE", "MMM", "NVDA", "CMCSA", "GS", "GE", "FB", "NFLX",
    "MA", "HD", "T", "ORCL", "MRK", "CAT", "MCD", "IBM", "GM", "GS", "PEP",
    "CSCO", "XOM", "BA", "HON", "VZ", "PFE", "V", "PG", "JNJ"
]

trading_client = TradingClient('PK7C5OO9M7HYPW5SVI1T', 'vE2VroALLWqEVzoQdSpjtBGSOaMyHQ2cIf2i1yPr', paper=True)

for symbol in sp500_symbols:
    run_strategy_for_symbol(symbol, trading_client)
