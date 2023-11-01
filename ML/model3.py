import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import datetime as dt
import re
from wordcloud import WordCloud, STOPWORDS
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import snscrape.modules.twitter as sntwitter
import nltk

nltk.download('vader_lexicon')

query = input("Query: ")

if query != '':
    noOfTweet = input("Number of Tweets: ")
    if noOfTweet != '':
        noOfDays = input("Number of Days: ")
        if noOfDays != '':
            tweets_list = []
            now = dt.date.today()
            now = now.strftime('%Y-%m-%d')
            yesterday = dt.date.today() - dt.timedelta(days=int(noOfDays))
            yesterday = yesterday.strftime('%Y-%m-%d')
            
            for i, tweet in enumerate(sntwitter.TwitterSearchScraper(query + ' lang:en since:' + yesterday + ' until:' + now + ' -filter:links -filter:replies').get_items()):
                if i > int(noOfTweet):
                    break
                tweets_list.append([tweet.date, tweet.id, tweet.content, tweet.username])

            df = pd.DataFrame(tweets_list, columns=['Datetime', 'Tweet Id', 'Text', 'Username'])

if 'Text' in df.columns:
    def cleanTxt(text):
        text = re.sub('@[A-Za-z0–9]+', '', text)
        text = re.sub('#', '', text)
        text = re.sub('RT[\s]+', '', text)
        text = re.sub('https?:\/\/\S+', '', text)
        return text

    if 'Text' in df.columns:
        df["Text"] = df["Text"].apply(cleanTxt)

    def percentage(part, whole):
        return 100 * float(part) / float(whole)

    positive = 0
    negative = 0
    neutral = 0
    tweet_list1 = []
    neutral_list = []
    negative_list = []
    positive_list = []

    for tweet in df['Text']:
        tweet_list1.append(tweet)
        analyzer = SentimentIntensityAnalyzer().polarity_scores(tweet)
        neg = analyzer['neg']
        neu = analyzer['neu']
        pos = analyzer['pos']
        comp = analyzer['compound']

        if neg > pos:
            negative_list.append(tweet)
            negative += 1
        elif pos > neg:
            positive_list.append(tweet)
            positive += 1
        elif pos == neg:
            neutral_list.append(tweet)
            neutral += 1

    positive = percentage(positive, len(df))
    negative = percentage(negative, len(df))
    neutral = percentage(neutral, len(df))
