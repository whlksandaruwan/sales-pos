import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';

const app = express();
app.use(express.json());

app.post('/print/receipt', async (req, res) => {
  const job = req.body;
  console.log('ESC/POS receipt job (mock only)', job);
  // This is a mock; real USB printing must be wired per device/driver.
  res.json({ success: true });
});

app.post('/print/label', async (req, res) => {
  const job = req.body;
  console.log('ZPL label job (mock only)', job);
  res.json({ success: true });
});

app.post('/cash-drawer/open', async (_req, res) => {
  console.log('Open cash drawer (mock only)');
  res.json({ success: true });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Print agent WebSocket client connected', socket.id);
  socket.on('print', (job) => {
    console.log('Received WS print job', job);
  });
});

httpServer.listen(config.httpPort, () => {
  console.log(`Print agent HTTP listening on ${config.httpPort}`);
});

io.listen(config.wsPort);
console.log(`Print agent WS listening on ${config.wsPort}`);

