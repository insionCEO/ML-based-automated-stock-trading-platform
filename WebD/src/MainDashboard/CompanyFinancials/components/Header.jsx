import React, { useState } from "react";
import axios from "axios";
import Search from "./Search";

const Header = ({ stockDetails }) => {
	const [quantity, setQuantity] = useState(0);
	console.log(stockDetails);
	const handleQuantityChange = (e) => {
		const newQuantity = parseInt(e.target.value, 10);
		setQuantity(isNaN(newQuantity) ? 0 : newQuantity);
	};

	const handleMarketBuy = () => {
		executeOrder("buy");
	};

	const handleMarketSell = () => {
		executeOrder("sell");
	};

	const executeOrder = (side) => {
		const apiUrl = "https://paper-api.alpaca.markets/v2/orders";
		const apiKey = "PKMOGSI41RDBFAODKTJY";
		const apiSecretKey = "XZH5NzB8kICqG0wIC40U5ocgQlLNedVW6VWyzxt1";

		const requestData = {
			side,
			type: "market",
			time_in_force: "day",
			symbol: stockDetails.ticker,
			qty: quantity.toString(),
		};

		const headers = {
			"APCA-API-KEY-ID": apiKey,
			"APCA-API-SECRET-KEY": apiSecretKey,
			accept: "application/json",
			"content-type": "application/json",
		};

		axios
			.post(apiUrl, requestData, { headers })
			.then((response) => {
				console.log(`Order placed successfully (${side}):`, response.data);
			})
			.catch((error) => {
				console.error(`Error placing order (${side}):`, error.response ? error.response.data : error.message);
			});
	};

	return (
		<>
			<div className="xl:px-32 flex justify-between items-center">
				<div>
					<h1 className="text-5xl">{stockDetails.name}</h1>
					<Search />
				</div>
				<div className="grid grid-flow-col grid-rows-none  space-x-4">
					<button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleMarketBuy}>
						Market Buy
					</button>
					<button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleMarketSell}>
						Market Sell
					</button>
					<input
						type="number"
						placeholder="Quantity"
						className="rounded-lg bg-slate-600 p-2 w-24"
						onChange={handleQuantityChange}
					></input>
				</div>
			</div>
		</>
	);
};

export default Header;
