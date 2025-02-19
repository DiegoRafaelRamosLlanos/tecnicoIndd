import XLSX from "xlsx";
import path from "path";

const filePath = path.join(process.cwd(), "excel/prehevias.xlsx"); 

const readExcel = () => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];


    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const [header, ...rows] = data;

    const dataWithIds = rows.map((row, index) => {
        const entry = {};
        header.forEach((column, i) => {
            entry[column] = row[i]; 
        });
        entry.id = index + 1;
        return entry;
    });

    return dataWithIds;
};

const writeExcel = (data) => {
    const workbook = XLSX.readFile(filePath);

    const newData = data.map(({ id, ...rest }) => rest); 
    const worksheet = XLSX.utils.json_to_sheet(newData);
    
    workbook.Sheets[workbook.SheetNames[0]] = worksheet;
    XLSX.writeFile(workbook, filePath);
};

export const getAlldatos = (req, res) => {
    try {
        const data = readExcel();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al leer el archivo Excel." });
    }
};
