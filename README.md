-Instalar dependencias del proyecto.
-A la hora de correr la API .NET local, tomar la direccion (ej: "https://localhost:7177"); usarla parqa modificar el puerto en los archivos (.api-url, .env, generate-api.js, config.ts y plugin.ts).
-Con la API .NET corriendo, ejecuta el archivo generate-api.js, que se encuentra en la carpeta de Scripts, para generas las instancias de la API acorde a la url. Debes tener Java correctamente instalado.

Si tuviste este output todo deberia funcionar correctamente: ¨
UPDATING API TO VERSION v1
ESTE ES EL RESULT https://localhost:7177/swagger/v1/swagger.json
(node:14500) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
(Use `node --trace-warnings ...` to show where the warning was created)
Spec format is JSON: portal-api
Code generated for: portal-api
portal-api - Success"

-Si todo el proceso anterior tuvo exito, correr el programa con el comando "quasar dev" desde la terminal.

-Probar.


# Quasar App (quasar-project)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

