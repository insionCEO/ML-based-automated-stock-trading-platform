import yfinance as yf
import numpy as np
import time
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from dotenv import load_dotenv

load_dotenv()
client_key = os.getenv('TRADING_CLIENT_KEY')
client_key_secret = os.getenv('TRADING_CLIENT_KEY_SECRET')
trading_client = TradingClient(client_key, client_key_secret, paper=True)

symb = "SPY"
pos_held = False

stock_data = yf.download(symb, start="2024-01-01", end="2200-12-31", interval="5m")
close_list = stock_data['Close'].to_numpy()

X = []
for i in range(5, len(close_list)):
    x = []
    for j in range(5):
        x.append(close_list[i - j])
    X.append(x)
X = np.array(X)

y = []
for i in range(5, len(close_list)):
    if close_list[i] > np.mean(close_list[i - 5:i]):
        y.append(1)
    else:
        y.append(0)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier()
rf.fit(X_train, y_train)

max_position_size = 100
trailing_stop_pct = 0.25

while True:
    stock_data = yf.download(symb, period="1d", interval="5m")
    close_list = stock_data['Close'].to_numpy()

    x = close_list[-5:]
    x = np.array(x).reshape(1, -1)
    latest_price = close_list[-1]
    pred = rf.predict(x)

    if pred == 1 and not pos_held:
        print("Buy")

        limit_price = float(latest_price) - 0.5 
        qty_to_buy = float(trading_client.get_account().cash) / float(latest_price)

        take_profit_limit_price = round(latest_price * 1.02, 2)
        stop_loss_stop_price = round(latest_price * 0.99, 2)

        trailing_stop_price = round(latest_price * 0.9975, 2)

        print("limit_price:", limit_price)
        print("qty_to_buy:", qty_to_buy)
        print("take_profit_limit_price:", take_profit_limit_price)
        print("stop_loss_stop_price:", stop_loss_stop_price)
        print("trailing_stop_price:", trailing_stop_price)

        market_order_data = MarketOrderRequest(
            symbol=symb,
            qty=int(qty_to_buy),
            side=OrderSide.BUY,
            type='limit',
            order_class="bracket",
            limit_price=limit_price,
            stop_loss=dict(stop_price=stop_loss_stop_price),
            take_profit=dict(limit_price=take_profit_limit_price),
            trail_price=trailing_stop_price,
            time_in_force=TimeInForce.DAY
        )

        market_order = trading_client.submit_order(order_data=market_order_data)
        pos_held = True

    elif pred == 0 and pos_held:
        print("Sell")

        qty_to_sell = trading_client.get_open_position(symb).qty
        print(qty_to_sell)

        market_order_data = MarketOrderRequest(
            symbol=symb,
            qty=int(qty_to_sell),
            side=OrderSide.SELL,
            time_in_force=TimeInForce.DAY
        )

        market_order = trading_client.submit_order(order_data=market_order_data)
        pos_held = False

    time.sleep(10)
