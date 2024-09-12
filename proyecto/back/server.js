const express = require("express");
const XLSX = require("xlsx"); 
const path = require("path");

const app = express();
const port = 3000;


app.get('/', (req, res) => {
    const filePath = path.join(__dirname, "archivo.xlsx");//aca va el excel y el nombre que tenga
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    res.json(data);
});

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto " + port);
});
