import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const AreaChart = () => {
	const [state, setState] = useState({
		options: {
			chart: {
				id: "basic-bar",
				zoom: false,
				pan: false,
				reset: false,
				menu: false,
			},
			xaxis: {
				categories: [],
				labels: {
					style: {
						colors: "#ffffff",
						fontSize: "10px",
					},
				},
			},
		},
		series: [
			{
				name: "Price",
				data: [],
			},
		],
	});

	useEffect(() => {
		const fetchData = async () => {
			const apiOptions = {
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
					"https://paper-api.alpaca.markets/v2/account/portfolio/history?intraday_reporting=market_hours&pnl_reset=per_day",
					apiOptions
				);
				const data = await response.json();

				const categories = data.timestamp.map((timestamp) => {
					const dateObject = new Date(timestamp * 1000);
					return dateObject.toLocaleDateString();
				});

				const seriesData = data.equity;

				setState({
					options: {
						chart: {
							id: "basic-bar",
							zoom: false,
							pan: false,
							reset: false,
							menu: false,
						},
						xaxis: {
							categories: categories,
							labels: {
								style: {
									colors: "#ffffff",
								},
							},
						},
					},
					series: [
						{
							name: "Price",
							data: seriesData,
						},
					],
				});
			} catch (err) {
				console.error(err);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<Chart
				options={state.options}
				series={state.series}
				type="line"
				height={400}
				width={700}
			/>
		</div>
	);
};

export default AreaChart;
