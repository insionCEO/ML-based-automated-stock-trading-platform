import pandas as pd

data = pd.read_csv("ind_nifty500list.csv")
symbol_list = data["Symbol"].tolist()
symbol_list_ns = [symbol + ".NS" for symbol in symbol_list]
import os

models_directory = "models"
os.makedirs(models_directory, exist_ok=True)
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense


checkpoint_file = "checkpoint.txt"


# Function to load the checkpoint file
def load_checkpoint():
    if os.path.exists(checkpoint_file):
        with open(checkpoint_file, "r") as file:
            processed_symbols = file.read().splitlines()
        return set(processed_symbols)
    return set()


# Function to save the checkpoint file
def save_checkpoint(symbol):
    with open(checkpoint_file, "a") as file:
        file.write(f"{symbol}\n")


# Assuming symbol_list_ns is your list of stock symbols with ".NS" appended
processed_symbols = load_checkpoint()

# Assuming symbol_list_ns is your list of stock symbols with ".NS" appended
for stock_symbol in symbol_list_ns:
    if stock_symbol not in processed_symbols:
        try:
            # Download the data
            df = yf.download(stock_symbol)[["Close"]].pct_change(1)
            df.columns = ["returns"]

            # Feature engineering
            df["returns t-1"] = df[["returns"]].shift(1)
            df["mean returns 15"] = df[["returns"]].rolling(15).mean().shift(1)
            df["mean returns 60"] = df[["returns"]].rolling(60).mean().shift(1)
            df["volatility returns 15"] = df[["returns"]].rolling(15).std().shift(1)
            df["volatility returns 60"] = df[["returns"]].rolling(60).std().shift(1)

            # Drop missing values
            df = df.dropna()

            # Percentage train set
            split = int(0.80 * len(df))

            # Train set creation
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

            # Test set creation
            X_test = df[
                [
                    "returns t-1",
                    "mean returns 15",
                    "mean returns 60",
                    "volatility returns 15",
                    "volatility returns 60",
                ]
            ].iloc[split:]

            y_test_reg = df[["returns"]].iloc[split:]
            y_test_cla = np.round(df[["returns"]].iloc[split:] + 0.5)

            # Normalization
            sc = StandardScaler()
            X_train_scaled = sc.fit_transform(X_train)
            X_test_scaled = sc.transform(X_test)

            # Neural network model
            nb_hidden_layer = 1
            classifier = Sequential()

            for _ in range(nb_hidden_layer):
                classifier.add(
                    Dense(75, input_shape=(X_train.shape[1],), activation="relu")
                )

            classifier.add(Dense(1, activation="sigmoid"))
            classifier.compile(loss="binary_crossentropy", optimizer="adam")

            # Training
            classifier.fit(
                X_train_scaled, y_train_cla, epochs=15, batch_size=150, verbose=1
            )

            # Save the model
            classifier.save(f"{models_directory}/{stock_symbol}.h5")

            save_checkpoint(stock_symbol)

        except Exception as e:
            print(f"Error processing {stock_symbol}: {e}")

print("Models saved successfully.")
