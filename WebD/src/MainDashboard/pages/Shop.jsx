import React, { useState, useEffect } from "react";
import { useAuth0, Auth0Provider } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
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
	const { isAuthenticated, user, isLoading } = useAuth0();
	const [modelDetails, setModelDetails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const handlePlaceOrder = async (model_id, email) => {
		// Fetch the API Key and Secret Key from the backend
		const response = await fetch(
			`https://tensorforce-backend.onrender.com/api/keys/${user.email}`
		);
		const data = await response.json();
		const { apiKey, apiSecretKey } = data;

		// Check if the user has already bought this model
		const buyersResponse = await fetch(
			`https://tensorforce-backend.onrender.com/api/models/buyers/${model_id}`
		);
		const buyersData = await buyersResponse.json();

		const hasBought = buyersData.some(
			(buyer) => buyer.apiKey === apiKey
		);

		if (hasBought) {
			console.log("User has already bought this model");
			toast.error("You've already bought this model");
			return;
		}

		// Send the model_id, API Key, and Secret Key back to the backend
		const orderResponse = await fetch(
			`https://tensorforce-backend.onrender.com/api/models/buyers/add/${model_id}`,
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
			toast.success("Order Placed Successfully");
		} else {
			console.error("Error placing order");
		}
	};

	const orderButtonTemplate = (data) => (
		<button
			className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			onClick={() => handlePlaceOrder(data.model_id, user.email)}
		>
			Place Order
		</button>
	);

	useEffect(() => {
		const fetchModelDetails = async () => {
			try {
				const response = await fetch(
					"https://tensorforce-backend.onrender.com/api/fetchModelDetails"
				);
				const data = await response.json();

				if (data.success) {
					const modifiedData = data.modeldetails.map((model) => {
						const performanceMetrics = {};

						model.performance_metrics.forEach((metric) => {
							performanceMetrics[metric.metric_name.toLowerCase()] =
								metric.value;
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

	if (isLoading) {
		return <div>Loading</div>;
	}

	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-secondary-dark-bg rounded-3xl">
			<Header title="Shop" />

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
					<ColumnsDirective className="bg-secondary-dark-bg">
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
							field="accuracy"
							headerText="Accuracy"
							template={(field) => `${field.accuracy}%`}
						/>
						<ColumnDirective
							field="precision"
							headerText="Precision"
							template={(field) => `${field.precision}%`}
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
			<div className="row">
				<ToastContainer />
			</div>
		</div>
	);
};

export default Shop;
