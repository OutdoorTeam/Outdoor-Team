import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function startServer(port) {
    const app = express();
    // Servir frontend compilado
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
    });
    app.listen(port, () => {
        console.log(`✅ Servidor corriendo en puerto ${port}`);
    });
}
