param (
    [string]$api_url = "https://localhost:7295",
    [string]$api_version = "v1",
    [string]$out_dir = "./src/api"
)

# Definición de servicios
$services = @(
    "portal-api|$api_url/swagger/$api_version/swagger.json"
)
$specs_dir = Join-Path $out_dir "specs"

# Arreglos para almacenar servicios exitosos y fallidos
$services_success = @()
$services_failed = @()

# Imprimir información
Write-Host "UPDATING API TO VERSION $api_version"

function Download-Specs {
  if (-not (Test-Path $specs_dir)) {
      New-Item -ItemType Directory -Path $specs_dir | Out-Null
  }

  foreach ($service in $services) {
    $name, $url = $service.Split('|')

    if (-not [string]::IsNullOrWhiteSpace($url)) {
        Write-Host "Downloading specification from: $url"
        [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        try {
            $request = [System.Net.WebRequest]::Create($url)
            $response = $request.GetResponse()
            $stream = $response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)

            # Leemos líneas hasta encontrar la primera que no contiene el BOM
            do {
                $line = $reader.ReadLine()
            } while ($line -match '\xEF\xBB\xBF')

            # Construimos el contenido sin el BOM
            $result = $line
            while ($reader.Peek() -ge 0) {
                $result += "`n" + $reader.ReadLine()
            }

            $result = $result -replace '^\xEF\xBB\xBF', ''
            $services_success += $name

            # Guardar el contenido en un archivo
            $specFilePath = Join-Path $specs_dir "$name.json"
            $result | Out-File -FilePath $specFilePath -Force -Encoding UTF8

            Write-Host "Specification saved to: $specFilePath"
        } catch {
            Write-Host "Error downloading specification from $url $_"
            $services_failed += $name
        }
    }
}

# Devolver la lista de servicios exitosos
return $services_success
}


function Generate-Code {
  param (
      [string[]]$successNames
  )

  foreach ($service in $successNames) {
      Write-Host "Generating code for: $service"
      $serviceSpecPath = Join-Path $specs_dir "$service.json"
      $serviceOutputPath = Join-Path $out_dir "$service"

      Write-Host "ESTA ES LA RUTA PARA LOS SPECS: $serviceSpecPath"

      Remove-Item -Path $serviceOutputPath -Recurse -Force

      if (Test-Path $serviceSpecPath) {
          $specContent = Get-Content -Path $serviceSpecPath -Raw
          $specContent = $specContent -replace '^\xEF\xBB\xBF', ''

          if ($specContent -match 'swagger: "2.0"') {
              Write-Host "Spec format is YAML: $service"
              # Lógica para procesar YAML
          } else {
              Write-Host "Spec format is JSON: $service"
              # Lógica para procesar JSON
          }

          & openapi-generator-cli generate `
              -i $serviceSpecPath `
              -o $serviceOutputPath `
              -g typescript-axios `
              --enable-post-process-file `
              --additional-properties "supportsES6=true,useSingleRequestParameter=true,withSeparateModelsAndApi=true,modelPackage=models,apiPackage=api,withoutPrefixEnums=true,enumPropertyNaming=original" `
              --global-property "verbose=true,apiTests=false,modelTests=false" `
              1>$null
      } else {
          Write-Host "Specification file not found: $serviceSpecPath"
      }
  }
}


# Función para limpiar
function Clean {
    foreach ($service in $services_success) {
        $serviceGitIgnorePath = Join-Path $out_dir $service -ChildPath ".gitignore"
        $serviceNpmIgnorePath = Join-Path $out_dir $service -ChildPath ".npmignore"
        $serviceGeneratorIgnorePath = Join-Path $out_dir $service -ChildPath ".openapi-generator-ignore"
        $serviceGitPushShPath = Join-Path $out_dir $service -ChildPath "git_push.sh"
        $serviceOpenApiGeneratorPath = Join-Path $out_dir $service -ChildPath ".openapi-generator"

        if (Test-Path $serviceGitIgnorePath) {
            Remove-Item -Path $serviceGitIgnorePath -Force
        }

        if (Test-Path $serviceNpmIgnorePath) {
            Remove-Item -Path $serviceNpmIgnorePath -Force
        }

        if (Test-Path $serviceGeneratorIgnorePath) {
            Remove-Item -Path $serviceGeneratorIgnorePath -Force
        }

        if (Test-Path $serviceGitPushShPath) {
            Remove-Item -Path $serviceGitPushShPath -Force
        }

        if (Test-Path $serviceOpenApiGeneratorPath) {
            Remove-Item -Path $serviceOpenApiGeneratorPath -Recurse -Force
        }
    }
}

# Función para mostrar resultados
function Feedback {
    foreach ($service in $services_success) {
        Write-Host "$service - Success"
    }
    foreach ($service in $services_failed) {
        Write-Host "$service - Failed"
    }
}

# Ejecutar funciones
$successServices = Download-Specs
Generate-Code -successNames $successServices
Clean
Feedback
