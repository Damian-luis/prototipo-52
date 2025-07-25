const fs = require('fs');
const path = require('path');

// Función para reemplazar alerts en un archivo
function replaceAlertsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Reemplazar alert('mensaje') por showError('mensaje')
    content = content.replace(
      /alert\(['"`]([^'"`]+)['"`]\)/g,
      (match, message) => {
        modified = true;
        return `showError('${message}')`;
      }
    );

    // Reemplazar alert('mensaje' + variable) por showError('mensaje' + variable)
    content = content.replace(
      /alert\(['"`]([^'"`]+)\s*\+\s*([^)]+)\)/g,
      (match, message, variable) => {
        modified = true;
        return `showError('${message}' + ${variable})`;
      }
    );

    // Reemplazar alert(variable + 'mensaje') por showError(variable + 'mensaje')
    content = content.replace(
      /alert\(([^)]+)\s*\+\s*['"`]([^'"`]+)['"`]\)/g,
      (match, variable, message) => {
        modified = true;
        return `showError(${variable} + '${message}')`;
      }
    );

    // Reemplazar alert(variable) por showError(variable)
    content = content.replace(
      /alert\(([^)]+)\)/g,
      (match, variable) => {
        modified = true;
        return `showError(${variable})`;
      }
    );

    // Agregar import si se encontraron alerts
    if (modified && !content.includes("import { showError } from '@/util/notifications'")) {
      // Buscar la línea después de los imports existentes
      const importRegex = /import.*from.*['"`].*['"`];?\n/g;
      const imports = content.match(importRegex) || [];
      
      if (imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const insertIndex = content.lastIndexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertIndex) + 
                 "import { showError } from '@/util/notifications';\n" + 
                 content.slice(insertIndex);
      } else {
        // Si no hay imports, agregar al inicio
        content = "import { showError } from '@/util/notifications';\n" + content;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
  return false;
}

// Función para buscar archivos recursivamente
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorar node_modules y .next
        if (item !== 'node_modules' && item !== '.next' && item !== '.git') {
          traverse(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Función principal
function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findFiles(srcDir);
  
  console.log(`🔍 Searching for alerts in ${files.length} files...`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    if (replaceAlertsInFile(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`- Files processed: ${files.length}`);
  console.log(`- Files updated: ${updatedCount}`);
  console.log(`- Alerts replaced: ${updatedCount > 0 ? 'Multiple' : 'None'}`);
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = { replaceAlertsInFile, findFiles }; 