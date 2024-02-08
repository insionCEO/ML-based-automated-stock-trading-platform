import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

const RecentTrnx = () => {
	const { currentColor } = useStateContext();
	const [recentTransactions, setRecentTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const apiUrl =
					"https://paper-api.alpaca.markets/v2/account/activities";
				const apiKeyId = import.meta.env.VITE_ALPACA_API_KEY;
				const apiSecretKey = import.meta.env.VITE_ALPACA_API_SECRET;

				const options = {
					method: "GET",
					headers: {
						accept: "application/json",
						"APCA-API-KEY-ID": apiKeyId,
						"APCA-API-SECRET-KEY": apiSecretKey,
					},
				};

				const response = await fetch(apiUrl, options);
				if (!response.ok) {
					throw new Error("Failed to fetch recent transactions");
				}
				const data = await response.json();
				setRecentTransactions(data.slice(0, 5));
			} catch (error) {
				console.error("Error fetching recent transactions:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleAllOrdersClick = () => {
		navigate("/dashboardv2/orders");
	};

	return (
		<div className="bg-white text-gray-900 dark:bg-secondary-dark-bg dark:text-gray-200 p-6 rounded-2xl">
			<div className="flex justify-between items-center gap-2">
				<p className="text-xl font-semibold">Recent Transactions</p>
				<button
					type="button"
					className={`text-sm ${currentColor} hover:underline`}
					onClick={handleAllOrdersClick}
				>
					All Orders
				</button>
			</div>
			{loading ? (
				<p>Loading...</p>
			) : recentTransactions.length > 0 ? (
				<div className="mt-10 w-72 md:w-400">
					{recentTransactions.map(
						({ id, symbol, side, qty, pcColor, price }) => (
							<div key={id} className="flex justify-between mt-4">
								<div className="flex gap-4">
									<button
										type="button"
										className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
									>
										{symbol}
									</button>
									<div>
										<p className="text-md font-semibold">
											Order: {side}
										</p>
										<p className="text-sm text-gray-400">
											Quantity: {qty}
										</p>
									</div>
								</div>
								<p className={`text-${pcColor}`}>{price}</p>
							</div>
						)
					)}
				</div>
			) : (
				<p>No recent transactions available</p>
			)}
		</div>
	);
};

export default RecentTrnx;
