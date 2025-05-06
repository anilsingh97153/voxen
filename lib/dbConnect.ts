import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  // If already connected, skip re-connecting
  if (connection.isConnected === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log("Connected to MongoDB");
    } else {
      console.log("Connection failed");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
    process.exit(1);
  }
}
