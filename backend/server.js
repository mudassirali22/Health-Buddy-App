import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import vitalRoutes from './routes/vitalRoutes.js';
import geminiRoutes from './routes/gemini.js';
import familyRoutes from './routes/familyRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch((err) => {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1);
});

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/family', familyRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: ' HealthBuddy API is running successfully',
     timestamp: new Date().toISOString()
  });
});

//  Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;