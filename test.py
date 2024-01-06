import pandas as pd
import numpy as np
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

plt.style.use("ggplot")
import math, random
from datetime import datetime
import datetime as dt
import yfinance as yf
import mysql.connector

con = mysql.connector.connect(
    host="localhost", user="root", password="harish12345678", database="stocks"
)
cur = con.cursor()
meta = yf.Ticker("META")
infometa = meta.fast_info
google = yf.Ticker("GOOG")
infogoogle = google.fast_info
amazon = yf.Ticker("AMZN")
infoamazon = amazon.fast_info
mlp = round(infometa["last_price"], 3)
mcp = round(infometa["regular_market_previous_close"], 3)
glp = round(infogoogle["last_price"], 3)
gcp = round(infogoogle["regular_market_previous_close"], 3)
alp = round(infoamazon["last_price"], 3)
acp = round(infoamazon["regular_market_previous_close"], 3)
portfolio = 0
totalprofit = 0
flag = 0
print("Welcome to Stoxxy...Happy trading!")
while flag == 0:
    print("")
    print("Press 1 to buy")
    print("Press 2 to sell")
    print("press 3 to view your portfolio")
    print("press 4 to see future valuation")
    print("press 5 to exit")
    print(" ")
    ch = int(input("Enter choice"))
    if ch == 1:
        print("Here are the available stocks")
        print("")
        print("1.Meta:")
        print("Price:", mlp)
        print("Previous close", mcp)
        print("")
        print("2.Google:")
        print("Price:", glp)
        print("Previous close:", gcp)
        print("")
        print("3.Amazon:")
        print("Price:", alp)
        print("Previous close:", acp)
        print("")
        chb = int(input("Enter the serial number of the stock you want to buy"))
        volb = float(input("Enter number of shares"))
        if chb == 1:
            net = mlp * volb
            portfolio = portfolio + net
            sql = "INSERT INTO stock (Name, Volume,Buy_price,Net_price) VALUES (%s, %s,%s,%s)"
            val = ("Meta", volb, mlp, net)
            cur.execute(sql, val)
            con.commit()
            print("Successuly bought!")
            print("Current portfolio value:", portfolio)
        if chb == 2:
            net = glp * volb
            portfolio = portfolio + net
            sql = "INSERT INTO stock (Name, Volume,Buy_price,Net_price) VALUES (%s, %s,%s,%s)"
            val = ("Google", volb, glp, net)
            cur.execute(sql, val)
            con.commit()
            print("Successuly bought!")
            print("Current portfolio value:", portfolio)
        if chb == 3:
            net = alp * volb
            portfolio = portfolio + net
            sql = "INSERT INTO stock (Name, Volume,Buy_price,Net_price) VALUES (%s, %s,%s,%s)"
            val = ("Amazon", volb, alp, net)
            cur.execute(sql, val)
            con.commit()
            print("Successuly bought!")
            print("Current portfolio value:", portfolio)
        flag = 0

    elif ch == 2:
        print("Available stocks:")
        print("")
        query = "select * from stock"
        cur.execute(query)
        records = cur.fetchall()
        for x in records:
            print(x)
        name = str(input("Enter name of stock you want to sell"))
        vols = int(input("Enter number of shares to be sold"))
        if name == "Meta":
            msp = round(infometa["last_price"], 3)
            profit = (msp * vols) - (mlp * vols)
            totalprofit = totalprofit + profit
            sql = "delete from stock where Name='Meta'"
            cur.execute(sql)
            con.commit()
            print("Sucessuly sold for a profit of:", profit)
        elif name == "Google":
            gsp = round(infogoogle["last_price"], 3)
            profit = (gsp * vols) - (glp * vols)
            totalprofit = totalprofit + profit
            sql = "delete from stock where Name='Google'"
            cur.execute(sql)
            con.commit()
            print("Sucessuly sold for a profit of:", profit)
        elif name == "Amazon":
            asp = round(infoamazon["last_price"], 3)
            profit = (asp * vols) - (alp * vols)
            totalprofit = totalprofit + profit
            sql = "delete from stock where Name='Amazon'"
            cur.execute(sql)
            con.commit()
            print("Sucessuly sold for a profit of:", profit)
        else:
            print("Stock unavaiilable")
    elif ch == 3:
        query = "select * from stock"
        cur.execute(query)
        records = cur.fetchall()
        for x in records:
            print(x)
        print("")
        print("Total profit:", totalprofit)

    elif ch == 4:
        print("Here are the available stocks")
        print("")
        print("1.Meta:")
        print("Price:", mlp)
        print("Previous close", mcp)
        print("")
        print("2.Google:")
        print("Price:", glp)
        print("Previous close:", gcp)
        print("")
        print("3.Amazon:")
        print("Price:", alp)
        print("Previous close:", acp)
        print("")
        chp = int(input("Enter the serial number of the stock you want to predict"))
        if chp == 1:
            # Set the start and end date
            start_date = "2018-01-01"
            end_date = "2023-01-01"

            # Set the ticker
            ticker = "META"

            # Get the data
            data = yf.download(ticker, start_date, end_date)

            # Print the last 5 rows
            print(data.tail(10000))
            data.to_csv("META.csv")
            df = pd.read_csv("META.csv")
            dataset_train = df.iloc[0 : int(0.8 * len(df)), :]
            dataset_test = df.iloc[int(0.8 * len(df)) :, :]
            n = int(input("value of days after which you wanna know price"))
            ############# NOTE #################
            # TO PREDICT STOCK PRICES OF NEXT N DAYS, STORE PREVIOUS N DAYS IN MEMORY WHILE TRAINING
            # HERE N=7
            ###dataset_train=pd.read_csv('Google_Stock_Price_Train.csv')
            training_set = df.iloc[
                :, 4:5
            ].values  # 1:2, to store as numpy array else Series obj will be stored
            # select cols using above manner to select as float64 type, view in var explorer

            # Feature Scaling
            from sklearn.preprocessing import MinMaxScaler

            sc = MinMaxScaler(feature_range=(0, 1))  # Scaled values btween 0,1
            training_set_scaled = sc.fit_transform(training_set)
            # In scaling, fit_transform for training, transform for test

            # Creating data stucture with 7 timesteps and 1 output.
            # 7 timesteps meaning storing trends from 7 days before current day to predict 1 next output
            X_train = []  # memory with 7 days from day i
            y_train = []  # day i
            for i in range(n, len(training_set_scaled)):
                X_train.append(training_set_scaled[i - n : i, 0])
                y_train.append(training_set_scaled[i, 0])
            # Convert list to numpy arrays
            X_train = np.array(X_train)
            y_train = np.array(y_train)
            X_forecast = np.array(X_train[-1, 1:])
            X_forecast = np.append(X_forecast, y_train[-1])
            # Reshaping: Adding 3rd dimension
            X_train = np.reshape(
                X_train, (X_train.shape[0], X_train.shape[1], 1)
            )  # .shape 0=row,1=col
            X_forecast = np.reshape(X_forecast, (1, X_forecast.shape[0], 1))
            # For X_train=np.reshape(no. of rows/samples, timesteps, no. of cols/features)

            # Building RNN
            from keras.models import Sequential
            from keras.layers import Dense
            from keras.layers import Dropout
            from keras.layers import LSTM

            # Initialise RNN
            regressor = Sequential()

            # Add first LSTM layer
            regressor.add(
                LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1))
            )
            # units=no. of neurons in layer
            # input_shape=(timesteps,no. of cols/features)
            # return_seq=True for sending recc memory. For last layer, retrun_seq=False since end of the line
            regressor.add(Dropout(0.1))

            # Add 2nd LSTM layer
            regressor.add(LSTM(units=50, return_sequences=True))
            regressor.add(Dropout(0.1))

            # Add 3rd LSTM layer
            regressor.add(LSTM(units=50, return_sequences=True))
            regressor.add(Dropout(0.1))

            # Add 4th LSTM layer
            regressor.add(LSTM(units=50))
            regressor.add(Dropout(0.1))

            # Add o/p layer
            regressor.add(Dense(units=1))

            # Compile
            regressor.compile(optimizer="adam", loss="mean_squared_error")

            # Training
            regressor.fit(X_train, y_train, epochs=35, batch_size=32)
            # For lstm, batch_size=power of 2

            # Testing
            dataset_test = pd.read_csv("META.csv")
            real_stock_price = dataset_test.iloc[:, 4:5].values

            # To predict, we need stock prices of 7 days before the test set
            # So combine train and test set to get the entire data set
            dataset_total = pd.concat(
                (dataset_train["Close"], dataset_test["Close"]), axis=0
            )
            testing_set = dataset_total[
                len(dataset_total) - len(dataset_test) - n :
            ].values
            testing_set = testing_set.reshape(-1, 1)
            # -1=till last row, (-1,1)=>(80,1). otherwise only (80,0)

            # Feature scaling
            testing_set = sc.transform(testing_set)

            # Create data structure
            X_test = []
            for i in range(n, len(testing_set)):
                X_test.append(testing_set[i - n : i, 0])
                # Convert list to numpy arrays
            X_test = np.array(X_test)

            # Reshaping: Adding 3rd dimension
            X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

            # Testing Prediction
            predicted_stock_price = regressor.predict(X_test)

            # Getting original prices back from scaled values
            predicted_stock_price = sc.inverse_transform(predicted_stock_price)
            fig = plt.figure(figsize=(7.2, 4.8), dpi=65)
            plt.plot(real_stock_price, label="Actual Price")
            plt.plot(predicted_stock_price, label="Predicted Price")

            plt.legend(loc=4)
            #  plt.savefig('static/LSTM.png')
            #  plt.close(fig)

            error_lstm = math.sqrt(
                mean_squared_error(real_stock_price, predicted_stock_price)
            )

            # Forecasting Prediction
            forecasted_stock_price = regressor.predict(X_forecast)

            # Getting original prices back from scaled values
            forecasted_stock_price = sc.inverse_transform(forecasted_stock_price)

            lstm_pred_meta = forecasted_stock_price[0, 0]

            print("your answer is", lstm_pred_meta)
            from datetime import datetime, timedelta

            X_forecast = np.array(X_train[-1, 1:])
            X_forecast = np.append(X_forecast, y_train[-1])
            print("error is", error_lstm)
        if chp == 2:
            # Set the start and end date
            start_date = "2018-01-01"
            end_date = "2023-01-01"

            # Set the ticker
            ticker = "GOOGL"

            # Get the data
            data = yf.download(ticker, start_date, end_date)

            # Print the last 5 rows
            print(data.tail(10000))
            data.to_csv("GOOGL.csv")
            df = pd.read_csv("GOOGL.csv")
            dataset_train = df.iloc[0 : int(0.8 * len(df)), :]
            dataset_test = df.iloc[int(0.8 * len(df)) :, :]
            n = int(input("value of days after which you wanna know price"))
            ############# NOTE #################
            # TO PREDICT STOCK PRICES OF NEXT N DAYS, STORE PREVIOUS N DAYS IN MEMORY WHILE TRAINING
            # HERE N=7
            ###dataset_train=pd.read_csv('Google_Stock_Price_Train.csv')
            training_set = df.iloc[
                :, 4:5
            ].values  # 1:2, to store as numpy array else Series obj will be stored
            # select cols using above manner to select as float64 type, view in var explorer

            # Feature Scaling
            from sklearn.preprocessing import MinMaxScaler

            sc = MinMaxScaler(feature_range=(0, 1))  # Scaled values btween 0,1
            training_set_scaled = sc.fit_transform(training_set)
            # In scaling, fit_transform for training, transform for test

            # Creating data stucture with 7 timesteps and 1 output.
            # 7 timesteps meaning storing trends from 7 days before current day to predict 1 next output
            X_train = []  # memory with 7 days from day i
            y_train = []  # day i
            for i in range(n, len(training_set_scaled)):
                X_train.append(training_set_scaled[i - n : i, 0])
                y_train.append(training_set_scaled[i, 0])
            # Convert list to numpy arrays
            X_train = np.array(X_train)
            y_train = np.array(y_train)
            X_forecast = np.array(X_train[-1, 1:])
            X_forecast = np.append(X_forecast, y_train[-1])
            # Reshaping: Adding 3rd dimension
            X_train = np.reshape(
                X_train, (X_train.shape[0], X_train.shape[1], 1)
            )  # .shape 0=row,1=col
            X_forecast = np.reshape(X_forecast, (1, X_forecast.shape[0], 1))
            # For X_train=np.reshape(no. of rows/samples, timesteps, no. of cols/features)

            # Building RNN
            from tensorflow.keras.models import Sequential
            from tensorflow.keras.layers import Dense
            from tensorflow.keras.layers import Dropout
            from tensorflow.keras.layers import LSTM

            # Initialise RNN
            regressor = Sequential()

            # Add first LSTM layer
            regressor.add(
                LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1))
            )
            # units=no. of neurons in layer
            # input_shape=(timesteps,no. of cols/features)
            # return_seq=True for sending recc memory. For last layer, retrun_seq=False since end of the line
            regressor.add(Dropout(0.1))

            # Add 2nd LSTM layer
            regressor.add(LSTM(units=50, return_sequences=True))
            regressor.add(Dropout(0.1))

            # Add 3rd LSTM layer
            regressor.add(LSTM(units=50, return_sequences=True))
            regressor.add(Dropout(0.1))

            # Add 4th LSTM layer
            regressor.add(LSTM(units=50))
            regressor.add(Dropout(0.1))

            # Add o/p layer
            regressor.add(Dense(units=1))

            # Compile
            regressor.compile(optimizer="adam", loss="mean_squared_error")

            # Training
            regressor.fit(X_train, y_train, epochs=35, batch_size=32)
            # For lstm, batch_size=power of 2

            # Testing
            dataset_test = pd.read_csv("GOOGL.csv")
            real_stock_price = dataset_test.iloc[:, 4:5].values

            # To predict, we need stock prices of 7 days before the test set
            # So combine train and test set to get the entire data set
            dataset_total = pd.concat(
                (dataset_train["Close"], dataset_test["Close"]), axis=0
            )
            testing_set = dataset_total[
                len(dataset_total) - len(dataset_test) - n :
            ].values
            testing_set = testing_set.reshape(-1, 1)
            # -1=till last row, (-1,1)=>(80,1). otherwise only (80,0)

            # Feature scaling
            testing_set = sc.transform(testing_set)

            # Create data structure
            X_test = []
            for i in range(n, len(testing_set)):
                X_test.append(testing_set[i - n : i, 0])
                # Convert list to numpy arrays
            X_test = np.array(X_test)

            # Reshaping: Adding 3rd dimension
            X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

            # Testing Prediction
            predicted_stock_price = regressor.predict(X_test)

            # Getting original prices back from scaled values
            predicted_stock_price = sc.inverse_transform(predicted_stock_price)
            fig = plt.figure(figsize=(7.2, 4.8), dpi=65)
            plt.plot(real_stock_price, label="Actual Price")
            plt.plot(predicted_stock_price, label="Predicted Price")

            plt.legend(loc=4)
            # plt.savefig('static/LSTM.png')
            #  plt.close(fig)

            error_lstm = math.sqrt(
                mean_squared_error(real_stock_price, predicted_stock_price)
            )

            # Forecasting Prediction
            forecasted_stock_price = regressor.predict(X_forecast)

            # Getting original prices back from scaled values
            forecasted_stock_price = sc.inverse_transform(forecasted_stock_price)

            lstm_pred = forecasted_stock_price[0, 0]

            print("predicted value of one google stock is", lstm_pred)
            from datetime import datetime, timedelta

            X_forecast = np.array(X_train[-1, 1:])
            X_forecast = np.append(X_forecast, y_train[-1])
            print("error is", error_lstm)
        if chp == 3:
            # Set the start and end date
            start_date = "2018-01-01"
            end_date = "2023-01-01"

            # Set the ticker
            ticker = "AMZN"

            # Get the data
            data = yf.download(ticker, start_date, end_date)

            # Print the last 5 rows
            print(data.tail(10000))
            data.to_csv("AMAZ.csv")
            df = pd.read_csv("AMAZ.csv")
            dataset_train = df.iloc[0 : int(0.8 * len(df)), :]
            dataset_test = df.iloc[int(0.8 * len(df)) :, :]
            n = int(input("value of days after which you wanna know price"))
            ############# NOTE #################
            # TO PREDICT STOCK PRICES OF NEXT N DAYS, STORE PREVIOUS N DAYS IN MEMORY WHILE TRAINING
            # HERE N=7
            ###dataset_train=pd.read_csv('Google_Stock_Price_Train.csv')
            training_set = df.iloc[
                :, 4:5
            ].values  # 1:2, to store as numpy array else Series obj will be stored
            # select cols using above manner to select as float64 type, view in var explorer

            # Feature Scaling
            from sklearn.preprocessing import MinMaxScaler

            sc = MinMaxScaler(feature_range=(0, 1))  # Scaled values btween 0,1
            training_set_scaled = sc.fit_transform(training_set)
            # In scaling, fit_transform for training, transform for test

            # Creating data stucture with 7 timesteps and 1 output.
            # 7 timesteps meaning storing trends from 7 days before current day to predict 1 next output
            X_train = []  # memory with 7 days from day i
            y_train = []  # day i
            for i in range(n, len(training_set_scaled)):
                X_train.append(training_set_scaled[i - n : i, 0])
                y_train.append(training_set_scaled[i, 0])
            # Convert list to numpy arrays
            X_train = np.array(X_train)
            y_train = np.array(y_train)
            X_forecast = np.array(X_train[-1, 1:])
            X_forecast = np.append(X_forecast, y_train[-1])
            # Reshaping: Adding 3rd dimension
            X_train = np.reshape(
                X_train, (X_train.shape[0], X_train.shape[1], 1)
            )  # .shape 0=row,1=col
            X_forecast = np.reshape(X_forecast, (1, X_forecast.shape[0], 1))
            # For X_train=np.reshape(no. of rows/samples, timesteps, no. of cols/features)

            # Building RNN
            from keras.models import Sequential
            from keras.layers import Dense
            from keras.layers import Dropout
            from keras.layers import LSTM

            # Initialise RNN
            regressor = Sequential()

            # Add first LSTM layer
            regressor.add(
                LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1))
            )
            # units=no. of neurons in layer
            # input_shape=(timesteps,no. of cols/features)
            # return_seq=True for sending recc memory. For last layer, retrun_seq=False since end of the line
            regressor.add(Dropout(0.1))

            # Add 2nd LSTM layer
            regressor.add(LSTM(units=50, return_sequences=True))
            regressor.add(Dropout(0.1))

            # Add 3rd LSTM layer
            regressor.add(LSTM(units=50, return_sequences=True))
            regressor.add(Dropout(0.1))

            # Add 4th LSTM layer
            regressor.add(LSTM(units=50))
            regressor.add(Dropout(0.1))

            # Add o/p layer
            regressor.add(Dense(units=1))

            # Compile
            regressor.compile(optimizer="adam", loss="mean_squared_error")

            # Training
            regressor.fit(X_train, y_train, epochs=35, batch_size=32)
            # For lstm, batch_size=power of 2

            # Testing
            dataset_test = pd.read_csv("AMAZ.csv")
            real_stock_price = dataset_test.iloc[:, 4:5].values

            # To predict, we need stock prices of 7 days before the test set
            # So combine train and test set to get the entire data set
            dataset_total = pd.concat(
                (dataset_train["Close"], dataset_test["Close"]), axis=0
            )
            testing_set = dataset_total[
                len(dataset_total) - len(dataset_test) - n :
            ].values
            testing_set = testing_set.reshape(-1, 1)
            # -1=till last row, (-1,1)=>(80,1). otherwise only (80,0)

            # Feature scaling
            testing_set = sc.transform(testing_set)

            # Create data structure
            X_test = []
            for i in range(n, len(testing_set)):
                X_test.append(testing_set[i - n : i, 0])
                # Convert list to numpy arrays
            X_test = np.array(X_test)

            # Reshaping: Adding 3rd dimension
            X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

            # Testing Prediction
            predicted_stock_price = regressor.predict(X_test)

            # Getting original prices back from scaled values
            predicted_stock_price = sc.inverse_transform(predicted_stock_price)
            fig = plt.figure(figsize=(7.2, 4.8), dpi=65)
            plt.plot(real_stock_price, label="Actual Price")
            plt.plot(predicted_stock_price, label="Predicted Price")

            plt.legend(loc=4)
            #  plt.savefig('static/LSTM.png')
            #  plt.close(fig)

            error_lstm = math.sqrt(
                mean_squared_error(real_stock_price, predicted_stock_price)
            )

            # Forecasting Prediction
            forecasted_stock_price = regressor.predict(X_forecast)

            # Getting original prices back from scaled values
            forecasted_stock_price = sc.inverse_transform(forecasted_stock_price)

            lstm_pred_amaz = forecasted_stock_price[0, 0]

            print("your answer is", lstm_pred_amaz)
            from datetime import datetime, timedelta

            X_forecast = np.array(X_train[-1, 1:])
            X_forecast = np.append(X_forecast, y_train[-1])
            print("error is", error_lstm)

    elif ch == 5:
        print("Exiting")
        flag = 1
        break
    else:
        print("Wrong input!")
