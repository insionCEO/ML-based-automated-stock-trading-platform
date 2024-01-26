import React from "react";
import GaugeChart from "react-gauge-chart";

const MarketSentiment = ({ averageSentiment }) => {
	let sentimentLabel;
	if (averageSentiment >= 0 && averageSentiment < 0.25) {
		sentimentLabel = "Negative";
	} else if (averageSentiment >= 0.25 && averageSentiment < 0.4) {
		sentimentLabel = "Slightly Negative";
	} else if (averageSentiment >= 0.4 && averageSentiment < 0.6) {
		sentimentLabel = "Neutral";
	} else if (averageSentiment >= 0.6 && averageSentiment < 0.75) {
		sentimentLabel = "Slightly Positive";
	} else if (averageSentiment >= 0.75 && averageSentiment <= 1) {
		sentimentLabel = "Positive";
	}

	return (
		<div className="flex flex-col bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
			<div className="self-start flex flex-grow">
				<p className="text-xl font-semibold mb-2">
					Market Sentiment
				</p>
			</div>
			{averageSentiment > 0 && (
				<div className="text-center mb-4">
					<p className="text-lg font-semibold">{sentimentLabel}</p>
				</div>
			)}
			<div className="flex-grow md:w-full overflow-auto">
				<GaugeChart
					id="gauge-chart2"
					nrOfLevels={20}
					percent={averageSentiment}
				/>
			</div>
		</div>
	);
};

export default MarketSentiment;
