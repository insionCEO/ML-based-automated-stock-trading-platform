import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const Orders = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch(
					"https://paper-api.alpaca.markets/v2/account/activities",
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
				setOrders(data);
			} catch (error) {
				console.error("Error fetching orders:", error);
			}
		};

		fetchOrders();
	}, []);

	const columnDefs = [
		{ headerName: "Symbol", field: "symbol" },
		{ headerName: "Type", field: "type" },
		{ headerName: "Side", field: "side" },
		{ headerName: "Price", field: "price" },
		{ headerName: "Quantity", field: "qty" },
		{ headerName: "Transaction Time", field: "transaction_time" },
		{ headerName: "Cumulative Quantity", field: "cum_qty" },
	];

	return (
		<div
			className="centered-container"
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "100vh",
				paddingBottom: "5em",
			}}
		>
			<h1 className="text-white text-4xl font-bold font-poppins p-8">
				All Orders
			</h1>
			<div
				className="ag-theme-quartz-dark"
				style={{ width: "88.8%", flex: "1" }}
			>
				<AgGridReact rowData={orders} columnDefs={columnDefs} />
			</div>
		</div>
	);
};

export default Orders;
