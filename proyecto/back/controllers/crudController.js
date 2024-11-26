import XLSX from "xlsx";
import path from "path";

const filePath = path.join(process.cwd(), "excel/archivo.xlsx"); 

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

export const registrarUsuario = (req, res) => {
    try {
        const newData = req.body;
        let data = readExcel();

        newData.id = data.length + 1;

        data.push(newData);
        writeExcel(data);

        res.status(201).json({ message: "Usuario registrado correctamente", data: newData });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar usuario al archivo Excel." });
    }
};

export const actualizarUsuario = (req, res) => {
    try {
        const id = parseInt(req.params.idUsuario);
        
        if (id === 0) {
            return res.status(403).json({ message: "Prohibido actualizar el usuario con ID 1." });
        }

        let data = readExcel();
        const userIndex = data.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            data[userIndex] = { ...data[userIndex], ...req.body }; 
            writeExcel(data);
            res.json({ message: "Usuario actualizado correctamente", data: data[userIndex] });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el archivo Excel." });
    }
};


export const borrarUsuario = (req, res) => {
    try {
        const id = parseInt(req.params.idUsuario);
        if (id === 0) {
            return res.status(403).json({ message: "Prohibido eliminar el usuario con ID 1." });
        }

        let data = readExcel();

        const filteredData = data.filter(user => user.id !== id);

        if (data.length === filteredData.length) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        writeExcel(filteredData);
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario del archivo Excel." });
    }
};
