import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 16px;
`;

const Title = styled.h1`
	text-align: center;
	margin-bottom: 20px;
`;

const ToggleButton = styled.button`
	background-color: ${({ isBuy }) => (isBuy ? "#4CAF50" : "#FF5733")};
	color: white;
	padding: 10px 20px;
	font-size: 18px;
	margin-bottom: 20px;
	width: 100%;
	cursor: pointer;
`;

const InputWrapper = styled.div`
	margin-bottom: 15px;
`;

const Label = styled.label`
	display: block;
	margin-bottom: 5px;
`;

const InputField = styled.input`
	width: calc(100% - 10px);
	padding: 8px;
	border-radius: 4px;
`;

const SelectField = styled.select`
	width: 100%;
	padding: 8px;
	border-radius: 4px;
`;

const SubmitButton = styled.button`
	background-color: #3498db;
	color: white;
	padding: 10px 20px;
	font-size: 18px;
	width: 100%;
	cursor: pointer;
`;

const QuickTrade = () => {
	const [isBuy, setIsBuy] = useState(true);
	const [symbol, setSymbol] = useState("");
	const [marketPrice, setMarketPrice] = useState(0);
	const [orderType, setOrderType] = useState("market");
	const [quantity, setQuantity] = useState(1);
	const [estimatedCost, setEstimatedCost] = useState(0);
	const [timeInForce, setTimeInForce] = useState("GTC");

	const handleToggle = () => {
		setIsBuy(!isBuy);
	};

	const handleSymbolChange = (event) => {
		setSymbol(event.target.value);
	};

	const handleOrderTypeChange = (event) => {
		setOrderType(event.target.value);
	};

	const handleQuantityChange = (event) => {
		const newQuantity = parseInt(event.target.value, 10);
		setQuantity(isNaN(newQuantity) ? 0 : newQuantity);
	};

	const calculateEstimatedCost = () => {
		const cost = quantity * marketPrice;
		setEstimatedCost(cost.toFixed(2));
	};

	const handleTimeInForceChange = (event) => {
		setTimeInForce(event.target.value);
	};

	const handleSubmit = () => {
		// Add logic to review and submit the order
		console.log("Order Reviewed and Submitted");
	};

	return (
		<div className="">
			<Container className="bg-secondary-dark-bg border-color text-gray-200">
				<Title>Quick Trade</Title>

				<ToggleButton isBuy={isBuy} onClick={handleToggle}>
					{isBuy ? "Buy" : "Sell"}
				</ToggleButton>

				<InputWrapper>
					<Label htmlFor="symbol">Symbol:</Label>
					<span>${marketPrice.toFixed(2)}</span>
					<InputField type="text" id="symbol" value={symbol} onChange={handleSymbolChange} />
				</InputWrapper>

				<InputWrapper>
					<Label htmlFor="orderType">Order Type:</Label>
					<span>{orderType}</span>
					<SelectField id="orderType" value={orderType} onChange={handleOrderTypeChange}>
						<option value="market">Market Order</option>
						<option value="limit">Limit Order</option>
					</SelectField>
				</InputWrapper>

				<InputWrapper>
					<Label htmlFor="quantity">Quantity:</Label>
					<span>{quantity}</span>
					<InputField type="number" id="quantity" value={quantity} onChange={handleQuantityChange} />
				</InputWrapper>

				<InputWrapper>
					<Label htmlFor="estimatedCost">Estimated Cost:</Label>
					<span>${estimatedCost}</span>
				</InputWrapper>

				<InputWrapper>
					<Label htmlFor="timeInForce">Time in Force:</Label>
					<span>{timeInForce}</span>
					<SelectField id="timeInForce" value={timeInForce} onChange={handleTimeInForceChange}>
						<option value="GTC">GTC - Good till Canceled</option>
						{/* Add other time in force options as needed */}
					</SelectField>
				</InputWrapper>

				<SubmitButton onClick={handleSubmit}>Review Order</SubmitButton>
			</Container>
		</div>
	);
};

export default QuickTrade;
