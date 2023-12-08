const path = require('path');
const express = require('express');
const UserModel = require('./models/User');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const searchResults = require('./routes/searchResults');
const cors = require('cors');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your-secret-key', // Ganti dengan secret key yang lebih aman
  resave: false,
  saveUninitialized: true
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));;
app.use(express.static(path.join(__dirname, '../public')));
app.use('/users', userRoutes);
app.use('/search', searchResults);


app.get('/', (req, res) => {
  const index = path.join(__dirname, '../../public/index.html');
  res.sendFile(index);
});

// Sync Sequelize models with the database
(async () => {
  try {
    await sequelize.sync();
    console.log('Database and tables synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();
// app.use(express.logger('dev'))
// Custom error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message }); // Send error details as JSON response
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
