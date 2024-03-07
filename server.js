const express = require('express');
const routes = require('./routes');
// import sequelize connection
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Sync Sequelize models to the MySQL database
sequelize.sync({ force: false }).then(() => {
  console.log('Sequelize models synced to the database.');
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync Sequelize models:', err);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});