const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();
const PORT = 3000;

// Reemplazá con tus claves reales
const vapidKeys = {
  publicKey: 'BEhvkg-E2RANfeAnjfj3oetiCP6m0KQQCOoRmyBDhUn2EoJwYH7TijhnqHZ1T0frhEEkRSJbDBMD6SjNolRfwVc',
  privateKey: 'FzDmJ8LKggXoL06mZtxH5TBymhHNp6N38vsw7Vo28Sk' // sin "!"
};

webpush.setVapidDetails(
  'mailto:juandiegoo1725@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use(bodyParser.json());

// En memoria (solo para pruebas)
let subscriptions = [];

app.post('/api/save-sub', (req, res) => {
  const sub = req.body;
  subscriptions.push(sub);
  console.log('✅ Suscripción recibida y almacenada');
  res.status(201).json({ message: 'Subscripción guardada correctamente' });
});

app.get('/api/send', async (req, res) => {
  const notiPayload = JSON.stringify({
    title: '🔥 ¡Volvé a jugar Tetris!',
    body: 'Tu récord puede ser superado en cualquier momento...',
  });

  const resultados = [];

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, notiPayload);
      resultados.push({ status: '✅ Enviado' });
    } catch (error) {
      console.error('❌ Error al enviar a un cliente:', error);
      resultados.push({ status: '❌ Falló', error: error.message });
    }
  }

  res.json(resultados);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Push corriendo en http://localhost:${PORT}`);
});