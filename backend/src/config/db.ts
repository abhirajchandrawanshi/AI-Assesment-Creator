import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ WARNING: MONGODB_URI is not set. Falling back to In-Memory storage mode.');
    isConnected = false;
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully.');
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB connection failed. Falling back to In-Memory storage mode.');
    console.error(error);
    isConnected = false;
    return false;
  }
}

export function getIsDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
