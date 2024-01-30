import React, { useState } from "react";
import Search from "./Search";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StockContext from "../context/StockContext";
import { useContext } from "react";

const Header = ({ stockDetails }) => {
	const [quantity, setQuantity] = useState(undefined);
	const { stockSymbol } = useContext(StockContext);

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

	const executeOrder = async (side) => {
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
				"APCA-API-SECRET-KEY": import.meta.env
					.VITE_ALPACA_API_SECRET,
			},
			body: JSON.stringify({
				side,
				type: "market",
				time_in_force: "day",
				symbol: stockSymbol,
				qty: quantity.toString(),
			}),
		};

		try {
			const response = await fetch(
				"https://paper-api.alpaca.markets/v2/orders",
				options
			);
			const data = await response.json();
			console.log(data);

			if (data.message) {
				toast.error(data.message);
			} else {
				toast.success(`Order ${side} placed successfully!`);
			}
		} catch (error) {
			console.error("Error submitting order:", error);
			toast.error("Error submitting order. Please try again.");
		}
	};

	return (
		<>
			<div className="xl:px-32 flex justify-between items-center">
				<div>
					<h1 className="text-5xl">{stockDetails.name}</h1>
					<Search />
				</div>
				<div className="grid grid-flow-col grid-rows-none  space-x-4">
					<button
						className="bg-green-500 text-white px-4 py-2 rounded-md"
						onClick={handleMarketBuy}
					>
						Market Buy
					</button>
					<button
						className="bg-red-500 text-white px-4 py-2 rounded-md"
						onClick={handleMarketSell}
					>
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
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</>
	);
};

export default Header;
