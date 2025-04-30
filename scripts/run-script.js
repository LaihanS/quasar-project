const { exec } = require('child_process');

// Ruta al script de shell
const scriptPath = './scripts/generate-api.js';

// Ejecutar el script de shell usando bash
exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar el script: ${error}`);
    return;
  }

  console.log(`Resultado:\n${stdout}`);
  console.error(`Errores:\n${stderr}`);
});
