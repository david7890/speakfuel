export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
}

export interface TranscriptData {
  lessonId: number;
  section: string;
  segments: TranscriptSegment[];
}

// Cache para evitar cargar archivos múltiples veces
const transcriptCache = new Map<string, TranscriptData>();

export async function loadTranscript(lessonId: number, section: 'main' | 'ministory'): Promise<TranscriptData | null> {
  const cacheKey = `lesson-${String(lessonId).padStart(2, '0')}-${section}`;
  
  // Verificar cache primero
  if (transcriptCache.has(cacheKey)) {
    return transcriptCache.get(cacheKey)!;
  }

  try {
    // Importar dinámicamente el archivo de transcripción
    const transcriptModule = await import(`@/data/lessons/transcripts/lesson-${String(lessonId).padStart(2, '0')}-${section}.json`);
    const transcriptData: TranscriptData = transcriptModule.default;
    
    // Guardar en cache
    transcriptCache.set(cacheKey, transcriptData);
    
    return transcriptData;
  } catch (error) {
    console.error(`Error loading transcript for lesson ${lessonId}, section ${section}:`, error);
    return null;
  }
}

// Función para encontrar el segmento actual basado en el tiempo de audio
export function getCurrentSegmentIndex(segments: TranscriptSegment[], currentTime: number): number {
  return segments.findIndex(
    segment => currentTime >= segment.start && currentTime < segment.end
  );
}

// Función para simular el resaltado de palabras dentro de un segmento
export function getCurrentWordIndex(segment: TranscriptSegment, currentTime: number): number {
  if (!segment) return -1;
  
  const segmentProgress = (currentTime - segment.start) / (segment.end - segment.start);
  const words = segment.text.split(' ');
  const wordIndex = Math.floor(segmentProgress * words.length);
  
  // Asegurar que el índice esté dentro del rango válido
  return Math.min(Math.max(wordIndex, 0), words.length - 1);
} 