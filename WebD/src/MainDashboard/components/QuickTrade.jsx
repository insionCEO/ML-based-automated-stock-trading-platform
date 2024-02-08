import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
	margin: 0 auto;
	padding: 20px;
	border-radius: 16px;
`;

const Title = styled.h1`
	text-align: center;
	margin-bottom: 20px;
`;

const InputWrapper = styled.div`
	margin-bottom: 15px;
	display: flex;
	align-items: center;
`;

const Label = styled.label`
	flex: 1;
	margin-right: 10px;
`;

const InputField = styled.input`
	flex: 2;
	width: calc(100% - 10px);
	padding: 8px;
	border-radius: 4px;
	background-color: #33373e;
	color: white;
	border-color: white;
	border: 1px solid #ccc;
`;

const SelectField = styled.select`
	width: 66%;
	padding: 8px;
	border-radius: 4px;
	background-color: #33373e;
	color: white;
	border: 1px solid #ccc;
`;

const SubmitButton = styled.button`
	color: white;
	padding: 10px 20px;
	font-size: 18px;
	width: 100%;
	cursor: pointer;
	margin-top: 10px;
	margin-bottom: 10px;
	border-radius: 10px;
`;

const QuickTrade = () => {
	const [isBuy, setIsBuy] = useState(true);
	const [symbol, setSymbol] = useState("");
	const [marketPrice, setMarketPrice] = useState(0);
	const [orderType, setOrderType] = useState("market");
	const [quantity, setQuantity] = useState(1);
	const [estimatedCost, setEstimatedCost] = useState(0);
	const [timeInForce, setTimeInForce] = useState("day");
	const [alignment, setAlignment] = useState("buy");
	const [limitPrice, setLimitPrice] = useState(0);

	useEffect(() => {
		let fetchMarketPrice = null;
		if (symbol) {
			const options = {
				method: "GET",
				headers: {
					accept: "application/json",
					"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
					"APCA-API-SECRET-KEY": import.meta.env
						.VITE_ALPACA_API_SECRET,
				},
			};

			fetchMarketPrice = async () => {
				try {
					const response = await fetch(
						`https://data.alpaca.markets/v2/stocks/${symbol}/bars/latest?feed=iex`,
						options
					);
					const data = await response.json();
					if (data.bar && data.bar.c) {
						setMarketPrice(data.bar.c);
						setEstimatedCost(data.bar.c * quantity);
					}
				} catch (error) {
					console.error("Error fetching market price:", error);
				}
			};

			fetchMarketPrice();
		}

		return () => {
			if (fetchMarketPrice) {
				fetchMarketPrice = null;
			}
		};
	}, [symbol, quantity]);

	const handleChange = (event, newAlignment) => {
		setIsBuy(newAlignment === "buy");
		setAlignment(newAlignment);
	};

	const handleSymbolChange = (event) => {
		setSymbol(event.target.value);
	};

	const handleOrderTypeChange = (event) => {
		setOrderType(event.target.value);
	};

	const handleQuantityChange = (event) => {
		const newQuantity = parseInt(event.target.value, 10) || 0;
		setQuantity(newQuantity);
		setEstimatedCost(newQuantity * marketPrice);
	};

	const handleTimeInForceChange = (event) => {
		setTimeInForce(event.target.value);
	};

	const handleLimitPriceChange = (event) => {
		setLimitPrice(event.target.value);
	};

	const handleSubmit = async () => {
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
				"APCA-API-SECRET-KEY": import.meta.env
					.VITE_ALPACA_API_SECRET,
			},
			body: JSON.stringify({
				side: alignment,
				type: orderType,
				time_in_force: timeInForce,
				symbol: symbol,
				qty: quantity.toString(),
				...(orderType === "limit" && { limit_price: limitPrice }),
			}),
		};

		try {
			const response = await fetch(
				"https://paper-api.alpaca.markets/v2/orders",
				options
			);
			const data = await response.json();
			if (data.message) {
				toast.error(data.message);
			} else {
				toast.success("Order placed successfully!");
			}
		} catch (error) {
			console.error("Error submitting order:", error);
			toast.error("Error submitting order. Please try again.");
		}
	};

	return (
		<div className="rounded-2xl md:w-400  mt-3 mb-3">
			<Container className="bg-secondary-dark-bg border-color text-gray-200">
				<div className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-gray-200 text-center">
					Quick Trade
				</div>
				<div className="flex justify-center m-6">
					<ToggleButtonGroup
						color="primary"
						value={alignment}
						exclusive={true}
						onChange={handleChange}
						aria-label="Platform"
					>
						<ToggleButton
							value="buy"
							style={{
								backgroundColor:
									alignment === "buy" ? "green" : "gray",
								color: "white",
							}}
						>
							BUY
						</ToggleButton>
						<ToggleButton
							value="sell"
							style={{
								backgroundColor:
									alignment === "sell" ? "red" : "gray",
								color: "white",
							}}
						>
							SELL
						</ToggleButton>
					</ToggleButtonGroup>
				</div>

				<InputWrapper>
					<Label htmlFor="symbol">Symbol:</Label>
					<InputField
						type="text"
						id="symbol"
						value={symbol}
						onChange={handleSymbolChange}
					/>
				</InputWrapper>

				<InputWrapper>
					<Label htmlFor="orderType">Order Type:</Label>
					<SelectField
						id="orderType"
						value={orderType}
						onChange={handleOrderTypeChange}
					>
						<option value="market">Market Order</option>
						<option value="limit">Limit Order</option>
					</SelectField>
				</InputWrapper>

				{orderType === "limit" && (
					<InputWrapper>
						<Label htmlFor="limitPrice">Limit Price:</Label>
						<InputField
							type="number"
							id="limitPrice"
							value={limitPrice}
							onChange={handleLimitPriceChange}
							min={0}
						/>
					</InputWrapper>
				)}

				<InputWrapper>
					<Label htmlFor="quantity">Quantity:</Label>
					<InputField
						type="number"
						id="quantity"
						value={quantity}
						onChange={handleQuantityChange}
						min={0}
					/>
				</InputWrapper>

				<InputWrapper>
					<Label htmlFor="estimatedCost">Estimated Cost:</Label>
					<span>${estimatedCost}</span>
				</InputWrapper>

				<InputWrapper>
					<Label htmlFor="timeInForce">Time in Force:</Label>
					<SelectField
						id="timeInForce"
						value={timeInForce}
						onChange={handleTimeInForceChange}
					>
						<option value="day">Day Order: Valid for one day</option>
						<option value="gtc">GTC: Good till Canceled</option>
					</SelectField>
				</InputWrapper>

				<SubmitButton
					onClick={handleSubmit}
					style={{
						backgroundColor: alignment === "buy" ? "green" : "red",
					}}
				>
					Place Order
				</SubmitButton>
			</Container>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar
			/>
		</div>
	);
};

export default QuickTrade;
