import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import leadsRoutes from './routes/leads.routes';
 
dotenv.config();
 
const app = express();
 
app.use(helmet());
app.use(cors());
app.use(express.json());
 
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
 
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leads-dashboard';
 
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
 
