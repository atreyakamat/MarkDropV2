import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 9331;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Route for any other request to index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `🚀 MarkDrop V2 Dashboard is running locally!`);
  console.log(`\x1b[36m%s\x1b[0m`, `🔗 Access it at: http://localhost:${PORT}`);
});
