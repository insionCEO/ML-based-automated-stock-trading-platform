import React, { useState, useEffect, useMemo } from "react";
import QuickTrade from "../components/QuickTrade";
import MarketSentiment from "../components/MarketSentiment";
import RecentTrnx from "../components/RecentTrnx";
import AreaChart from "../components/Charts/AreaChart";
import { useStateContext } from "../contexts/ContextProvider";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { FiBarChart } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";

const Dashboard = () => {
	const { currentColor} = useStateContext();

	const [apiData, setApiData] = useState(null);
	const [averageSentiment, setAverageSentiment] = useState(0);
	const [marketStatus, setMarketStatus] = useState(null);

	useEffect(() => {
		const fetchAccountData = async () => {
			try {
				const response = await fetch(
					"https://paper-api.alpaca.markets/v2/account",
					{
						method: "GET",
						headers: {
							accept: "application/json",
							"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
							"APCA-API-SECRET-KEY": import.meta.env
								.VITE_ALPACA_API_SECRET,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch account data");
				}

				const accountData = await response.json();
				setApiData(accountData);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAccountData();
	}, []);

	useEffect(() => {
		const fetchMarketStatus = async () => {
			try {
				const response = await fetch(
					"https://paper-api.alpaca.markets/v2/clock",
					{
						method: "GET",
						headers: {
							accept: "application/json",
							"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
							"APCA-API-SECRET-KEY": import.meta.env
								.VITE_ALPACA_API_SECRET,
						},
					}
				);
				const data = await response.json();
				setMarketStatus(data.is_open ? "Open" : "Closed");
			} catch (error) {
				console.error("Error fetching market status:", error);
			}
		};

		fetchMarketStatus();
	}, []);

	useEffect(() => {
		const fetchSentimentData = async () => {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const raw = JSON.stringify({
				symbol: "SPY",
			});

			const requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
			};

			try {
				const response = await fetch(
					"http://localhost:5050/get_sentiment",
					requestOptions
				);
				const result = await response.text();
				setAverageSentiment(parseFloat(result));
			} catch (error) {
				console.error("Error fetching sentiment:", error);
			}
		};

		fetchSentimentData();
	}, []);

	const earningData = useMemo(
		() => [
			{
				icon: <MdOutlineSupervisorAccount />,
				amount: apiData ? apiData.account_number : "",
				title: "Account Number",
				iconColor: "#03C9D7",
				iconBg: "#E5FAFB",
				pcColor: "gray-200",
			},
			{
				icon: <BsBoxSeam />,
				amount: apiData ? `$${apiData.buying_power}` : "",
				title: "Buying Power",
				iconColor: "rgb(255, 244, 229)",
				iconBg: "rgb(254, 201, 15)",
				pcColor: "gray-200",
			},
			{
				icon: <FiBarChart />,
				amount: apiData ? `$${apiData.cash}` : "",
				title: "Cash",
				iconColor: "rgb(228, 106, 118)",
				iconBg: "rgb(255, 244, 229)",
				pcColor: "gray-200",
			},
			{
				icon: <HiOutlineRefresh />,
				amount: apiData
					? apiData.equity - apiData.last_equity !== 0
						? (apiData.equity - apiData.last_equity > 0
								? "+$"
								: "-$") +
						  Math.abs(apiData.equity - apiData.last_equity).toFixed(
								2
						  )
						: "$0.00"
					: "",
				title: "Daily Change",
				iconColor: "rgb(0, 194, 146)",
				iconBg: "rgb(235, 250, 242)",
				pcColor:
					apiData && apiData.equity - apiData.last_equity >= 0
						? "green-600"
						: "red-600",
				percentage: apiData
					? `${(
							((apiData.equity - apiData.last_equity) /
								apiData.last_equity) *
							100
					  ).toFixed(2)}%`
					: "",
			},
		],
		[apiData]
	);

	return (
		<div className="mt-12 mb-24">
			{marketStatus && (
				<div className="flex justify-center text-gray-200 mb-12 text-2xl">
					<p>
						Market is <strong>{marketStatus}</strong>
					</p>
				</div>
			)}
			<div className="flex flex-wrap lg:flex-nowrap justify-center ">
				<div className="flex m-3 flex-wrap justify-center gap-1 items-center">
					{earningData.map((item) => (
						<div
							key={item.title}
							className="h-44 text-gray-200 bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
						>
							<button
								type="button"
								style={{
									color: item.iconColor,
									backgroundColor: item.iconBg,
								}}
								className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
							>
								{item.icon}
							</button>
							<p className="mt-3">
								<span
									className={`text-lg font-semibold text-${item.pcColor}`}
								>
									{item.amount}
								</span>
								<span
									className={`text-sm text-${item.pcColor} ml-2`}
								>
									{item.percentage}
								</span>
							</p>
							<p className="text-sm text-gray-400  mt-1">
								{item.title}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="flex gap-10 flex-wrap justify-center">
				<div className="bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
					<AreaChart />
				</div>
				<div>
					<div
						className=" rounded-2xl md:w-400  mt-3 mb-3"
						style={{ backgroundColor: currentColor }}
					>
						<QuickTrade />
					</div>
				</div>
			</div>

			<div className="flex gap-10 m-4 flex-wrap justify-center">
				<RecentTrnx />
				<MarketSentiment averageSentiment={averageSentiment} />
			</div>
		</div>
	);
};

export default Dashboard;
