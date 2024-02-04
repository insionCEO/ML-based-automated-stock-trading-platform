import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "./styles.css";
import { Header } from "../.././MainDashboard/components";
import axios from "axios";

const HeatMap = () => {
	const fetchAlpacaData = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/fetchAlpacaData",
				{
					headers: {
						"Content-Type": "application/json",
						"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
						"APCA-API-SECRET-KEY": import.meta.env
							.VITE_ALPACA_API_SECRET,
					},
				}
			);

			console.log(response.data);
		} catch (error) {
			console.error(
				"Error fetching data from Alpaca API:",
				error.message
			);
		}
	};

	fetchAlpacaData();

	let randomNumbers = Array.from(
		{ length: 365 },
		() => Math.floor(Math.random() * 100) - 50
	);
	let timestamp = Array.from({ length: 365 }, (_, i) => {
		let date = new Date();
		date.setDate(date.getDate() - i);
		return Math.floor(date.getTime() / 1000);
	}).reverse();
	const data = {
		timestamp: timestamp,
		profit_loss: randomNumbers,
	};

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
