import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import eventRoutes from './routes/event.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/', (_req, res) => {
  res.send('Backend is running');
});

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});