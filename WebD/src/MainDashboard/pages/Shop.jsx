import React, { useState, useEffect } from "react";
import { useAuth0, Auth0Provider } from "@auth0/auth0-react";
import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	Resize,
	Sort,
	ContextMenu,
	Filter,
	Page,
	ExcelExport,
	PdfExport,
	Edit,
	Inject,
} from "@syncfusion/ej2-react-grids";

import { Header } from "../components";

const Shop = () => {
	const { isAuthenticated, user } = useAuth0();
	const [modelDetails, setModelDetails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const handlePlaceOrder = async (model_id, email) => {
		// Fetch the API Key and Secret Key from the backend
		const response = await fetch(
			`http://localhost:5000/api/keys/${user.email}`
		);
		const data = await response.json();
		const { apiKey, apiSecretKey } = data;

		// Send the model_id, API Key, and Secret Key back to the backend
		const orderResponse = await fetch(
			`http://localhost:5000/api/models/${model_id}/buyers/add`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ apiKey, apiSecretKey }),
			}
		);

		if (orderResponse.ok) {
			console.log("Order placed successfully");
		} else {
			console.error("Error placing order");
		}
	};

	const orderButtonTemplate = (data) => (
		<button
			className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			onClick={() =>
				handlePlaceOrder(data.model_id, "user@example.com")
			}
		>
			Place Order
		</button>
	);

	useEffect(() => {
		const fetchModelDetails = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/fetchModelDetails"
				);
				const data = await response.json();

				if (data.success) {
					const modifiedData = data.modeldetails.map((model) => {
						const performanceMetrics = {};

						model.performance_metrics.forEach((metric) => {
							performanceMetrics[metric.metric_name] = metric.value;
						});

						return { ...model, ...performanceMetrics };
					});

					setModelDetails(modifiedData);
				} else {
					setError(data.message);
				}

				setLoading(false);
			} catch (error) {
				setError("Internal server error");
				setLoading(false);
			}
		};

		fetchModelDetails();
	}, []);

	const editing = { allowDeleting: false, allowEditing: false };

	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
			<Header category="Page" title="Shop" />

			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}

			{!loading && !error && (
				<GridComponent
					id="gridcomp"
					dataSource={modelDetails}
					allowPaging
					allowSorting
					allowExcelExport
					allowPdfExport
					contextMenuItems={[]}
					editSettings={editing}
				>
					<ColumnsDirective>
						<ColumnDirective
							field="model_id"
							headerText="Model ID"
						/>
						<ColumnDirective
							field="model_name"
							headerText="Model Name"
						/>
						<ColumnDirective
							field="description"
							headerText="Description"
						/>

						<ColumnDirective
							field="Accuracy"
							headerText="Accuracy"
							template={(field) => `${field.Accuracy * 100}%`}
						/>
						<ColumnDirective
							field="Precision"
							headerText="Precision"
							template={(field) => `${field.Precision * 100}%`}
						/>

						<ColumnDirective field="price" headerText="Price" />
						<ColumnDirective
							headerText="Order"
							template={orderButtonTemplate}
							textAlign="Center"
							width="150"
						/>
					</ColumnsDirective>
					<Inject
						services={[
							Resize,
							Sort,
							ContextMenu,
							Filter,
							Page,
							ExcelExport,
							Edit,
							PdfExport,
						]}
					/>
				</GridComponent>
			)}
		</div>
	);
};

export default Shop;
