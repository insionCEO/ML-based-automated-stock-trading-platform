import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { HashLoader } from "react-spinners";
import { Header } from "../components";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchOrders = useCallback(async () => {
		try {
			const response = await fetch(
				"https://paper-api.alpaca.markets/v2/orders?status=all&limit=100",
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
				throw new Error('Failed to fetch orders');
			}
			const data = await response.json();
			setOrders(data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching orders:", error);
			setError(error);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const columnDefs = useMemo(
		() => [
			{ headerName: "Symbol", field: "symbol", filter: true },
			{ headerName: "Side", field: "side", filter: true },
			{ headerName: "Type", field: "type", filter: true },
			{ headerName: "Quantity", field: "qty", filter: "agNumberColumnFilter" },
			{ headerName: "Status", field: "status", filter: true },
			{ headerName: "Created At", field: "created_at", filter: "agDateColumnFilter" },
			{ headerName: "Filled At", field: "filled_at", filter: "agDateColumnFilter" },
		],
		[]
	);

	const defaultColDef = useMemo(() => ({
		sortable: true,
		resizable: true,
	}), []);

	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-secondary-dark-bg rounded-3xl">
			<Header title="All Orders" />
			{loading ? (
				<div className="flex flex-col items-center justify-center h-64">
					<HashLoader color="#79E6EA" size={60} />
					<p className="mt-8 text-white text-2xl font-semibold animate-pulse">
						Loading...
					</p>
				</div>
			) : error ? (
				<p className="text-red-500 text-center text-xl">Error: {error.message}</p>
			) : (
				<div
					className="ag-theme-quartz-dark"
					style={{ height: "70vh", width: "100%" }}
				>
					<AgGridReact
						rowData={orders}
						columnDefs={columnDefs}
						defaultColDef={defaultColDef}
						pagination={true}
						paginationPageSize={15}
						animateRows={true}
						enableCellChangeFlash={true}
						key={JSON.stringify(columnDefs)}
					/>
				</div>
			)}
		</div>
	);
};

export default Orders;
