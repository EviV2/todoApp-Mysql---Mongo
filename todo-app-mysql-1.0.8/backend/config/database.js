const mongoose = require('mongoose');
const redis = require('redis');

// config du client Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error(' Erreur Redis:', err));
redisClient.on('connect', () => console.log(' Connecté a Redis avec succès'));

const connectDB = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const mongoUrl = process.env.DB_URL || 'mongodb://admin_user:admin_pwd@localhost:27017/db_todoapp?authSource=admin';

    await mongoose.connect(mongoUrl, {
      maxPoolSize: 10,               
      serverSelectionTimeoutMS: 5000
    });

    console.log(' Connecté à MongoDB (db_todoapp) avec succès');

  } catch (error) {
    console.error(' Erreur fatale de connexion aux bases de données:', error);

    process.exit(1);
  }
};

module.exports = { connectDB, redisClient };