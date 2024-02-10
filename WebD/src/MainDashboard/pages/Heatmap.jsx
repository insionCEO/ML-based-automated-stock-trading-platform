import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "./styles.css";
import Header from "../components/Header";

const HeatMap = () => {
	const [data, setData] = useState({
		timestamp: [],
		profit_loss: [],
	});

	const fetchAlpacaData = async () => {
		const options = {
			method: "GET",
			headers: {
				accept: "application/json",
				"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
				"APCA-API-SECRET-KEY": import.meta.env
					.VITE_ALPACA_API_SECRET,
			},
		};

		try {
			const response = await fetch(
				"https://paper-api.alpaca.markets/v2/account/portfolio/history?period=1A&timeframe=1D&intraday_reporting=market_hours&pnl_reset=per_day",
				options
			);
			const responseData = await response.json();

			const { timestamp, profit_loss } = responseData;
			setData({ timestamp, profit_loss });
		} catch (error) {
			console.error(
				"Error fetching data from Alpaca API:",
				error.message
			);
		}
	};

	useEffect(() => {
		fetchAlpacaData();
	}, []);

	const heatmapData = data.timestamp.map((ts, i) => {
		const date = new Date(ts * 1000);
		return {
			date: date.toISOString().split("T")[0],
			count: data.profit_loss[i] === null ? 0 : data.profit_loss[i],
		};
	});

	console.log("heatmapData:", heatmapData);

	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-secondary-dark-bg rounded-3xl">
			<Header title="Your HeatMap" />
			<div className="heatmap">
				<CalendarHeatmap
					startDate={new Date(data.timestamp[0] * 1000)}
					endDate={
						new Date(
							data.timestamp[data.timestamp.length - 1] * 1000
						)
					}
					values={heatmapData}
					classForValue={(value) => {
						if (!value) {
							return "color-empty";
						}
						var scaledCount = 0;
						if (value.count < 0) {
							scaledCount = Math.abs(value.count) / 10 + 6;
							return `color-gitlab-${Math.floor(scaledCount)}`;
						} else {
							scaledCount = value.count / 10 + 1;
							return `color-github-${Math.floor(scaledCount)}`;
						}
					}}
				/>
			</div>
		</div>
	);
};

export default HeatMap;
