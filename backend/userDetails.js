import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
  user: [
    {
      user_id: { type: Number, unique: true },
      username: { type: String, unique: true },
      email: { type: String, unique: true },
      balance: { type: Number },
    },
  ],
  transactions: [
    {
      model_id: { type: Number },
      transaction_date: { type: Date },
      amount: { type: Number },
      transaction_type: { type: String, enum: ["buy", "sell"] },
    },
  ],
  portfolios: [
    {
      model_id: { type: Number },
      quantity: { type: Number },
      average_price: { type: Number },
      current_value: { type: Number },
    },
  ],
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

const getNextUserId = async () => {
  try {
    const result = await UserDetails.findOne()
      .sort({ "user.user_id": -1 })
      .limit(1);

    if (result && result.user && result.user.length > 0) {
      const lastUserId = result.user[0].user_id;
      return lastUserId + 1;
    } else {
      return 1;
    }
  } catch (error) {
    console.error("Error generating user_id:", error);
    throw error;
  }
};

const generateUserIdAndSaveUser = async (userData) => {
  const user_id = await getNextUserId();
  const newUser = {
    user_id,
    balance: 0,
    ...userData,
  };

  try {
    const createdUser = await UserDetails.create({ user: newUser });
    console.log("User created:", createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export { UserDetails, getNextUserId, generateUserIdAndSaveUser };
