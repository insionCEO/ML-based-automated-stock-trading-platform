import React, { useContext, useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import Overview from "./Overview";
import Details from "./Details";
import Chart from "./Chart";
import Header from "./Header";
import StockContext from "../context/StockContext";
import { fetchStockDetails, fetchQuote } from "../utils/api/stock-api";
import Navbar from "../../components/Navbar";
import "./a.css";
const Dashboard = () => {
	const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();

	const { stockSymbol } = useContext(StockContext);

	const [stockDetails, setStockDetails] = useState({});

	const [quote, setQuote] = useState({});

	const [quantity, setQuantity] = useState(0);

	useEffect(() => {
		const updateStockDetails = async () => {
			try {
				const result = await fetchStockDetails(stockSymbol);
				setStockDetails(result);
			} catch (error) {
				setStockDetails({});
				console.log(error);
			}
		};

		const updateStockOverview = async () => {
			try {
				const result = await fetchQuote(stockSymbol);
				setQuote(result);
			} catch (error) {
				setQuote({});
				console.log(error);
			}
		};

		updateStockDetails();
		updateStockOverview();
	}, [stockSymbol]);

	return (
		<>
			{/* <div
			className={`container grid grid-cols-3 grid-rows-4 auto-rows-fr gap-6 p-10 font-quicksand ${
				currentMode ? "dark:bg-main-dark-bg text-gray-300" : "bg-neutral-100"
			}`}
		>
			<div className="col-span-3 row-span-1 flex justify-start items-center py-5 Header">
				<Header name={stockDetails.name} />
			</div>
			<div className="col-span-3 md:col-span-2 xl:col-span-3 row-span-4 Chart">
				<Chart />
			</div>
			<div className="col-span-3 md:col-span-2 xl:col-span-1 row-span-2 grid grid-rows-2">
				<div className="row-span-1 Overview">
					<Overview
						symbol={stockSymbol}
						price={quote.pc}
						change={quote.d}
						changePercent={quote.dp}
						currency={stockDetails.currency}
					/>
				</div>
				<div className="row-span-1 Details">
					<Details details={stockDetails} />
				</div>
			</div>
		</div> */}
			<div className="container pt-5 md:pt-10 pl-5 md:pl-10 font-quicksand dark:bg-main-dark-bg text-gray-300 mb-10">
				<div className="Chart mx-4">
					<Chart />
				</div>
				<div className="Header">
					<Header stockDetails={stockDetails} />
				</div>
				<div className="Overview mb-5">
					<Overview
						symbol={stockSymbol}
						price={quote.pc}
						change={quote.d}
						changePercent={quote.dp}
						currency={stockDetails.currency}
					/>
				</div>
				<div className="Details">
					<Details details={stockDetails} />
				</div>
			</div>
		</>
	);
};

export default Dashboard;
