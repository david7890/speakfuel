const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos de transcripción
const transcriptsDir = path.join(__dirname, '../src/data/lessons/transcripts');

// Función para limpiar un archivo de transcripción
function cleanTranscriptFile(filePath) {
  try {
    // Leer el archivo original
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    // Estructura limpia que queremos mantener
    const cleanedData = {
      lessonId: data.lessonId || extractLessonIdFromFilename(filePath),
      section: data.section || extractSectionFromFilename(filePath),
      segments: []
    };

    // Limpiar cada segmento, manteniendo solo los campos necesarios
    if (data.segments && Array.isArray(data.segments)) {
      cleanedData.segments = data.segments.map(segment => ({
        text: segment.text?.trim() || '',
        start: segment.start || segment.startTime || 0,
        end: segment.end || segment.endTime || 0
      }));
    }

    // No crear backups - procesamiento directo

    // Escribir el archivo limpio
    fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2), 'utf8');
    console.log(`🧹 Limpiado: ${path.basename(filePath)} - ${cleanedData.segments.length} segmentos`);

    return true;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Extraer lesson ID del nombre del archivo
function extractLessonIdFromFilename(filePath) {
  const filename = path.basename(filePath);
  const match = filename.match(/lesson-(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

// Extraer section del nombre del archivo
function extractSectionFromFilename(filePath) {
  const filename = path.basename(filePath);
  if (filename.includes('main')) return 'main';
  if (filename.includes('ministory')) return 'ministory';
  if (filename.includes('questions')) return 'questions';
  return 'main';
}

// Función principal
function cleanAllTranscripts() {
  console.log('🚀 Iniciando limpieza de archivos de transcripción...\n');

  if (!fs.existsSync(transcriptsDir)) {
    console.error(`❌ Directorio no encontrado: ${transcriptsDir}`);
    return;
  }

  // Obtener todos los archivos JSON
  const files = fs.readdirSync(transcriptsDir)
    .filter(file => file.endsWith('.json') && !file.endsWith('.backup'))
    .map(file => path.join(transcriptsDir, file));

  if (files.length === 0) {
    console.log('📂 No se encontraron archivos JSON para procesar');
    return;
  }

  console.log(`📁 Encontrados ${files.length} archivos para procesar:\n`);

  let successCount = 0;
  let errorCount = 0;

  // Procesar cada archivo
  files.forEach(filePath => {
    if (cleanTranscriptFile(filePath)) {
      successCount++;
    } else {
      errorCount++;
    }
  });

  console.log('\n📊 Resumen:');
  console.log(`✅ Archivos procesados exitosamente: ${successCount}`);
  console.log(`❌ Archivos con errores: ${errorCount}`);
  
  if (successCount > 0) {
    console.log('\n✅ Archivos procesados sin crear backups');
  }
}

// Función para borrar backups existentes
function deleteBackups() {
  console.log('🗑️ Borrando archivos backup...\n');

  const backupFiles = fs.readdirSync(transcriptsDir)
    .filter(file => file.endsWith('.json.backup'))
    .map(file => path.join(transcriptsDir, file));

  if (backupFiles.length === 0) {
    console.log('📂 No se encontraron archivos backup para borrar');
    return;
  }

  let deletedCount = 0;
  backupFiles.forEach(backupPath => {
    try {
      fs.unlinkSync(backupPath);
      console.log(`🗑️ Borrado: ${path.basename(backupPath)}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Error borrando ${path.basename(backupPath)}:`, error.message);
    }
  });

  console.log(`\n✅ Se borraron ${deletedCount} archivos backup`);
}

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--delete-backups')) {
  deleteBackups();
} else if (args.includes('--help')) {
  console.log(`
🧹 Script de limpieza de transcripciones

Uso:
  node clean-transcripts.js                # Limpiar archivos (sin crear backups)
  node clean-transcripts.js --delete-backups # Borrar archivos backup existentes
  node clean-transcripts.js --help           # Mostrar esta ayuda

El script mantiene solo los campos: text, start, end
No se crean backups automáticamente
`);
} else {
  cleanAllTranscripts();
} 