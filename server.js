const http = require('http');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', game: 'The Hunger Games' });
});

http.createServer(app).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
