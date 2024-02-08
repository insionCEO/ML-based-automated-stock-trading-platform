import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaSearch } from "react-icons/fa";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const SentimentPage = () => {
	const [rowData, setRowData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const gridApi = useRef(null);

	useEffect(() => {
		fetchSentiments();
	}, []);

	const stockSymbols = [
		"AAPL",
		"TSLA",
		"GOOGL",
		"MSFT",
		"AMZN",
		"GME",
		"META",
		"NFLX",
		"NVDA",
		"NKE",
	];

	const fetchSentiments = async () => {
		try {
			const promises = stockSymbols.map(async (symbol) => {
				const response = await fetch(
					`https://financialmodelingprep.com/api/v4/historical/social-sentiment?symbol=${symbol}&page=0&apikey=dCeN43gf03SvvRm1E20QYfZMABCTJULc`
				);
				const data = await response.json();
				return { symbol: symbol, sentimentData: data[0] };
			});

			const results = await Promise.all(promises);
			setRowData(results);
		} catch (error) {
			console.error("Error fetching sentiments:", error);
		}
	};

	const getSentimentType = (sentiment) => {
		if (typeof sentiment === "undefined") {
			return "N/A";
		} else if (sentiment < 0.4) {
			return "📉 Bearish";
		} else if (sentiment > 0.75) {
			return "📈 Bullish";
		} else {
			return "⚖️ Neutral";
		}
	};

	const resizeColumnsToFit = () => {
		if (gridApi.current) {
			gridApi.current.sizeColumnsToFit();
		}
	};

	const onGridReady = (params) => {
		gridApi.current = params.api;
		resizeColumnsToFit();
	};

	const columns = [
		{
			headerName: "Stock Name",
			field: "symbol",
			flex: 1,
			cellStyle: { textAlign: "center" },
		},
		{
			headerName: "Sentiment Score",
			field: "sentimentData.stocktwitsSentiment",
			flex: 1,
			cellStyle: { textAlign: "center" },
		},
		{
			headerName: "Sentiment",
			valueFormatter: ({ data }) =>
				getSentimentType(data.sentimentData.stocktwitsSentiment),
			flex: 1,
			cellStyle: { textAlign: "center" },
		},
	];

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleSearch = async () => {
		try {
			const response = await fetch(
				`https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=1&exchange=NYSE&apikey=dCeN43gf03SvvRm1E20QYfZMABCTJULc`
			);
			const data = await response.json();

			const selectedSymbols = data.map((item) => item.symbol);
			const updatedRowData = [
				...rowData,
				...selectedSymbols.map((symbol) => ({
					symbol,
					sentimentData: {},
				})),
			];

			localStorage.setItem(
				"addedStocks",
				JSON.stringify(updatedRowData)
			);

			const newSymbols = selectedSymbols.filter(
				(symbol) => !rowData.find((item) => item.symbol === symbol)
			);
			const promises = newSymbols.map(async (symbol) => {
				const response = await fetch(
					`https://financialmodelingprep.com/api/v4/historical/social-sentiment?symbol=${symbol}&page=0&apikey=dCeN43gf03SvvRm1E20QYfZMABCTJULc`
				);
				const data = await response.json();
				return { symbol: symbol, sentimentData: data[0] };
			});

			const results = await Promise.all(promises);
			setRowData((prevData) => [...prevData, ...results]);
		} catch (error) {
			console.error("Error fetching symbols:", error);
		}
	};

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
			<h1 className="text-white text-4xl font-bold font-poppins p-8">
				Stock Sentiments
			</h1>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<input
					type="text"
					className="bg-secondary-dark-bg p-2 m-4 rounded-lg"
					placeholder="Search symbols..."
					value={searchQuery}
					onChange={handleSearchChange}
					style={{
						marginRight: "0.5em",
						border: "1px solid #ffffff",
						borderRadius: "10px",
						padding: "10px",
						cursor: "pointer",
						outline: "none",
						color: "white",
					}}
				/>
				<button
					onClick={handleSearch}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						outline: "none",
					}}
				>
					<FaSearch size={20} color="#ffffff" />
				</button>
			</div>
			<style>{`.ag-header-cell-label { justify-content: center; }`}</style>
			<div
				className="ag-theme-quartz-dark"
				style={{ width: "70%", flex: "1" }}
			>
				<AgGridReact
					rowData={rowData}
					columnDefs={columns}
					onGridReady={onGridReady}
				/>
			</div>
		</div>
	);
};

export default SentimentPage;
