import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import costumerRoutes from './src/routes/costumer';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/upload', express.static(path.join(__dirname, 'src/upload')));

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.clear();
        console.log('✅ Conectado ao MongoDB Atlas!');
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`🚀 Servidor rodando na porta: ${port}`));
    })
    .catch((err) => {
        console.error('❌ Erro de conexão:', err);
    });

app.use('/costumer', costumerRoutes);
