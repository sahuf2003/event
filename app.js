const express = require('express');
const dotenv = require('dotenv');
const connection = require('./config/db');
const authRoutes = require('./route/authRoutes');
const eventRoutes = require('./route/eventRoutes');
const { requestLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cronJobs = require('./utils/cronJobs');
const app = express();

dotenv.config();
connection();

app.use(express.json());
app.use(requestLogger);
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.get('/', (req, res) => res.send('Event Management API'));

app.use(errorHandler);

cronJobs();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));