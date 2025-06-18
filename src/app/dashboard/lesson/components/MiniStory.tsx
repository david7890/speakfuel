'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { PlayIcon, PauseIcon, BackwardIcon } from '@heroicons/react/24/solid';
import { useParams } from 'next/navigation';
import { getAudioUrl } from '@/lib/firebase';
import { getResponsiveCloudinaryUrl } from '@/lib/cloudinary';

interface MiniStoryProps {
  data: {
    title: string;
    story: string;
    audioUrl?: string;
    duration?: number;
    featuredImage?: string;
  };
  isTransitioning: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export default function MiniStory({ data, onNext, onPrevious }: MiniStoryProps) {
  const params = useParams();
  const lessonId = params?.id ? `lesson${params.id}` : 'lesson1';
  const lessonNumber = parseInt(params?.id as string) || 1;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(data.duration || 0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioLoading, setAudioLoading] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Use Cloudinary image or fallback to provided featuredImage or placeholder
  const featuredImage = useMemo(() => {
    if (data.featuredImage) {
      return data.featuredImage;
    }
    // Generate Cloudinary URL for this lesson's mini story
    return getResponsiveCloudinaryUrl(lessonNumber, 'ministory', 'desktop');
  }, [data.featuredImage, lessonNumber]);

  // Load audio URL from Firebase Storage
  useEffect(() => {
    const loadAudioUrl = async () => {
      setAudioLoading(true);
      setAudioError(null);

      try {
        if (data.audioUrl && data.audioUrl.startsWith('gs://')) {
          // Convert Firebase Storage URL to actual download URL
          const path = data.audioUrl.replace('gs://speakfuel-d832c.firebasestorage.app/', '');
          const url = await getAudioUrl(path);
          setAudioUrl(url);
        } else if (data.audioUrl) {
          // Use provided URL directly
          setAudioUrl(data.audioUrl);
        } else {
          // Fallback to Firebase Storage path
          const url = await getAudioUrl(`lessons/${lessonId}/ministory.mp3`);
          setAudioUrl(url);
        }
      } catch (error) {
        console.error('Error loading MiniStory audio URL:', error);
        setAudioError('Audio temporarily unavailable');
        setAudioUrl('');
      } finally {
        setAudioLoading(false);
      }
    };

    loadAudioUrl();
  }, [data.audioUrl, data.duration, lessonId]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const audio = audioRef.current;
      
      const handleTimeUpdateEvent = () => {
        if (audioRef.current) {
          const time = audioRef.current.currentTime;
          const audioDuration = audioRef.current.duration;
          
          setCurrentTime(time);
          
          // Actualizar duración si está disponible y es diferente
          if (audioDuration && audioDuration !== duration) {
            console.log('Updating MiniStory duration from audio element:', audioDuration);
            setDuration(audioDuration);
          }
        }
      };

      const handleLoadedMetadataEvent = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };

      const handlePlayEvent = () => {
        console.log('MiniStory audio play event triggered');
        setIsPlaying(true);
      };

      const handlePauseEvent = () => {
        console.log('MiniStory audio pause event triggered');
        setIsPlaying(false);
      };

      const handleEndedEvent = () => {
        console.log('MiniStory audio ended event triggered');
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleErrorEvent = (e: Event) => {
        console.error('MiniStory audio error event:', e);
        setAudioError('Audio playback error');
        setIsPlaying(false);
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdateEvent);
      audio.addEventListener('loadedmetadata', handleLoadedMetadataEvent);
      audio.addEventListener('play', handlePlayEvent);
      audio.addEventListener('pause', handlePauseEvent);
      audio.addEventListener('ended', handleEndedEvent);
      audio.addEventListener('error', handleErrorEvent);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdateEvent);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadataEvent);
        audio.removeEventListener('play', handlePlayEvent);
        audio.removeEventListener('pause', handlePauseEvent);
        audio.removeEventListener('ended', handleEndedEvent);
        audio.removeEventListener('error', handleErrorEvent);
      };
    }
  }, [audioUrl, duration]);

  const togglePlayPause = async () => {
    console.log('MiniStory togglePlayPause called, current state:', { 
      isPlaying, 
      audioLoading, 
      audioUrl: !!audioUrl,
      audioRefCurrent: !!audioRef.current 
    });

    if (audioLoading) {
      console.log('MiniStory audio is still loading...');
      return;
    }

    if (!audioUrl) {
      console.log('No MiniStory audio available');
      return;
    }

    if (!audioRef.current) {
      console.log('MiniStory audio ref not available');
      return;
    }

    try {
      const audio = audioRef.current;
      
      if (isPlaying) {
        console.log('Attempting to pause MiniStory audio');
        audio.pause();
      } else {
        console.log('Attempting to play MiniStory audio');
        await audio.play();
      }
    } catch (error) {
      console.error('Error in MiniStory togglePlayPause:', error);
      setIsPlaying(false);
      setAudioError('Failed to play audio');
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('MiniStory progress bar clicked');
    
    if (!audioRef.current) {
      console.log('MiniStory audio ref not available for progress click');
      return;
    }

    if (!audioUrl) {
      console.log('No MiniStory audio URL available for progress click');
      return;
    }

    try {
      const audio = audioRef.current;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickPercentage = clickX / width;
      const audioDuration = audio.duration || duration;
      const newTime = clickPercentage * audioDuration;
      
      console.log('MiniStory progress click details:', {
        clickX,
        width,
        clickPercentage,
        audioDuration,
        newTime,
        currentTime: audio.currentTime
      });
      
      if (isFinite(newTime) && newTime >= 0 && newTime <= audioDuration) {
        audio.currentTime = newTime;
        setCurrentTime(newTime);
        console.log('Successfully set MiniStory audio time to:', newTime);
      } else {
        console.warn('Invalid MiniStory time calculated:', newTime);
      }
    } catch (error) {
      console.error('Error in MiniStory handleProgressClick:', error);
    }
  };

  const handleRewind = () => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="font-nunito" style={{paddingBottom: '120px'}}>
      {/* Layout Móvil - Tarjeta horizontal compacta */}
      <div className="lg:hidden mb-4 mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex p-4 gap-4">
            {/* Imagen cuadrada - 50% del ancho */}
            <div className="w-1/2 aspect-square bg-gradient-to-br from-green-100 to-teal-100 overflow-hidden rounded-xl flex-shrink-0">
              <img 
                src={featuredImage} 
                alt={data.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#14B8A6;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <rect width="400" height="400" fill="url(#grad)"/>
                      <text x="200" y="200" text-anchor="middle" fill="white" font-size="20" font-family="system-ui">
                        📚 ${data.title}
                      </text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
            
            {/* Contenido derecho - 50% del ancho */}
            <div className="w-1/2 flex flex-col justify-center">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Mini Story</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                  {data.title}
                </h3>
              </div>
              
              {/* Reproductor compacto centrado */}
              <div>
                {/* Botones de control */}
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <button
                    onClick={handleRewind}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm hover:scale-105"
                  >
                    <BackwardIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    disabled={audioLoading || !audioUrl}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 ${
                      audioLoading || !audioUrl
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isPlaying 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-white text-green-600 hover:bg-gray-50 border border-green-200'
                    }`}
                  >
                    {audioLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : !audioUrl ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    ) : isPlaying ? (
                      <PauseIcon className="w-6 h-6" />
                    ) : (
                      <PlayIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>
                
                {/* Barra de progreso */}
                <div>
                  <div 
                    className="w-full h-1.5 bg-gray-200 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-1.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    >
                    </div>
                  </div>
                  {/* Tiempo de debug */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Desktop */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 sm:px-8 pt-8 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Columna izquierda: Imagen y Reproductor */}
              <div className="space-y-6">
                {/* Imagen destacada */}
                <div className="relative h-64 sm:h-72 lg:h-64 bg-gradient-to-br from-green-100 to-teal-100 overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  <img 
                    src={featuredImage} 
                    alt={data.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                              <stop offset="100%" style="stop-color:#14B8A6;stop-opacity:1" />
                            </linearGradient>
                          </defs>
                          <rect width="800" height="400" fill="url(#grad)"/>
                          <text x="400" y="200" text-anchor="middle" fill="white" font-size="24" font-family="system-ui">
                            📚 ${data.title}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-gray-800">Mini Story</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reproductor de audio */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
                  {/* Botones de control */}
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <button
                      onClick={handleRewind}
                      className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 shadow-lg"
                    >
                      <BackwardIcon className="w-8 h-8" />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      disabled={audioLoading || !audioUrl}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
                        audioLoading || !audioUrl
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isPlaying 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-white text-green-600 hover:bg-gray-50 border-2 border-green-200'
                      }`}
                    >
                      {audioLoading ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : !audioUrl ? (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      ) : isPlaying ? (
                        <PauseIcon className="w-10 h-10" />
                      ) : (
                        <PlayIcon className="w-10 h-10" />
                      )}
                    </button>
                  </div>

                  {/* Barra de progreso */}
                  <div>
                    <div 
                      className="w-full h-3 bg-white rounded-full cursor-pointer shadow-inner"
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      >
                      </div>
                    </div>
                    {/* Tiempo de debug */}
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha: Historia */}
              <div className="lg:h-[600px] flex flex-col">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Story
                  </h3>

                  <div className="flex-1 overflow-y-auto">
                    <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
                      <div className="prose prose-lg max-w-none">
                        {data.story.split('\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="text-gray-800 leading-relaxed mb-4 font-medium text-lg">
                              {paragraph.trim()}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
              onLoadStart={() => console.log('MiniStory audio loading started')}
              onCanPlay={() => console.log('MiniStory audio can play')}
              onError={(e) => {
                console.error('Error loading MiniStory audio:', e);
                setAudioError('Failed to load audio file');
                setAudioLoading(false);
              }}
              onLoadedData={() => {
                console.log('MiniStory audio loaded successfully');
                setAudioLoading(false);
                setAudioError(null);
              }}
            />
          )}
        </div>
      </div>

      {/* Contenido móvil - Historia debajo de la tarjeta */}
      <div className="lg:hidden mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Story
          </h3>
          
          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
            <div className="prose prose-lg max-w-none">
              {data.story.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-gray-800 leading-relaxed mb-4 font-medium text-lg">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 