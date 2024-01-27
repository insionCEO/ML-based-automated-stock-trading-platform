import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ReactApexChart from "react-apexcharts";

const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		"APCA-API-KEY-ID": "PKI1EBX5LM1D0WUN7WU5",
		"APCA-API-SECRET-KEY":
			"CxSsspL84jDujfTUxxGNhWibaexutf18Uf513ABM",
	},
};

const FinancialPositionsPage = () => {
	const [positions, setPositions] = useState([]);
	const [BuyCost, setBuyCost] = useState(0);
	const [sellCostBasis, setSellCostBasis] = useState(0);
	const [totalBuyingPower, setTotalBuyingPower] = useState(0);

	useEffect(() => {
		fetch("https://paper-api.alpaca.markets/v2/positions", options)
			.then((response) => response.json())
			.then((data) => {
				const rowData = data.map((position) => ({
					Symbol: position.symbol,
					Quantity: position.qty,
					"Avg Entry Price": parseFloat(position.avg_entry_price),
					Side: position.side,
					"Market Value": parseFloat(position.market_value),
					"Unrealized P/L": parseFloat(position.unrealized_pl),
					"Current Price": parseFloat(position.current_price),
				}));

				let buyTotal = 0;
				let sellTotal = 0;
				rowData.forEach((position) => {
					if (position.Side === "long") {
						buyTotal +=
							position["Avg Entry Price"] * position.Quantity;
					} else if (position.Side === "short") {
						sellTotal +=
							position["Avg Entry Price"] * position.Quantity;
					}
				});

				setBuyCost(buyTotal);
				setSellCostBasis(sellTotal);

				setPositions(rowData);
			})
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		fetch("https://paper-api.alpaca.markets/v2/account", options)
			.then((response) => response.json())
			.then((data) => {
				const totalBuyingPower = parseFloat(data.buying_power);
				setTotalBuyingPower(totalBuyingPower);
			})
			.catch((err) => console.error(err));
	}, []);

	const [colDefs, setColDefs] = useState([
		{ field: "Symbol" },
		{ field: "Quantity" },
		{ field: "Avg Entry Price" },
		{ field: "Side" },
		{ field: "Market Value" },
		{ field: "Unrealized P/L" },
		{ field: "Current Price" },
	]);

	return (
		<div
			className="centered-container"
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "100vh",
				paddingBottom: "5em",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					width: "100%",
				}}
			>
				<ApexBuySellTotalChart
					buyTotal={BuyCost}
					sellTotal={sellCostBasis}
					chartId="chart1"
				/>
				<ApexValueUsedChart
					buyTotal={BuyCost}
					sellTotal={sellCostBasis}
					totalBuyingPower={totalBuyingPower}
					chartId="chart2"
				/>
			</div>
			<div
				className="ag-theme-quartz-dark"
				style={{ width: "88%", flex: "1" }}
			>
				<AgGridReact rowData={positions} columnDefs={colDefs} />
			</div>
		</div>
	);
};

const ApexBuySellTotalChart = ({ buyTotal, sellTotal, chartId }) => {
	const seriesData = [buyTotal, sellTotal];
	const labels = ["Buy Total", "Sell Total"];

	const options = {
		chart: {
			type: "donut",
			foreColor: "#FFFFFF",
		},
		labels: labels,
		colors: ["#59CE8F", "#FF1E00"],
		plotOptions: {
			pie: {
				dataLabels: {
					style: {
						colors: ["#FFFFFF"],
						fontSize: "13px",
					},
				},
			},
		},
	};

	return (
		<div style={{ width: "25%", marginBottom: "2em" }}>
			<div id={chartId}>
				<ReactApexChart
					options={options}
					series={seriesData}
					type="donut"
				/>
			</div>
		</div>
	);
};

const ApexValueUsedChart = ({
	buyTotal,
	sellTotal,
	chartId,
	totalBuyingPower,
}) => {
	const usedBuyingPower = buyTotal - sellTotal;
	const availableBuyingPower = totalBuyingPower - usedBuyingPower;

	const seriesData = [usedBuyingPower, availableBuyingPower];
	const labels = ["Used Buying Power", "Available Buying Power"];

	const options = {
		chart: {
			type: "donut",
			foreColor: "#FFFFFF",
		},
		labels: labels,
		colors: ["#FF1E00", "#59CE8F"],
		plotOptions: {
			pie: {
				dataLabels: {
					style: {
						colors: ["#FFFFFF"],
						fontSize: "13px",
					},
				},
			},
		},
	};

	return (
		<div style={{ width: "31%", marginBottom: "2em" }}>
			<div id={chartId}>
				<ReactApexChart
					options={options}
					series={seriesData}
					type="donut"
				/>
			</div>
		</div>
	);
};

export default FinancialPositionsPage;
