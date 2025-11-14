const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { buildConfig } = require('./utils/config');
const { buildConsultationsRouter } = require('./routes/consultations');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = buildConfig();
const app = express();

const allowAll = !config.allowedOrigins.length || config.allowedOrigins.includes('*');
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowAll || config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: require('../package.json').version,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/consultations', buildConsultationsRouter(config));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = config.port;
app.listen(port, () => {
  console.log(`Edumap API listening on port ${port}`);
});
