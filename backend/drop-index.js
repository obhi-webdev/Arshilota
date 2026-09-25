require("dotenv").config();

const mongoose = require("mongoose");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const collection =
      mongoose.connection.collection("orders");

    const indexes =
      await collection.indexes();

    console.log(
      "Current indexes:",
      indexes.map((item) => item.name)
    );

    await collection.dropIndex(
      "manualPayment.transactionId_1"
    );

    console.log(
      "✅ manualPayment.transactionId_1 index deleted successfully"
    );

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Error:",
      error.message
    );

    await mongoose.disconnect();

    process.exit(1);
  }
};

run();