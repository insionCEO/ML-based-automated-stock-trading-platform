import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const RecentTrnx = () => {
	const { currentColor, currentMode } = useStateContext();
	const [recentTransactions, setRecentTransactions] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const apiUrl =
					"https://paper-api.alpaca.markets/v2/account/activities";
				const apiKeyId = import.meta.env.VITE_ALPACA_API_KEY;
				const apiSecretKey = import.meta.env.VITE_ALPACA_API_SECRET;
				// console.log(apiKeyId, " ", apiSecretKey);
				
				const options = {
					method: "GET",
					headers: {
						accept: "application/json",
						"APCA-API-KEY-ID": apiKeyId,
						"APCA-API-SECRET-KEY": apiSecretKey,
					},
				};

				const response = await fetch(apiUrl, options);
				const data = await response.json();
				setRecentTransactions(data.slice(0, 5));
			} catch (error) {
				console.error("Error fetching recent transactions:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
			<div className="flex justify-between items-center gap-2">
				<p className="text-xl font-semibold">Recent Transactions</p>
			</div>
			<div className="mt-10 w-72 md:w-400">
				{recentTransactions.map((item) => (
					<div key={item.id} className="flex justify-between mt-4">
						<div className="flex gap-4">
							<button
								type="button"
								className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
							>
								{item.symbol}
							</button>
							<div>
								<p className="text-md font-semibold">
									Order: {item.side}
								</p>
								<p className="text-sm text-gray-400">
									Quantity: {item.qty}
								</p>
							</div>
						</div>
						<p className={`text-${item.pcColor}`}>{item.price}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default RecentTrnx;
