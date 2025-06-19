/**
 * Helper functions for Cloudinary image management
 */

// Replace with your actual Cloudinary cloud name
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dhfzcrgtb';

/**
 * Get Cloudinary image URL for a lesson section
 * @param lessonId - The lesson number (e.g., 1, 2, 3)
 * @param section - The section type ('main', 'ministory', 'questions')
 * @returns Cloudinary URL for the image
 */
export function getCloudinaryImageUrl(lessonId: number, section: 'main' | 'ministory' | 'questions'): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/lesson${lessonId}_${section}.png`;
}

/**
 * Get optimized Cloudinary image URL with transformations
 * @param lessonId - The lesson number
 * @param section - The section type
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export function getOptimizedCloudinaryUrl(
  lessonId: number, 
  section: 'main' | 'ministory' | 'questions',
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  const { width = 800, height = 800, quality = 80, format = 'auto' } = options;
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,q_${quality},f_${format}/v1/lesson${lessonId}_${section}.png`;
}

/**
 * Get responsive Cloudinary image URL with automatic format and quality
 * @param lessonNumber - The lesson number
 * @param section - The section type
 * @param viewType - The view type ('mobile' or 'desktop')
 * @returns Responsive Cloudinary URL
 */
export function getResponsiveCloudinaryUrl(
  lessonNumber: number, 
  section: 'main' | 'ministory' | 'questions',
  viewType: 'mobile' | 'desktop' = 'desktop'
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dhfzcrgtb';
  const baseFilename = `lesson${lessonNumber}_${section}`;
  
  // Different dimensions for mobile vs desktop
  const dimensions = viewType === 'mobile' 
    ? 'w_600,h_600,c_fill' // Square for mobile
    : 'w_800,h_320,c_fill'; // Rectangle for desktop (matching h-80 = 320px)
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${dimensions},f_auto,q_auto/${baseFilename}.png`;
} 