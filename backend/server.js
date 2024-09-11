import express from 'express';
import connectdb from './config/db.js';
import dotenv from 'dotenv';
import router from './routes/authroutes.js';
import cors from 'cors';

const app = express();
const port = 9000;

dotenv.config();

app.use(express.json());
app.use(cors());

connectdb();

app.use('/', router); // Changed to handle all routes as defined in authroutes.js

app.get('/', (req, res) =>
    res.send("Hello world")
)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

