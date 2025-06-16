import { LessonData, LessonIndex } from './types';
import lessonsIndex from './index.json';

// Cache para las lecciones cargadas
const lessonsCache = new Map<number, LessonData>();

/**
 * Obtiene la información básica de todas las lecciones
 */
export function getLessonsIndex(): LessonIndex[] {
  return lessonsIndex as LessonIndex[];
}

/**
 * Obtiene la información básica de una lección específica
 */
export function getLessonInfo(id: number): LessonIndex | null {
  return (lessonsIndex as LessonIndex[]).find(lesson => lesson.id === id) || null;
}

/**
 * Carga los datos completos de una lección de forma lazy
 */
export async function getLesson(id: number): Promise<LessonData | null> {
  // Verificar cache primero
  if (lessonsCache.has(id)) {
    return lessonsCache.get(id)!;
  }

  try {
    // Importación dinámica para cargar solo la lección necesaria
    const lessonModule = await import(`./lesson-${id.toString().padStart(2, '0')}.json`);
    const lessonData: LessonData = lessonModule.default;
    
    // Guardar en cache
    lessonsCache.set(id, lessonData);
    
    return lessonData;
  } catch (error) {
    console.error(`Error loading lesson ${id}:`, error);
    return null;
  }
}

/**
 * Obtiene solo la sección main_article de una lección
 */
export async function getMainArticle(id: number) {
  const lesson = await getLesson(id);
  return lesson?.mainArticle || null;
}

/**
 * Obtiene solo la sección vocabulary de una lección
 */
export async function getVocabulary(id: number) {
  const lesson = await getLesson(id);
  return lesson?.vocabulary || null;
}

/**
 * Obtiene solo la sección miniStory de una lección
 */
export async function getMiniStory(id: number) {
  const lesson = await getLesson(id);
  return lesson?.miniStory || null;
}

/**
 * Obtiene solo la sección questions de una lección
 */
export async function getQuestions(id: number) {
  const lesson = await getLesson(id);
  return lesson?.questions || null;
}

/**
 * Precargar múltiples lecciones para mejorar rendimiento
 */
export async function preloadLessons(ids: number[]): Promise<void> {
  const promises = ids
    .filter(id => !lessonsCache.has(id))
    .map(id => getLesson(id));
  
  await Promise.all(promises);
}

/**
 * Obtiene el título de una lección sin cargar todos los datos
 */
export function getLessonTitle(id: number): string {
  const lessonInfo = getLessonInfo(id);
  return lessonInfo?.title || "Lección de Inglés";
}

/**
 * Obtiene la descripción de una lección sin cargar todos los datos
 */
export function getLessonDescription(id: number): string {
  const lessonInfo = getLessonInfo(id);
  return lessonInfo?.description || "Aprende inglés de manera práctica";
}

/**
 * Valida si un ID de lección es válido
 */
export function isValidLessonId(id: number): boolean {
  return id >= 1 && id <= 10 && lessonsIndex.some(lesson => lesson.id === id);
}

/**
 * Obtiene la transcripción de una sección específica
 */
export async function getTranscript(id: number, section: 'main' | 'ministory' | 'questions') {
  try {
    const transcriptModule = await import(`./transcripts/lesson-${id.toString().padStart(2, '0')}-${section}.json`);
    return transcriptModule.default;
  } catch (error) {
    console.error(`Error loading transcript for lesson ${id}, section ${section}:`, error);
    return null;
  }
}

/**
 * Limpia el cache de lecciones (útil para testing o liberación de memoria)
 */
export function clearLessonsCache(): void {
  lessonsCache.clear();
} 