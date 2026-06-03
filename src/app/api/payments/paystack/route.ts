import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🛡️ Rate Limiting Telemetry State Maps (In-Memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_WINDOW = 5; // Maximum allowable requests...
const WINDOW_DURATION_MS = 60000;  // ...per 60 seconds (1 minute)

// Initialize your secure Supabase client using server-side keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting System Verification Block
    // Extract unique incoming user IP via standard infrastructure headers
    const ip = req.headers.get('x-forwarded-for') || 'anonymous_global_user';
    const currentTime = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, resetTime: currentTime + WINDOW_DURATION_MS });
    } else {
      const rateData = rateLimitMap.get(ip)!;

      // If the 1-minute tracking window has expired, reset their limit metrics tokens
      if (currentTime > rateData.resetTime) {
        rateData.count = 1;
        rateData.resetTime = currentTime + WINDOW_DURATION_MS;
      } else {
        rateData.count += 1;
      }

      // If they exceed 5 initialization requests within 60 seconds, stop execution early
      if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: 'Too many registration attempts. Please wait 1 minute before retrying.' },
          { status: 429 } // HTTP 429: Too Many Requests
        );
      }
    }

    const { courseId, fullName, email, phone } = await req.json();

    // 2. Basic Parameter Verification Validation
    if (!courseId || !fullName || !email) {
      return NextResponse.json({ error: 'Missing registration details.' }, { status: 400 });
    }

    // Determine the correct pricing structure based on your track requirements
    let amount = 50000; // Default tier rate
    if (courseId === 'track_fullstack_01') {
      amount = 100000; // Fixed structural compile bug from image_8e36fd.png cleanly
    }

    // 3. Safely log or update the active tracking instance row (Prevents duplicates and race conditions)
    const { data: enrollment, error: dbError } = await supabase
      .from('enrollments')
      .upsert(
        {
          full_name: fullName,
          email: email,
          phone: phone,
          course_id: courseId,
          amount: amount,
          status: 'pending'
        },
        { onConflict: 'email,course_id' } // Target our unique composite database constraint
      )
      .select()
      .single();

    // Catch database failures cleanly if the transaction tracking layer fails to log
    if (dbError || !enrollment) {
      console.error('Database Upsert Matrix Rejection:', dbError);
      return NextResponse.json({ error: 'Database record indexing failure.' }, { status: 500 });
    }

    // 4. Dispatch Initialization Payloads to Paystack Gateway
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        amount: amount * 100, // Paystack counts everything in lowest currency units (kobo)
        callback_url: `${req.headers.get('origin')}/enrollment/success`, // Drops admin directly back to ledger
        metadata: {
          enrollmentId: enrollment.id,
          courseId: courseId
        }
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack API Initialization Rejection:', paystackData);
      return NextResponse.json({ error: paystackData.message || 'Gateway initialization rejected.' }, { status: 500 });
    }

    // Pass the active sandbox link safely back up to the overlay frame client
    return NextResponse.json({ authorization_url: paystackData.data.authorization_url });

  } catch (error: any) {
    console.error('Master Server Route Failure Log:', error);
    return NextResponse.json({ error: 'Internal server architecture crash.' }, { status: 500 });
  }
}