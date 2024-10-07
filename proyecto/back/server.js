import express from "express";
import crudRoutes from './routes/crudRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/proyecto', crudRoutes);

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto " + port);
});
