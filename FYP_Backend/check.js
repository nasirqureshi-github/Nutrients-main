// const xlsx = require('xlsx');
// const fs = require('fs');
// const path = require('path');

// // Load the Excel file
// const workbook = xlsx.readFile(path.join(__dirname, 'food.xlsx'));

// // Select the first sheet
// const sheetName = workbook.SheetNames[0];
// const worksheet = workbook.Sheets[sheetName];

// // Convert the sheet to JSON format
// const jsonData = xlsx.utils.sheet_to_json(worksheet);

// // Save the JSON data to a file
// const outputPath = path.join(__dirname, 'food_composition_data.json');
// fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));

// console.log('Excel data has been converted to JSON format and saved to', outputPath);
