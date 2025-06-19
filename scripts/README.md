# 🧹 Scripts de Limpieza de Transcripciones

## Uso del Script

### Limpiar archivos de transcripción
```bash
node scripts/clean-transcripts.js
```

### Borrar archivos backup existentes
```bash
node scripts/clean-transcripts.js --delete-backups
```

### Ver ayuda
```bash
node scripts/clean-transcripts.js --help
```

## ¿Qué hace el script?

### Antes (archivo original con muchos campos):
```json
{
  "segments": [
    {
      "id": 0,
      "end": 1.26,
      "seek": 0,
      "text": " Hey, are you ready for this?",
      "start": 0,
      "tokens": [50365, 1911, 11, 366, 291, 1919, 337, 341, 30, 50428],
      "avg_logprob": -0.17538206917898996,
      "temperature": 0,
      "no_speech_prob": 0.00490189902484417,
      "compression_ratio": 1.5515873015873016
    }
  ]
}
```

### Después (archivo limpio):
```json
{
  "lessonId": 1,
  "section": "main",
  "segments": [
    {
      "text": "Hey, are you ready for this?",
      "start": 0,
      "end": 1.26
    }
  ]
}
```

## Campos que se mantienen:
- ✅ `text` - El texto de la transcripción
- ✅ `start` - Tiempo de inicio en segundos
- ✅ `end` - Tiempo de fin en segundos

## Campos que se eliminan:
- ❌ `id` - ID del segmento
- ❌ `seek` - Información de seek
- ❌ `tokens` - Tokens de whisper
- ❌ `avg_logprob` - Probabilidad promedio
- ❌ `temperature` - Temperatura del modelo
- ❌ `no_speech_prob` - Probabilidad de no habla
- ❌ `compression_ratio` - Ratio de compresión

## Funciones adicionales:
- 🚀 **Procesamiento directo**: No crea backups automáticamente para mayor velocidad
- 🗑️ **Limpieza de backups**: Opción para borrar archivos backup existentes
- 📊 **Estadísticas**: Muestra cuántos archivos se procesaron y cuántos segmentos tiene cada uno
- 🏷️ **Metadatos**: Añade automáticamente `lessonId` y `section` basándose en el nombre del archivo

## Estructura de archivos esperada:
```
src/data/lessons/transcripts/
├── lesson-01-main.json
├── lesson-01-ministory.json
├── lesson-02-main.json
└── ...
```

## Limpieza de archivos backup:
Si tienes archivos backup que ya no necesitas:
```bash
node scripts/clean-transcripts.js --delete-backups
```

Esto borrará todos los archivos `.backup` del directorio de transcripciones. 