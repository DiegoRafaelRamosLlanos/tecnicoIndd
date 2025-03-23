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

const addOrUpdateSecondSheet = (data) => {
    const workbook = XLSX.readFile(filePath);

    // Crear una nueva hoja de cálculo con los datos proporcionados
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Añadir o actualizar la segunda hoja en el libro de trabajo
    workbook.Sheets["SecondSheet"] = worksheet;
    if (!workbook.SheetNames.includes("SecondSheet")) {
        workbook.SheetNames.push("SecondSheet");
    }

    // Escribir el libro de trabajo actualizado nuevamente en el archivo
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

export const getSecondSheetData = (req, res) => {
    try {
        const workbook = XLSX.readFile(filePath);
        let data = [];
        
        if (workbook.SheetNames.includes("SecondSheet")) {
            const worksheet = workbook.Sheets["SecondSheet"];
            data = XLSX.utils.sheet_to_json(worksheet);
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al leer la segunda hoja del archivo Excel." });
    }
};

export const addOrUpdateSecondSheetData = (req, res) => {
    try {
        const workbook = XLSX.readFile(filePath);
        let secondSheetData = [];

        // Obtener datos existentes de la segunda hoja si existen
        if (workbook.SheetNames.includes("SecondSheet")) {
            const worksheet = workbook.Sheets["SecondSheet"];
            secondSheetData = XLSX.utils.sheet_to_json(worksheet);
        }

        // Verificar si ya existe una entrada exactamente igual
        const duplicateEntry = secondSheetData.find(item => 
            item.DNI === req.body.DNI && 
            item.materia === req.body.materia &&
            item.cursoMateria === req.body.cursoMateria
        );

        if (duplicateEntry) {
            return res.status(400).json({ 
                error: "Ya existe una entrada para este estudiante en esta materia y curso" 
            });
        }

        // Agregar nuevo registro
        secondSheetData.push(req.body);

        // Actualizar la hoja
        const newWorksheet = XLSX.utils.json_to_sheet(secondSheetData);
        workbook.Sheets["SecondSheet"] = newWorksheet;

        // Asegurarse de que la hoja está en SheetNames
        if (!workbook.SheetNames.includes("SecondSheet")) {
            workbook.SheetNames.push("SecondSheet");
        }

        // Guardar el archivo
        XLSX.writeFile(workbook, filePath);
        res.json({ 
            message: "Datos agregados correctamente", 
            data: req.body,
            success: true 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar datos a la segunda hoja." });
    }
};

export const updateSecondSheetData = (req, res) => {
    try {
        const workbook = XLSX.readFile(filePath);
        
        // Actualizar la hoja con los nuevos datos
        const newWorksheet = XLSX.utils.json_to_sheet(req.body);
        workbook.Sheets["SecondSheet"] = newWorksheet;

        // Guardar el archivo
        XLSX.writeFile(workbook, filePath);
        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar datos de la segunda hoja." });
    }
};
