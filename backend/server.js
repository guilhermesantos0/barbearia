const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = new express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(() => {
    console.clear();
    console.log('Conectado ao MongoDB Atlas!');
    app.listen(process.env.PORT, () => console.log(`Servidor conectado na porta: ${process.env.PORT}`));
})
.catch((err) => {
    console.error('Erro de conexão:', err)
});
