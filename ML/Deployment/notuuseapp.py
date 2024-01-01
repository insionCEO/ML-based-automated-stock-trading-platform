import tensorflow as tf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller

# plt.style.use("seaborn")
import warnings
from sklearn.preprocessing import StandardScaler

warnings.filterwarnings("ignore")
import yfinance as yf

np.random.seed(69)
import seaborn as sns

symbol = "INFY.NS"
# Import the data
df = yf.download(symbol)[["Adj Close"]].pct_change(1)
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


# NORMALIZATION
# Import the class
from sklearn.preprocessing import StandardScaler

# Initialize the class
sc = StandardScaler()

# Standardize the data
X_train_scaled = sc.fit_transform(X_train)
X_test_scaled = sc.transform(X_test)

np.random.seed(13)
# LIBAIRIES
import tensorflow
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

nb_hidden_layer = 1


# INTIALIZATION SEQUENTIAL MODEL
classifier = Sequential()

# AJOUT COUCHE DENSE ET DROPOUT
for _ in range(nb_hidden_layer):
    classifier.add(Dense(75, input_shape=(X_train.shape[1],), activation="relu"))


# AJOUT COUCHE DENSE
classifier.add(Dense(1, activation="sigmoid"))

# COMPILATION DU MODÈLE
classifier.compile(loss="binary_crossentropy", optimizer="adam")

# TRAINING
classifier.fit(X_train_scaled, y_train_cla, epochs=13, batch_size=150, verbose=1)


# Create predictions for the whole dataset
df["prediction"] = classifier.predict(np.concatenate((X_train, X_test), axis=0))

df["prediction"] = np.where(df["prediction"] == 0, -1, 1)

model_path = f"/content/models/{symbol}.h5"
classifier.save(model_path)
