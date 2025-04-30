const https = require('https');
const fs = require('fs');
const { exec } = require('child_process');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const api_url = 'https://localhost:7177';
const api_version = 'v1';
const out_dir = './src/api';

const services = [
  // name|openapi-spec-url
  'portal-api|' + `${api_url}/swagger/${api_version}/swagger.json`,
];
const specs_dir = `${out_dir}/specs`;

const services_success = [];
const services_failed = [];

console.log(`UPDATING API TO VERSION ${api_version}`);

async function downloadSpecs() {
  try {
    fs.mkdirSync(specs_dir, { recursive: true });

    for (const service of services) {
      const [name, url] = service.split('|');

      console.log(`ESTE ES EL RESULT ${url}`);
      if (url) {
        const result = await downloadFile(url);
        if (result) {
          services_success.push(name);
          fs.writeFileSync(`${specs_dir}/${name}.json`, result);
        } else {
          services_failed.push(name);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function generateCode() {
  for (const service of services_success) {
    const specPath = `${specs_dir}/${service}.json`;

    try {
      fs.rmSync(`${out_dir}/${service}`, { recursive: true, force: true });

      if (fs.existsSync(specPath)) {
        const specContent = fs.readFileSync(specPath, 'utf8');

        if (specContent.includes('swagger: "2.0"')) {
          console.log(`Spec format is YAML: ${service}`);
          // Lógica para procesar YAML
        } else {
          console.log(`Spec format is JSON: ${service}`);
          await generateCodeWithOpenApiGenerator(specPath, service);
        }
      } else {
        console.log(`Specification file not found: ${specPath}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

function generateCodeWithOpenApiGenerator(specPath, service) {
  return new Promise((resolve) => {
    exec(
      `openapi-generator-cli generate -i ${specPath} -o ${out_dir}/${service} -g typescript-axios --enable-post-process-file --additional-properties "supportsES6=true,useSingleRequestParameter=true,withSeparateModelsAndApi=true,modelPackage=models,apiPackage=api,withoutPrefixEnums=true,enumPropertyNaming=original" --global-property "verbose=true,apiTests=false,modelTests=false"`,
      (error) => {
        if (error) {
          console.error(`Error generating code for ${service}: ${error}`);
        } else {
          console.log(`Code generated for: ${service}`);
        }
        resolve();
      }
    );
  });
}

function clean() {
  fs.rmSync(`${out_dir}/openapitools.json`, { force: true });

  for (const service of services_success) {
    const servicePath = `${out_dir}/${service}`;

    fs.rmSync(`${servicePath}/.gitignore`, { force: true });
    fs.rmSync(`${servicePath}/.npmignore`, { force: true });
    fs.rmSync(`${servicePath}/.openapi-generator-ignore`, { force: true });
    fs.rmSync(`${servicePath}/git_push.sh`, { force: true });
    fs.rmSync(`${servicePath}/.openapi-generator`, {
      recursive: true,
      force: true,
    });
  }
}

function feedback() {
  services_success.forEach((service) => {
    console.log(`${service} - Success`);
  });
  services_failed.forEach((service) => {
    console.log(`${service} - Failed`);
  });
}

(async () => {
  await downloadSpecs();
  await generateCode();
  clean();
  feedback();
})();
