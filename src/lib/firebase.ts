// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNARetvKOGxIvxl40H0x7wg_Uz98COQVI",
  authDomain: "speakfuel-d832c.firebaseapp.com",
  projectId: "speakfuel-d832c",
  storageBucket: "speakfuel-d832c.firebasestorage.app",
  messagingSenderId: "797301383686",
  appId: "1:797301383686:web:5410c37c2a8fc6e45d5987",
  measurementId: "G-NM7RF8DZT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Audio URL cache to avoid multiple downloads of the same URL
const audioUrlCache = new Map<string, string>();

/**
 * Get audio URL from Firebase Storage
 * @param path - The path to the audio file in Firebase Storage (e.g., "lessons/lesson1/main.mp3")
 * @returns Promise with the download URL
 */
export const getAudioUrl = async (path: string): Promise<string> => {
  try {
    // Check cache first
    if (audioUrlCache.has(path)) {
      return audioUrlCache.get(path)!;
    }

    // Get reference to the file
    const audioRef = ref(storage, path);
    
    // Get the download URL
    const url = await getDownloadURL(audioRef);
    
    // Cache the URL
    audioUrlCache.set(path, url);
    
    return url;
  } catch (error) {
    console.error(`Error getting audio URL for path: ${path}`, error);
    throw error;
  }
};

/**
 * Get audio URLs for a specific lesson
 * @param lessonId - The lesson ID (e.g., "lesson1")
 * @returns Object with audio URLs for different parts of the lesson
 */
export const getLessonAudioUrls = async (lessonId: string) => {
  try {
    const [mainUrl, ministoryUrl] = await Promise.all([
      getAudioUrl(`lessons/${lessonId}/main.mp3`),
      getAudioUrl(`lessons/${lessonId}/ministory.mp3`)
    ]);

    return {
      main: mainUrl,
      ministory: ministoryUrl,
      // Add vocabulary and questions URLs as needed
    };
  } catch (error) {
    console.error(`Error getting lesson audio URLs for lesson: ${lessonId}`, error);
    throw error;
  }
};

/**
 * Get vocabulary word audio URL
 * @param lessonId - The lesson ID (e.g., "lesson1")
 * @param wordIndex - The vocabulary word index (1, 2, 3, etc.)
 * @returns Promise with the download URL
 */
export const getVocabularyAudioUrl = async (lessonId: string, wordIndex: number): Promise<string> => {
  const path = `lessons/${lessonId}/vocabulary${wordIndex}.mp3`;
  return getAudioUrl(path);
};

/**
 * Clear audio URL cache (useful for testing or memory management)
 */
export const clearAudioCache = () => {
  audioUrlCache.clear();
};

export default app; 