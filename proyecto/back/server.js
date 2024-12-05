import express from "express";
import crudRoutes from './routes/crudRoutes.js';
import cors from "cors"; 

const app = express();
const port = 3001;


app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
}));

app.use(express.json());
app.use('/proyecto', crudRoutes);


app.listen(port, () => {
    console.log("Servidor corriendo en el puerto " + port);
});