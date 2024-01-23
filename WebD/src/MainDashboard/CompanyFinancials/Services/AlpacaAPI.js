import apisauce from 'apisauce'
// import config from '../config.js'

const alpacaAPI = () => {
	const api = apisauce.create({
		baseURL: "https://paper-api.alpaca.markets",
		headers: { "APCA-API-KEY-ID": "PK7C5OO9M7HYPW5SVI1T", "APCA-API-SECRET-KEY": "vE2VroALLWqEVzoQdSpjtBGSOaMyHQ2cIf2i1yPr" },
		timeout: 5000,
	})

	const getAccount = () => api.get('v2/account')
	const getPositions = () => api.get('v2/positions')
	const getOrders = () => api.get("v2/orders")

	return {
		getAccount,
		getPositions,
		getOrders
	}
}

export default alpacaAPI;