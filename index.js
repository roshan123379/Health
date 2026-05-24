import express from 'express';
import dotenv from 'dotenv';
import dns from 'dns';
import cors from 'cors';

// Prefer IPv4 results first which can avoid some SRV lookup issues on Windows
dns.setDefaultResultOrder && dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS origin received:', origin);
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log('CORS origin rejected:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
}));

import userRoutes from './Routes/userRoute.js';
import microplanRoutes from './Routes/microplanRoute.js';
import manpowerRoutes from './Routes/manpowerRoute.js';
app.use('/api/users', userRoutes);
app.use('/api/microplans', microplanRoutes);
app.use('/api/manpower', manpowerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import { connectDB } from './Database/db.js';
connectDB();
