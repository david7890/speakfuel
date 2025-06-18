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
  const { width = 800, height = 400, quality = 80, format = 'auto' } = options;
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,q_${quality},f_${format}/v1/lesson${lessonId}_${section}.png`;
}

/**
 * Get responsive Cloudinary image URL with automatic format and quality
 * @param lessonId - The lesson number
 * @param section - The section type
 * @param size - Preset size ('mobile', 'tablet', 'desktop')
 * @returns Responsive Cloudinary URL
 */
export function getResponsiveCloudinaryUrl(
  lessonId: number, 
  section: 'main' | 'ministory' | 'questions',
  size: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): string {
  const sizeMap = {
    mobile: { width: 400, height: 400 },
    tablet: { width: 600, height: 400 },
    desktop: { width: 800, height: 400 }
  };
  
  const { width, height } = sizeMap[size];
  
  return getOptimizedCloudinaryUrl(lessonId, section, {
    width,
    height,
    quality: 85,
    format: 'auto'
  });
} 