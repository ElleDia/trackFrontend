// document.getElementById("file-Input").addEventListener('change', readXlsxFile)
// async function readXlsxFile(event) {
//     const input = event.target;
//     if (input.files && input.files[0]) {
//         var xlsx = new XLSX();
//         const file = input.files[0];
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const data = new Uint8Array(e.target.result);
//             const workbook = XLSX.read(data, { type: 'array' });
//             const sheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[sheetName];
//             const json = XLSX.utils.sheet_to_json(worksheet);
//             console.log(json); // Output the parsed data to the console
//         };
//         reader.readAsArrayBuffer(file);
//     }
// }

document.getElementById("file-Input").addEventListener('change', readXlsxFile())