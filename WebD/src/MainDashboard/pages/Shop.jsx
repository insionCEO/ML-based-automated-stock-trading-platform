import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
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

	useEffect(() => {
		const fetchModelDetails = async () => {
			try {
				const response = await fetch(
					"https://tensorforce-backend.onrender.com/api/fetchModelDetails"
				);
				const data = await response.json();

				if (data.success) {
					setModelDetails(data.modeldetails);
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

	if (isLoading) {
		return <div>Loading</div>;
	}

	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-secondary-dark-bg rounded-3xl">
			<Header title="Shop" />

			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}

			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{modelDetails.map((model) => (
						<div key={model.model_id} className="bg-white p-6 rounded-lg shadow-md">
							<h2 className="text-xl font-bold mb-2">{model.model_name}</h2>
							<p className="text-gray-600 mb-4">{model.description}</p>
							<div className="flex justify-between items-center mb-4">
								<span className="text-lg font-semibold">${model.price}</span>
								<div>
									<span className="mr-2">Accuracy: {model.performance_metrics.find(m => m.metric_name === 'accuracy').value}%</span>
									<span>Precision: {model.performance_metrics.find(m => m.metric_name === 'precision').value}%</span>
								</div>
							</div>
							<button
								className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								onClick={() => handlePlaceOrder(model.model_id, user.email)}
							>
								Place Order
							</button>
						</div>
					))}
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default Shop;
