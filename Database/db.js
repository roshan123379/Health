import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        const uri = (process.env.MONGO_URI || "").trim();
        console.log('Connecting to MongoDB (srv?):', uri.startsWith('mongodb+srv'));

        mongoose.set('debug', true);

        mongoose.connection.on('connecting', () => console.log('Mongoose: connecting'));
        mongoose.connection.on('connected', () => console.log('Mongoose: connected'));
        mongoose.connection.on('open', () => console.log('Mongoose: connection open'));
        mongoose.connection.on('error', (err) => console.error('Mongoose error:', err && err.message));
        mongoose.connection.on('disconnected', () => console.log('Mongoose: disconnected'));

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
        });

        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err && err.message);
        if (err && err.stack) console.error(err.stack);
        // Keep process running for debugging in dev
    }
};
