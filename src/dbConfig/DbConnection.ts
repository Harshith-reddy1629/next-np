import mongoose from "mongoose";

const mongoConnection = async () => {
  try {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
      console.log("connected");
      return;
    }
    if (connectionState === 2) {
      console.log("connecting");
      return;
    }

    const connect = await mongoose.connect(process.env.CONNECTION_STRING!);
    console.log("database", connect.connection.name);
  } catch (error) {
    console.log("error", error);
    // process.exit(1);
    throw error;
  }
};

export default mongoConnection;
