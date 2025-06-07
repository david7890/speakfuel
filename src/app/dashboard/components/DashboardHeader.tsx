interface User {
  name: string;
  completedLessons: number;
  totalLessons: number;
  currentLesson: number;
}

interface DashboardHeaderProps {
  user: User;
  onContinueClick: () => void;
}

export default function DashboardHeader({ user, onContinueClick }: DashboardHeaderProps) {
  const progressPercentage = (user.completedLessons / user.totalLessons) * 100;
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const getMotivationalMessage = () => {
    if (user.completedLessons === 0) {
      return "¡Es hora de comenzar tu aventura!";
    } else if (user.completedLessons < user.totalLessons / 2) {
      return "¡Vas por buen camino!";
    } else if (user.completedLessons < user.totalLessons) {
      return "¡Ya casi lo logras!";
    } else {
      return "¡Felicitaciones, has completado todo!";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user.name} 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {getMotivationalMessage()}
          </p>
        </div>
        
        {/* Continue Button */}
        <div className="flex-shrink-0">
          <button
            onClick={onContinueClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {user.completedLessons < user.totalLessons ? 'Continuar Lección' : 'Revisar Lecciones'}
          </button>
        </div>
      </div>

      {/* Progress Section - Simplified */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Tu Progreso
          </h3>
          <p className="text-gray-600">
            {user.completedLessons} de {user.totalLessons} lecciones completadas
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Achievement Badges */}
        {user.completedLessons > 0 && (
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-yellow-500 mr-1">🎖️</span>
              {user.completedLessons >= 3 && "Estudiante Dedicado"}
              {user.completedLessons >= 7 && user.completedLessons < 10 && "Casi Experto"}
              {user.completedLessons === 10 && "Maestro del Inglés"}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-1">🔥</span>
              Racha activa
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 