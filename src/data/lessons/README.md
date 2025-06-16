# Sistema de Lecciones - Estructura de Datos

Esta carpeta contiene la implementación completa del sistema de lecciones estáticas para la aplicación de aprendizaje de inglés.

## 📁 Estructura de Archivos

```
src/data/lessons/
├── types.ts           # Definiciones TypeScript de todas las interfaces
├── utils.ts           # Funciones de utilidad para cargar datos
├── index.ts           # Archivo barrel para exports
├── index.json         # Índice con información básica de todas las lecciones
├── lesson-01.json     # Datos completos de la lección 1
├── lesson-02.json     # Datos completos de la lección 2
├── ...                # lesson-03.json hasta lesson-10.json
├── transcripts/       # Transcripciones separadas por lección y sección
│   ├── lesson-01-main.json
│   ├── lesson-01-ministory.json
│   ├── lesson-01-questions.json
│   ├── lesson-02-main.json
│   ├── lesson-02-ministory.json
│   ├── lesson-02-questions.json
│   └── ...
└── README.md          # Esta documentación
```

## 🏗️ Arquitectura del Sistema

### 1. **Carga Lazy (Bajo Demanda)**
- Cada lección se carga solo cuando se necesita
- Utiliza importaciones dinámicas para optimizar rendimiento
- Sistema de cache integrado para evitar recargas

### 2. **Separación de Datos**
- `index.json`: Información ligera para el dashboard
- `lesson-XX.json`: Datos completos de cada lección

### 3. **TypeScript First**
- Tipos fuertemente tipados para todas las estructuras
- Autocompletado y verificación en tiempo de desarrollo

## 📋 Estructura de una Lección

Cada archivo `lesson-XX.json` contiene (estructura optimizada):

```json
{
  "id": 1,
  "title": "Título de la lección",
  "description": "Descripción breve",
  "mainArticle": {
    "title": "Título del artículo",
    "content": "Contenido principal...",
    "audioUrl": "gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-01/lesson-01-main.mp3",
    "duration": 180,
    "featuredImage": "gs://speakfuel-d832c.firebasestorage.app/images/lesson-01-hero.jpg"
  },
  "vocabulary": {
    "words": [
      {
        "word": "Hello",
        "pronunciation": "/həˈloʊ/",
        "definition": "Definición en inglés",
        "example": "Ejemplo de uso",
        "translation": "Traducción al español",
        "audioUrl": "gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-01/vocabulary/hello.mp3"
      }
    ]
  },
  "miniStory": {
    "title": "Título de la historia",
    "story": "Contenido de la historia...",
    "audioUrl": "gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-01/lesson-01-ministory.mp3",
    "duration": 120
  },
  "questions": {
    "audioUrl": "gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-01/lesson-01-questions.mp3",
    "duration": 90
  }
}
```

## 📝 Estructura de Transcripciones Separadas

Las transcripciones se mantienen en archivos separados para mantener limpia la estructura principal:

```json
{
  "lessonId": 1,
  "section": "main",
  "segments": [
    {
      "text": "Texto del segmento de audio",
      "startTime": 0,
      "endTime": 3.5
    },
    {
      "text": "Siguiente segmento...",
      "startTime": 3.5,
      "endTime": 7.0
    }
  ]
}
```

## 🚀 Uso en Componentes

### Importación
```typescript
import { getLesson, getMainArticle, getVocabulary, getLessonInfo } from '@/data/lessons';
```

### Cargar lección completa
```typescript
const lesson = await getLesson(2); // Carga lección 2
```

### Cargar sección específica
```typescript
const mainArticle = await getMainArticle(2);
const vocabulary = await getVocabulary(2);
const miniStory = await getMiniStory(2);
const questions = await getQuestions(2);

// Cargar transcripciones separadas
const mainTranscript = await getTranscript(2, 'main');
const ministoryTranscript = await getTranscript(2, 'ministory');
const questionsTranscript = await getTranscript(2, 'questions');
```

### Información básica (sin async)
```typescript
const lessonsIndex = getLessonsIndex(); // Todas las lecciones
const lessonInfo = getLessonInfo(2);    // Info básica de lección 2
const title = getLessonTitle(2);        // Solo título
```

## 📂 Organización de Assets

Los archivos de audio e imágenes se almacenan en **Firebase Storage** siguiendo esta estructura:

```
gs://speakfuel-d832c.firebasestorage.app/
├── lessons/
│   ├── lesson-01/
│   │   ├── lesson-01-main.mp3
│   │   ├── lesson-01-ministory.mp3
│   │   ├── lesson-01-questions.mp3
│   │   └── vocabulary/
│   │       ├── hello.mp3
│   │       ├── introduction.mp3
│   │       ├── pleased.mp3
│   │       └── ...
│   ├── lesson-02/
│   │   ├── lesson-02-main.mp3
│   │   ├── lesson-02-ministory.mp3
│   │   ├── lesson-02-questions.mp3
│   │   └── vocabulary/
│   │       ├── chiming.mp3
│   │       ├── rush.mp3
│   │       ├── barista.mp3
│   │       └── ...
│   └── ...
└── images/
    ├── lesson-01-hero.jpg
    ├── lesson-02-hero.jpg
    └── ...
```

**Ventajas de usar Firebase Storage:**
- ✅ Escalabilidad automática
- ✅ CDN global integrado
- ✅ Compresión y optimización automática
- ✅ Control de acceso granular
- ✅ Análiticas de uso
- ✅ Backup y recuperación automática

## ⚡ Características de Rendimiento

1. **Lazy Loading**: Las lecciones se cargan bajo demanda
2. **Cache**: Sistema de cache en memoria para evitar recargas
3. **Tree Shaking**: Solo se importa lo que se usa
4. **Preloading**: Función para precargar lecciones relacionadas

## 🔧 Funciones de Utilidad

### Cache Management
```typescript
preloadLessons([1, 2, 3]);     // Precargar múltiples lecciones
clearLessonsCache();           // Limpiar cache
```

### Validación
```typescript
isValidLessonId(5);            // true/false
```

## 📝 Cómo Agregar Nuevas Lecciones

1. Crear archivo `lesson-XX.json` con la estructura completa
2. Actualizar `index.json` con la información básica
3. Agregar assets de audio e imágenes en `public/`
4. No se requieren cambios en el código

## 🎯 Beneficios de Esta Arquitectura

✅ **Escalable**: Fácil agregar nuevas lecciones sin tocar código
✅ **Performante**: Carga bajo demanda + cache + CDN
✅ **Type Safe**: TypeScript para prevenir errores
✅ **Mantenible**: Datos separados del código
✅ **SEO Friendly**: Datos estáticos para mejor indexación
✅ **Offline Ready**: Los JSON se pueden cachear fácilmente
✅ **Estructura Limpia**: Transcripciones separadas mantienen los archivos organizados
✅ **Cloud-First**: Assets en Firebase Storage para escalabilidad global
✅ **Optimizada**: Sin campos innecesarios, solo lo esencial 