import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Costumer from '../models/Costumer';

const router = express.Router();
const saltRounds = 10;

router.post('/', async (req: Request, res: Response) => {
    try {
        const costumerPayload = req.body;

        const hashedPassword = await bcrypt.hash(costumerPayload.password, saltRounds);
        costumerPayload.password = hashedPassword;

        const newCostumer = await Costumer.create(costumerPayload);

        res.status(201).json(newCostumer);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ message: 'Erro ao cadastrar cliente' });
    }
});

export default router;
