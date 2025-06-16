const fs = require('fs');
const path = require('path');

// Información de las lecciones
const lessons = [
  { id: 3, title: "Pidiendo Direcciones", description: "Aprende a pedir y dar direcciones" },
  { id: 4, title: "En el Supermercado", description: "Vocabulario y frases para ir de compras" },
  { id: 5, title: "Haciendo Planes", description: "Cómo hacer planes y citas" },
  { id: 6, title: "En el Restaurante", description: "Conversaciones y pedidos en restaurantes" },
  { id: 7, title: "Hablando del Clima", description: "Habla sobre el clima y las estaciones" },
  { id: 8, title: "En el Trabajo", description: "Vocabulario profesional y de oficina" },
  { id: 9, title: "Vacaciones y Viajes", description: "Planifica y habla sobre viajes" },
  { id: 10, title: "Entrevista de Trabajo", description: "Prepárate para entrevistas de trabajo" }
];

// Template base para una lección
const createLessonTemplate = (lesson) => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.description,
  mainArticle: {
    title: `${lesson.title} - Main Article`,
    content: `This is the main article content for lesson ${lesson.id}: ${lesson.title}.\n\n[Replace this with your actual content]\n\nThis section should contain detailed explanations, examples, and practical information about ${lesson.title.toLowerCase()}.`,
    audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/lesson-${lesson.id.toString().padStart(2, '0')}-main.mp3`,
    duration: 180, // Replace with actual duration
    featuredImage: `gs://speakfuel-d832c.firebasestorage.app/images/lesson-${lesson.id.toString().padStart(2, '0')}-hero.jpg`
  },
  vocabulary: {
    words: [
      {
        word: "Example Word 1",
        pronunciation: "/ɪɡˈzæmpəl/",
        definition: "Replace with actual definition",
        example: "Replace with actual example sentence.",
        translation: "Reemplazar con traducción",
        audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/vocabulary/word1.mp3`
      },
      {
        word: "Example Word 2", 
        pronunciation: "/ɪɡˈzæmpəl/",
        definition: "Replace with actual definition",
        example: "Replace with actual example sentence.",
        translation: "Reemplazar con traducción",
        audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/vocabulary/word2.mp3`
      },
      {
        word: "Example Word 3",
        pronunciation: "/ɪɡˈzæmpəl/", 
        definition: "Replace with actual definition",
        example: "Replace with actual example sentence.",
        translation: "Reemplazar con traducción",
        audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/vocabulary/word3.mp3`
      },
      {
        word: "Example Word 4",
        pronunciation: "/ɪɡˈzæmpəl/",
        definition: "Replace with actual definition", 
        example: "Replace with actual example sentence.",
        translation: "Reemplazar con traducción",
        audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/vocabulary/word4.mp3`
      },
      {
        word: "Example Word 5",
        pronunciation: "/ɪɡˈzæmpəl/",
        definition: "Replace with actual definition",
        example: "Replace with actual example sentence.", 
        translation: "Reemplazar con traducción",
        audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/vocabulary/word5.mp3`
      },
      {
        word: "Example Word 6",
        pronunciation: "/ɪɡˈzæmpəl/",
        definition: "Replace with actual definition",
        example: "Replace with actual example sentence.",
        translation: "Reemplazar con traducción", 
        audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/vocabulary/word6.mp3`
      }
    ]
  },
  miniStory: {
    title: `${lesson.title} - Story Title`,
    story: `[Replace with actual story content for ${lesson.title}]\n\nThis should be an engaging story that demonstrates the lesson's vocabulary and concepts in a practical context.\n\nMake sure to include dialogue and descriptive text that helps students understand the lesson topic.`,
    audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/lesson-${lesson.id.toString().padStart(2, '0')}-ministory.mp3`,
    duration: 120 // Replace with actual duration
  },
  questions: {
    audioUrl: `gs://speakfuel-d832c.firebasestorage.app/lessons/lesson-${lesson.id.toString().padStart(2, '0')}/lesson-${lesson.id.toString().padStart(2, '0')}-questions.mp3`,
    duration: 90 // Replace with actual duration
  }
});

// Generar archivos de lecciones
const generateLessonFiles = () => {
  const dataDir = path.join(__dirname, '..', 'src', 'data', 'lessons');
  
  // Verificar que el directorio existe
  if (!fs.existsSync(dataDir)) {
    console.error('Directory src/data/lessons does not exist!');
    process.exit(1);
  }

  lessons.forEach(lesson => {
    const filename = `lesson-${lesson.id.toString().padStart(2, '0')}.json`;
    const filepath = path.join(dataDir, filename);
    
    // Solo crear si no existe
    if (!fs.existsSync(filepath)) {
      const template = createLessonTemplate(lesson);
      fs.writeFileSync(filepath, JSON.stringify(template, null, 2), 'utf8');
      console.log(`✅ Created template: ${filename}`);
    } else {
      console.log(`⏭️  Skipped existing file: ${filename}`);
    }
  });

  console.log('\n🎉 Lesson templates generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Replace placeholder content with your actual lesson content');
  console.log('2. Update audio URLs to match your actual audio files');
  console.log('3. Add transcripts with correct timestamps');
  console.log('4. Create vocabulary words relevant to each lesson');
  console.log('5. Write engaging stories and questions');
};

// Ejecutar script
if (require.main === module) {
  generateLessonFiles();
}

module.exports = { createLessonTemplate, generateLessonFiles }; 