import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import householdRoutes from './routes/householdRoutes';
import clothingRoutes from './routes/clothingRoutes';
import miscellaneousRoutes from './routes/miscellaneousRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/household', householdRoutes);
app.use('/api/clothing', clothingRoutes);
app.use('/api/miscellaneous', miscellaneousRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
