import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { email, courseId, status } = await req.json();

    if (!email || !courseId) {
      return NextResponse.json({ error: 'Missing lookup details.' }, { status: 400 });
    }

    // Update the pending student row to 'success' match parameters
    const { data, error } = await supabase
      .from('enrollments')
      .update({ status: status })
      .eq('email', email)
      .eq('course_id', courseId)
      .eq('status', 'pending') // Only flip the row if it was waiting for validation
      .select();

    if (error) {
      console.error('Supabase status update error:', error);
      return NextResponse.json({ error: 'Failed to update ledger records.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (error) {
    console.error('Master update route crashed:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}