const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();




const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the required methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow the required headers
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const activityRoutes = require("./routes/activityRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const subscriptionPlanRoutes = require('./routes/subscriptionPlanRoutes');

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});