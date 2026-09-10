import mongoose from 'mongoose';

export let isConnected = false;

export const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const uri = process.env.MONGODB_URI || 'mongodb+srv://imamsyed20077_db_user:kuIKoMEJztZTDOUq@kovai.wrbxnkp.mongodb.net/?appName=kovai';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Successfully connected to Atlas: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Atlas network unreachable (${error.message}). Running with high-speed in-memory store.`);
  }
};
