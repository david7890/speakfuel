import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    node_env: process.env.NODE_ENV,
    site_url: process.env.NEXT_PUBLIC_SITE_URL,
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    auth: {
      supabase_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    database: {
      user_profiles_table: 'Connected',
      user_lesson_progress_table: 'Connected'
    },
    firebase: {
      configured: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      storage_bucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    }
  });
} 