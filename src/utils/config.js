const path = require('path');

const sanitize = (value) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const parseList = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const buildConfig = () => {
  const dataFilePath =
    process.env.CONSULTATION_STORE_FILE ||
    path.resolve(__dirname, '../../data/consultations.json');

  return {
    port: Number(process.env.PORT) || 4000,
    allowedOrigins: parseList(process.env.ALLOWED_ORIGINS),
    dataFilePath,
    whatsapp: {
      apiUrl: sanitize(process.env.WHATSAPP_API_URL),
      token: sanitize(process.env.WHATSAPP_ACCESS_TOKEN),
      templateName: sanitize(process.env.WHATSAPP_TEMPLATE_NAME) || 'consultation_update',
    },
  };
};

module.exports = {
  buildConfig,
};
