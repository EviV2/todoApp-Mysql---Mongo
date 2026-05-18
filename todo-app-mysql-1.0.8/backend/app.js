// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env vars
process.loadEnvFile('./.env');

//On importe notre fonction de connexion qu'on a créée dans database.js
const { connectDB } = require('./config/database');
const router = require('./routes');

const PORT = process.env.PORT || '3000';
const ENV = process.env.NODE_ENV || 'development';

let app; // singleton Express app
let server; // http.Server

function createApp() {
  if (app) return app;

  app = express();

  // Serve frontend static files
  app.use(express.static(path.join(__dirname, '../dist')));

  app.use(express.json());
  app.use(cookieParser());

  // ---> AJOUTE CE MOUCHARD JUSTE ICI <---
  app.use((req, res, next) => {
    console.log(`Requête de type : ${req.method} sur ${req.url}`);
    next();
  });
  // -------------------------------------
  // API routes
  app.use(router);

  // TEST-ONLY helper: reset DB between specs
  if (process.env.NODE_ENV === 'test') {
    const testApi = require('./routes/test.api');
    app.use('/test', testApi);
  }

  // Fallback to SPA index
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  return app;
}

/**
 * Initialize DB + models and (optionally) start listening.
 */
async function initApp(options = {}) {
  const { listen = true, port = PORT } = options;

  const theApp = createApp();

  //On lance la connexion à MongoDB et Redis en une seule ligne
  await connectDB();

  if (listen) {
    server = theApp.listen(port, () => {
      console.info(`Serveur sur le port ${port} (env: ${ENV})`);
    });
  }

  //On retourne uniquement l'app et le serveur
  return { app: theApp, server };
}

async function stopApp() {
  if (server) {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    server = undefined;
  }
}

module.exports = { createApp, initApp, stopApp };

if (require.main === module) {
  initApp({ listen: true }).catch((err) => {
    console.error("Impossible de démarrer l'app:", err);
    process.exit(1);
  });
}