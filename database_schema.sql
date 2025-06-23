-- =============================================
-- SPEAKFUEL DATABASE SCHEMA
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Enable Row Level Security
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE lesson_status AS ENUM ('locked', 'available', 'in_progress', 'completed');

-- =============================================
-- USERS TABLE (extends auth.users)
-- =============================================
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  
  -- Sistema de rachas
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USER LESSON PROGRESS
-- =============================================
CREATE TABLE public.user_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id INTEGER NOT NULL,
  
  -- Estado de la lección
  status lesson_status NOT NULL DEFAULT 'locked',
  
  -- Sistema de repeticiones/estrellas
  repetitions_completed INTEGER DEFAULT 0,
  questions_completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  first_completed_at TIMESTAMP WITH TIME ZONE,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, lesson_id)
);

-- =============================================
-- USER DAILY ACTIVITY (Para rachas)
-- =============================================
CREATE TABLE public.user_daily_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  
  -- Actividades del día
  lessons_completed INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  has_activity BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, activity_date)
);

-- =============================================
-- FUNCTIONS FOR STREAK MANAGEMENT
-- =============================================
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    current_date_local DATE := CURRENT_DATE;
    last_activity DATE;
    current_streak_val INTEGER := 0;
    longest_streak_val INTEGER := 0;
BEGIN
    -- Obtener última actividad y racha actual
    SELECT last_activity_date, current_streak, longest_streak 
    INTO last_activity, current_streak_val, longest_streak_val
    FROM public.user_profiles WHERE id = user_uuid;
    
    -- Si es su primera actividad
    IF last_activity IS NULL THEN
        current_streak_val := 1;
    -- Si fue ayer, continúa la racha
    ELSIF last_activity = current_date_local - INTERVAL '1 day' THEN
        current_streak_val := current_streak_val + 1;
    -- Si fue hoy, no hacer nada
    ELSIF last_activity = current_date_local THEN
        RETURN current_streak_val;
    -- Si fue hace más de 1 día, resetear racha
    ELSE
        current_streak_val := 1;
    END IF;
    
    -- Actualizar longest_streak si es necesario
    IF current_streak_val > longest_streak_val THEN
        longest_streak_val := current_streak_val;
    END IF;
    
    -- Actualizar usuario
    UPDATE public.user_profiles 
    SET current_streak = current_streak_val,
        longest_streak = longest_streak_val,
        last_activity_date = current_date_local,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    RETURN current_streak_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION TO COMPLETE A LESSON
-- =============================================
CREATE OR REPLACE FUNCTION complete_lesson_section(
    user_uuid UUID,
    lesson_number INTEGER,
    section_name TEXT
)
RETURNS JSONB AS $$
DECLARE
    current_date_local DATE := CURRENT_DATE;
    new_streak INTEGER;
    result JSONB;
BEGIN
    -- Solo procesar si es la sección de questions
    IF section_name = 'questions' THEN
        -- Actualizar o insertar progreso de lección
        INSERT INTO public.user_lesson_progress (user_id, lesson_id, status, repetitions_completed, questions_completed, last_completed_at)
        VALUES (user_uuid, lesson_number, 'completed', 1, true, NOW())
        ON CONFLICT (user_id, lesson_id) 
        DO UPDATE SET 
            repetitions_completed = user_lesson_progress.repetitions_completed + 1,
            questions_completed = true,
            status = 'completed',
            last_completed_at = NOW(),
            updated_at = NOW();
        
        -- Registrar actividad diaria
        INSERT INTO public.user_daily_activity (user_id, activity_date, lessons_completed, has_activity)
        VALUES (user_uuid, current_date_local, 1, true)
        ON CONFLICT (user_id, activity_date)
        DO UPDATE SET 
            lessons_completed = user_daily_activity.lessons_completed + 1,
            has_activity = true;
        
        -- Actualizar racha
        SELECT update_user_streak(user_uuid) INTO new_streak;
        
        -- Retornar resultado
        SELECT jsonb_build_object(
            'success', true,
            'new_streak', new_streak,
            'message', 'Lesson completed successfully'
        ) INTO result;
    ELSE
        -- Solo actualizar estado para otras secciones
        INSERT INTO public.user_lesson_progress (user_id, lesson_id, status)
        VALUES (user_uuid, lesson_number, 'in_progress')
        ON CONFLICT (user_id, lesson_id) 
        DO UPDATE SET 
            status = CASE 
                WHEN user_lesson_progress.status = 'locked' THEN 'in_progress'::lesson_status
                ELSE user_lesson_progress.status 
            END,
            updated_at = NOW();
            
        SELECT jsonb_build_object(
            'success', true,
            'message', 'Progress updated'
        ) INTO result;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================
-- Crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  
  -- Desbloquear primera lección automáticamente
  INSERT INTO public.user_lesson_progress (user_id, lesson_id, status)
  VALUES (NEW.id, 1, 'available');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON public.user_lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own progress
CREATE POLICY "Users can view own progress" ON public.user_lesson_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_lesson_progress
    FOR ALL USING (auth.uid() = user_id);

-- Users can only see their own activity
CREATE POLICY "Users can view own activity" ON public.user_daily_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_daily_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_user_lesson_progress_user_id ON public.user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON public.user_lesson_progress(lesson_id);
CREATE INDEX idx_user_lesson_progress_status ON public.user_lesson_progress(status);
CREATE INDEX idx_user_daily_activity_user_date ON public.user_daily_activity(user_id, activity_date);
CREATE INDEX idx_user_profiles_last_activity ON public.user_profiles(last_activity_date); 