const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const discussionRoutes = require('./routes/discussionRoutes');
const courseRoutes = require('./routes/courseRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const faqRoutes = require('./routes/faqRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Set security headers
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging in development mode
}
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Code Mastery Zone API is running');
});

app.use('/api/discussions', discussionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/faqs', faqRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold);
});
