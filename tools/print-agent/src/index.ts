import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';

const app = express();
app.use(express.json());

app.post('/print/receipt', async (req, res) => {
  const job = req.body;
  // In a real implementation, translate job to ESC/POS and send to printer
  console.log('ESC/POS receipt job', job);
  res.json({ success: true });
});

app.post('/print/label', async (req, res) => {
  const job = req.body;
  // In a real implementation, translate job to ZPL and send to printer
  console.log('ZPL label job', job);
  res.json({ success: true });
});

app.post('/cash-drawer/open', async (_req, res) => {
  // In a real implementation, send pulse command to cash drawer
  console.log('Open cash drawer');
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


