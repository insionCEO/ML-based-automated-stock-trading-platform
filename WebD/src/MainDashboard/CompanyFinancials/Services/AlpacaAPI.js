import apisauce from "apisauce";
// import config from '../config.js'

const alpacaAPI = () => {
	const api = apisauce.create({
		baseURL: "https://paper-api.alpaca.markets",
		headers: {
			"APCA-API-KEY-ID": import.meta.env.VITE_ALPACA_API_KEY,
			"APCA-API-SECRET-KEY": import.meta.env.VITE_ALPACA_API_SECRET,
		},
		timeout: 5000,
	});

	const getAccount = () => api.get("v2/account");
	const getPositions = () => api.get("v2/positions");
	const getOrders = () => api.get("v2/orders");

	return {
		getAccount,
		getPositions,
		getOrders,
	};
};

export default alpacaAPI;
