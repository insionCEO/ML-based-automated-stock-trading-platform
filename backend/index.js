import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { UserDetails, generateUserIdAndSaveUser } from "./userDetails.js";

const app = express();

app.use(cors());

app.use(express.json());

const uri = "mongodb://localhost:27017/customers";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => console.log(e));

app.post("/api/createUser", async (req, res) => {
  const formData = req.body;

  try {
    await generateUserIdAndSaveUser(formData);

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/authenticate", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await UserDetails.findOne({
      "user.email": email,
    });

    if (existingUser) {
      return res.json({ success: true, message: "Authentication Successful" });
    } else {
      const formData = req.body;

      try {
        await generateUserIdAndSaveUser(formData);

        res.status(201).json({ message: "User created successfully!" });
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

app.listen(5000, () => console.log("App is Running"));
