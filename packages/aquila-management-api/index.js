import { join } from 'path';
import cors from 'cors';
import express, { json } from 'express';
import routes from './routes.js';
import expressErrorHandler from './middleware/expressErrorHandler.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const app = express();

app.use(json({ limit: '50mb' }));
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    }),
);
app.use('/api', routes, expressErrorHandler);
app.use(express.static(join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(join(`${__dirname}/build/index.html`));
});

app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`server listening on port ${PORT}`);
});
