from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load the pre-trained model
# model_path = "path_to_your_trained_model"  # Replace with the actual path
# model = load_model(model_path)


def generate_signals(stock_symbol):
    # Download historical data
    df = yf.download(stock_symbol)[["Adj Close"]].pct_change(1)
    df.columns = ["returns"]

    # Features engeeniring
    df["returns t-1"] = df[["returns"]].shift(1)

    # Mean of returns
    df["mean returns 15"] = df[["returns"]].rolling(15).mean().shift(1)
    df["mean returns 60"] = df[["returns"]].rolling(60).mean().shift(1)

    # Volatility of returns
    df["volatility returns 15"] = df[["returns"]].rolling(15).std().shift(1)
    df["volatility returns 60"] = df[["returns"]].rolling(60).std().shift(1)

    # Drop missing values
    df = df.dropna()

    # Normalize features (similar to your code)
    sc = StandardScaler()
    X = df[
        [
            "returns t-1",
            "mean returns 15",
            "mean returns 60",
            "volatility returns 15",
            "volatility returns 60",
        ]
    ].values
    X_scaled = sc.fit_transform(X)

    # Make predictions
    predictions = model.predict(X_scaled)
    signals = np.where(predictions == 0, -1, 1)

    # Create a DataFrame with signals
    signals_df = pd.DataFrame({"Date": df.index, "Signal": signals})
    signals_df.set_index("Date", inplace=True)

    return signals_df


@app.route("/get_signals/<stock_symbol>", methods=["GET"])
def get_signals():
    stock_symbol = request.args.get("stock_symbol")
    if not stock_symbol:
        return jsonify({"error": "Stock symbol parameter is missing"}), 400

    try:
        signals_df = generate_signals(stock_symbol)
        signals_json = signals_df.to_dict(orient="index")
        return jsonify(signals_json)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
