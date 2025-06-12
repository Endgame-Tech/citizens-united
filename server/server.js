import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import causeRoutes from './routes/cause.route.js';
import supporterRoutes from './routes/supporter.route.js';
import userRoutes from './routes/user.route.js';
import inviteRoutes from './routes/invite.route.js';
import broadcastRoutes from './routes/broadcast.route.js';
import notificationRoutes from './routes/notification.route.js';
import chatSessionRoutes from './routes/chatSession.route.js';
import evaluationRoutes from './routes/evaluation.route.js';
import advocacyRoutes from './routes/advocacy.route.js';
import monitorRoutes from './routes/monitor.route.js';
import stateOfNationImageRoutes from './routes/stateOfNationImage.route.js';

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';


// Middlewares
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/causes', causeRoutes);
app.use('/supporters', supporterRoutes);
app.use('/users', userRoutes);
app.use('/invites', inviteRoutes);
app.use('/broadcasts', broadcastRoutes);
app.use('/notifications', notificationRoutes);
app.use('/chat-s', chatSessionRoutes);
app.use('/evaluation', evaluationRoutes)
app.use('/advocacy', advocacyRoutes);
app.use('/monitor', monitorRoutes);
app.use('/state-of-nation-images', stateOfNationImageRoutes);

// Placeholder route
app.get('/', (req, res) => {
  res.send('Citizens United API running...');
});

// MongoDB connection
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
