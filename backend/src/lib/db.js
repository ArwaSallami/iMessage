import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn(
      "MONGO_URI is not set. Starting app without MongoDB connection.",
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });

    console.log("MongoDB connected", conn.connection.host);
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    return false;
  }
}
