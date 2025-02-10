import xlsx from 'xlsx';

export const getPreheviasData = (req, res) => {
  const workbook = xlsx.readFile('path/to/prehevias.xlsx'); // Ruta al archivo prehevias.xlsx
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  res.json(data);
};
