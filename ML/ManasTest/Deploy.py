#  This is Final Working Deployment API
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import load_model
import yfinance as yf

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # data = request.get_json()

    # Extract stock symbol from the request
    # stock_symbol = data.get('stock_symbol', 'AAPL')
    stock_symbol = "INFY.NS "
    try:
        # Fetch historical data for the given stock symbol
        df = yf.download(stock_symbol)[["Adj Close"]].pct_change(1)
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

        # Load the pre-trained model
        model = load_model(f'{stock_symbol}.h5')

        # Make predictions
        prediction = model.predict(X_pred_scaled)

        # Convert predictions to -1, 0, or 1
        prediction = np.where(prediction == 0, -1, 1)

        return jsonify({'prediction': int(prediction[0])})
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
