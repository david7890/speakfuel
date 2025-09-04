-- supabase/migrations/006_add_check_user_function.sql

create or replace function get_user_id_by_email(user_email text)
returns uuid as $$
  declare
    user_id uuid;
  begin
    select id from auth.users
    where email = user_email
    into user_id;
    return user_id;
  end;
$$ language plpgsql security definer;

-- Otorgar permisos solo al rol de servicio para llamar a esta función
grant execute on function public.get_user_id_by_email(text) to service_role; 