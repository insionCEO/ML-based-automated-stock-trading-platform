import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ReactApexChart from "react-apexcharts";
import { HashLoader } from "react-spinners";

const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
		"APCA-API-SECRET-KEY": import.meta.env.VITE_ALPACA_API_SECRET,
	},
};

const Loader = () => (
	<div className="flex flex-col items-center justify-center h-full">
		<HashLoader className="" color="#79E6EA" size={60} />
		<p className="mt-8 text-white text-2xl font-semibold animate-pulse">
			Loading...
		</p>
	</div>
);

const FinancialPositionsPage = () => {
	const [loading, setLoading] = useState(true);
	const [positions, setPositions] = useState([]);
	const [buyCost, setBuyCost] = useState(0);
	const [sellCostBasis, setSellCostBasis] = useState(0);
	const [totalBuyingPower, setTotalBuyingPower] = useState(0);

	useEffect(() => {
		Promise.all([
			fetch(
				"https://paper-api.alpaca.markets/v2/positions",
				options
			),
			fetch("https://paper-api.alpaca.markets/v2/account", options),
		])
			.then(([positionsRes, accountRes]) =>
				Promise.all([positionsRes.json(), accountRes.json()])
			)
			.then(([positionsData, accountData]) => {
				const rowData = positionsData.map((position) => ({
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
				setTotalBuyingPower(parseFloat(accountData.buying_power));
				setPositions(rowData);
			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, []);

	const colDefs = useMemo(
		() => [
			{ field: "Symbol" },
			{ field: "Quantity" },
			{ field: "Avg Entry Price" },
			{ field: "Side" },
			{ field: "Market Value" },
			{ field: "Unrealized P/L" },
			{ field: "Current Price" },
		],
		[]
	);

	if (loading) {
		return <Loader />;
	}

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
					buyTotal={buyCost}
					sellTotal={sellCostBasis}
					chartId="chart1"
				/>
				<ApexValueUsedChart
					buyTotal={buyCost}
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
	const seriesData = useMemo(
		() => [buyTotal, -sellTotal],
		[buyTotal, sellTotal]
	);
	const labels = useMemo(() => ["Buy Total", "Sell Total"], []);

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
	const usedBuyingPower = useMemo(
		() => buyTotal - sellTotal,
		[buyTotal, sellTotal]
	);
	const availableBuyingPower = useMemo(
		() => totalBuyingPower - usedBuyingPower,
		[totalBuyingPower, usedBuyingPower]
	);

	const seriesData = useMemo(
		() => [usedBuyingPower, availableBuyingPower],
		[usedBuyingPower, availableBuyingPower]
	);
	const labels = useMemo(
		() => ["Used Buying Power", "Available Buying Power"],
		[]
	);

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
