import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import datetime as dt
import re
from wordcloud import WordCloud, STOPWORDS
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import snscrape.modules.twitter as sntwitter
import nltk

nltk.download("vader_lexicon")

# query = input("Query: ")

# if query != "":
#     noOfTweet = input("Number of Tweets: ")
#     if noOfTweet != "":
#         noOfDays = input("Number of Days: ")
#         if noOfDays != "":
#             tweets_list = []
#             now = dt.date.today()
#             now = now.strftime("%Y-%m-%d")
#             yesterday = dt.date.today() - dt.timedelta(days=int(noOfDays))
#             yesterday = yesterday.strftime("%Y-%m-%d")

#             for i, tweet in enumerate(
#                 sntwitter.TwitterSearchScraper(
#                     query
#                     + " lang:en since:"
#                     + yesterday
#                     + " until:"
#                     + now
#                     + " -filter:links -filter:replies"
#                 ).get_items()
#             ):
#                 if i > int(noOfTweet):
#                     break
#                 tweets_list.append(
#                     [tweet.date, tweet.id, tweet.content, tweet.username]
#                 )

#             df = pd.DataFrame(
#                 tweets_list, columns=["Datetime", "Tweet Id", "Text", "Username"]
#             )

if "Text" in df.columns:

    def cleanTxt(text):
        text = re.sub("@[A-Za-z0–9]+", "", text)
        text = re.sub("#", "", text)
        text = re.sub("RT[\s]+", "", text)
        text = re.sub("https?:\/\/\S+", "", text)
        return text

    if "Text" in df.columns:
        df["Text"] = df["Text"].apply(cleanTxt)

    def percentage(numerator, denominator):
        return 100 * float(numerator) / float(denominator)

    positive = 0
    negative = 0
    neutral = 0
    tweet_list1 = []
    neutral_list = []
    negative_list = []
    positive_list = []

    for tweet in df["Text"]:
        tweet_list1.append(tweet)
        analyzer = SentimentIntensityAnalyzer().polarity_scores(tweet)
        neg = analyzer["neg"]
        neu = analyzer["neu"]
        pos = analyzer["pos"]
        comp = analyzer["compound"]

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

    tweet_list1 = pd.DataFrame(tweet_list1)
    neutral_list = pd.DataFrame(neutral_list)
    negative_list = pd.DataFrame(negative_list)
    positive_list = pd.DataFrame(positive_list)

    if "Text" in df.columns:
        # print(
        #     "Since " + noOfDays + " days, there have been", len(tweet_list1), "tweets on " + query,
        # )
        print("Positive Sentiment:", "%.2f" % len(positive_list))
        print("Neutral Sentiment:", "%.2f" % len(neutral_list))
        print("Negative Sentiment:", "%.2f" % len(negative_list))

        labels = [
            "Positive [" + str(round(positive)) + "%]",
            "Neutral [" + str(round(neutral)) + "%]",
            "Negative [" + str(round(negative)) + "%]",
        ]
        sizes = [positive, neutral, negative]
        colors = ["yellowgreen", "blue", "red"]
        patches, texts = plt.pie(sizes, colors=colors, startangle=90)
        plt.style.use("default")
        plt.legend(labels)
        plt.title("Sentiment Analysis Result for keyword= " + query)
        plt.axis("equal")
        plt.show()

        def word_cloud(text):
            stopwords = set(STOPWORDS)
            allWords = " ".join([twts for twts in text])
            wordCloud = WordCloud(
                background_color="black",
                width=1600,
                height=800,
                stopwords=stopwords,
                min_font_size=20,
                max_font_size=150,
                colormap="prism",
            ).generate(allWords)

            fig, ax = plt.subplots(figsize=(20, 10), facecolor="k")
            plt.imshow(wordCloud)
            ax.axis("off")
            fig.tight_layout(pad=0)
            plt.show()

        if "Text" in df.columns:
            print("Wordcloud for " + query)
            word_cloud(df["Text"].values)
