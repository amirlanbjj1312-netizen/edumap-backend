const axios = require('axios');

const formatMessage = (request) => {
  const lines = [
    `New consultation request for ${request.schoolName || 'your school'}`,
    `Parent: ${request.parentName}`,
    `Phone: ${request.parentPhone}`,
  ];
  if (request.parentEmail) {
    lines.push(`Email: ${request.parentEmail}`);
  }
  lines.push(`Child: ${request.childName} (${request.childGrade || 'grade not set'})`);
  if (request.consultationType) {
    lines.push(`Type: ${request.consultationType}`);
  }
  if (request.comment) {
    lines.push(`Comment: ${request.comment}`);
  }
  return lines.join('\n');
};

const sendWhatsAppMessage = async (config, request) => {
  if (!config.whatsapp?.apiUrl || !config.whatsapp?.token || !request.whatsappPhone) {
    return { skipped: true };
  }

  const payload = {
    messaging_product: 'whatsapp',
    to: request.whatsappPhone,
    type: 'text',
    text: {
      preview_url: false,
      body: formatMessage(request),
    },
  };

  await axios.post(config.whatsapp.apiUrl, payload, {
    headers: {
      Authorization: `Bearer ${config.whatsapp.token}`,
      'Content-Type': 'application/json',
    },
  });

  return { skipped: false };
};

module.exports = {
  sendWhatsAppMessage,
};
