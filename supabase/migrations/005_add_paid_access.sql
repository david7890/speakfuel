-- =============================================
-- ADD PAID ACCESS TO USER PROFILES
-- =============================================

-- Agregar campo para acceso pagado
ALTER TABLE public.user_profiles 
ADD COLUMN has_paid_access BOOLEAN DEFAULT false,
ADD COLUMN purchase_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN purchase_email VARCHAR(255);

-- =============================================
-- FUNCTION TO CHECK PAID ACCESS
-- =============================================
CREATE OR REPLACE FUNCTION check_user_paid_access(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    result JSONB;
BEGIN
    -- Buscar usuario por email en auth.users y verificar acceso pagado
    SELECT au.id, au.email, up.has_paid_access, up.purchase_date, up.name
    INTO user_record
    FROM auth.users au
    LEFT JOIN public.user_profiles up ON au.id = up.id
    WHERE au.email = user_email;
    
    -- Si no existe el usuario
    IF user_record.id IS NULL THEN
        SELECT jsonb_build_object(
            'has_access', false,
            'error', 'user_not_found',
            'message', 'No encontramos una cuenta con este correo.'
        ) INTO result;
    -- Si existe pero no tiene acceso pagado
    ELSIF user_record.has_paid_access IS NOT TRUE THEN
        SELECT jsonb_build_object(
            'has_access', false,
            'error', 'no_paid_access',
            'message', 'Esta cuenta no tiene acceso pagado al curso.'
        ) INTO result;
    -- Si tiene acceso pagado
    ELSE
        SELECT jsonb_build_object(
            'has_access', true,
            'user_id', user_record.id,
            'name', user_record.name,
            'purchase_date', user_record.purchase_date
        ) INTO result;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION TO GRANT PAID ACCESS (for admin use)
-- =============================================
CREATE OR REPLACE FUNCTION grant_paid_access(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
    user_id UUID;
    result JSONB;
BEGIN
    -- Buscar el user_id por email
    SELECT id INTO user_id
    FROM auth.users 
    WHERE email = user_email;
    
    -- Si no existe el usuario
    IF user_id IS NULL THEN
        SELECT jsonb_build_object(
            'success', false,
            'error', 'user_not_found',
            'message', 'Usuario no encontrado'
        ) INTO result;
    ELSE
        -- Actualizar acceso pagado
        UPDATE public.user_profiles 
        SET has_paid_access = true,
            purchase_date = NOW(),
            purchase_email = user_email,
            updated_at = NOW()
        WHERE id = user_id;
        
        SELECT jsonb_build_object(
            'success', true,
            'message', 'Acceso pagado otorgado exitosamente'
        ) INTO result;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- INDEX FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_user_profiles_has_paid_access ON public.user_profiles(has_paid_access);
CREATE INDEX idx_user_profiles_purchase_email ON public.user_profiles(purchase_email); 