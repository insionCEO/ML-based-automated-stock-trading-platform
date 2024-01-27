import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
	UserDetails,
	getNextUserId,
	generateUserIdAndSaveUser,
} from "./userDetails.js";
import ModelDetails from "./modelDetails.js";

const app = express();

app.use(cors());

app.use(express.json());

app.post("/api/createUser", async (req, res) => {
	const formData = req.body;

	try {
		await generateUserIdAndSaveUser(formData);
		console.log(formData);
		res.status(201).json({ message: "User created successfully!" });
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/api/authenticate", async (req, res) => {
	try {
		const { email, apiKey, apiSecretKey } = req.body;

		let query = { "user.email": email };

		if (apiKey && apiSecretKey) {
			query["user.apiKey"] = apiKey;
			query["user.apiSecretKey"] = apiSecretKey;
		}

		const existingUser = await UserDetails.findOne(query);

		if (existingUser) {
			console.log("Authentication Successful");
			return res.json({
				success: true,
				message: "Authentication Successful",
			});
		} else {
			const formData = req.body;

			try {
				await generateUserIdAndSaveUser(formData);
				console.log(formData);
				res
					.status(201)
					.json({ message: "User created successfully!" });
			} catch (error) {
				console.error("Error creating user:", error);
				res.status(500).json({ message: "Internal server error" });
			}
		}
	} catch (error) {
		console.error("Error during authentication:", error);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error" });
	}
});

app.get("/api/fetchModelDetails", async (req, res) => {
	try {
		const modeldetails = await ModelDetails.find();
		res.status(200).json({ success: true, modeldetails });
	} catch (error) {
		console.error("Error fetching ModelDetails:", error);
		res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
});

app.post("/api/models/add", async (req, res) => {
	try {
		const { model_name, description, performance_metrics, price } =
			req.body;

		// Validate required fields
		if (!model_name || !price) {
			return res
				.status(400)
				.json({ error: "Missing required fields." });
		}

		// Get the count of existing models
		const modelCount = await ModelDetails.countDocuments({});

		// Generate a unique model_id
		const model_id = modelCount + 1;

		// Create a new model instance
		const newModel = new ModelDetails({
			model_id,
			model_name,
			description,
			performance_metrics,
			price,
		});

		// Save the model to the database
		await newModel.save();

		return res
			.status(201)
			.json({ message: "Model added successfully." });
	} catch (error) {
		console.error("Error adding model:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/add-transaction/:userId", async (req, res) => {
	try {
		const userId = parseInt(req.params.userId);
		const transactionData = req.body; // Assuming you send transaction data in the request body

		// Find the user based on user_id
		const user = await UserDetails.findOne({
			"user.user_id": userId,
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Add the transaction details to the transactions array
		user.transactions.push(transactionData);

		// Save the updated user document
		await user.save();

		return res.json({
			message: "Transaction added successfully",
			user,
		});
	} catch (error) {
		console.error("Error adding transaction:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.put("/api/updateKeys", async (req, res) => {
	try {
		const { email, apiKey, apiSecretKey } = req.body;

		if (!email || !apiKey || !apiSecretKey) {
			return res
				.status(400)
				.json({ message: "Missing required fields" });
		}

		const existingUser = await UserDetails.findOne({
			"user.email": email,
		});

		if (!existingUser) {
			return res.status(404).json({ message: "User not found" });
		}

		existingUser.user[0].apiKey = apiKey;
		existingUser.user[0].apiSecretKey = apiSecretKey;

		await existingUser.save();

		res.json({
			message: "API Key and Secret Key updated successfully",
		});
	} catch (error) {
		console.error("Error updating keys:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.get("/api/keys/:email", async (req, res) => {
	const { email } = req.params;

	try {
		const user = await UserDetails.findOne({ "user.email": email });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		const { apiKey, apiSecretKey } = user.user[0];
		res.json({ success: true, apiKey, apiSecretKey });
	} catch (error) {
		console.error("Error fetching user keys:", error);
		res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
});

app.listen(5000, () => console.log("App is Running"));
