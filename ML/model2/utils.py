import yfinance as yf
import numpy as np
import pandas as pd
def preprocessdata_yf(symbol):
    df = yf.download(symbol).dropna()
    df.columns = ["open", "high", "low", "close", "adj_close", "volume"]
    df.index.name = "time"
    del df["adj_close"]
    return df