const mongoose = require('mongoose');
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Erreur Redis:', err));

const connectDB = async () => {
  try {
    // Connexion à Redis
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const mongoUrl = process.env.DB_URL || 'mongodb://admin_user:admin_pwd@localhost:27017/db_todoapp?authSource=admin';

    // 3. Connexion Mongoose
    await mongoose.connect(mongoUrl, {
      maxPoolSize: 5, 
      serverSelectionTimeoutMS: 5000 
    });

    console.log('Connecté à MongoDB avec succès');

  } catch (error) {
    console.error('Erreur de connexion aux bases de données:', error);
    process.exit(1);
  }
};
/////////////////////////TODO: implementer les tests
module.exports = { connectDB, redisClient };