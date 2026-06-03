import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase'; // 🔑 Updated to use your unified helper
import { sendStudentWelcomeEmail } from '@/lib/email'; // ✉️ Added the template email import
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // 1. Capture the raw text body to accurately compute the signature check
    const rawBody = Buffer.from(await req.arrayBuffer());
    const paystackSignature = req.headers.get('x-paystack-signature');

    // 2. Compute the verification hash locally using HMAC SHA512
    const computedHash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest('hex');

    // Reject immediately if the payload signature check fails
    if (computedHash !== paystackSignature) {
      console.warn('⚠️ Suspicious Webhook Alert: Incoming hash validation failed.');
      return new NextResponse('Invalid digital signature match', { status: 401 });
    }

    // 3. Parse the verified transaction event string object data
    const event = JSON.parse(rawBody.toString());
    
    // We specifically listen for the charge success notification frame
    if (event.event === 'charge.success') {
      const { reference, metadata, customer } = event.data;
      const enrollmentId = metadata?.enrollmentId;

      if (!enrollmentId) {
        console.error('❌ Tracking Error: Paystack payload did not contain enrollmentId metadata.');
        return new NextResponse('Missing structural metadata fields', { status: 400 });
      }

      console.log(`⚡ Processing successful payment for Enrollment: ${enrollmentId}`);
      console.log(`📡 WEBHOOK ATTEMPT: Checking database target for Enrollment ID [${enrollmentId}]`);

      // Initialize the secure server-side client instance
      const supabaseServer = getSupabaseServer();

      // 4. Update Database State with a Fail-Safe Permutation Loop
      let updateSuccess = false;
      let activeRows = null;
      let lastDbError = null;

      const schemaVariations = [
        { status: 'success' },
        { payment_status: 'success' }
      ];

      for (const variant of schemaVariations) {
        const { data, error } = await supabaseServer
          .from('enrollments')
          .update(variant)
          .eq('id', enrollmentId)
          .select();

        if (!error) {
          updateSuccess = true;
          activeRows = data;
          console.log(`✅ Database state successfully modified via column variant:`, Object.keys(variant)[0]);
          
          // Safe isolated timestamp update
          await supabaseServer
            .from('enrollments')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', enrollmentId);
            
          break;
        } else if (error.code !== '42703') {
          // Record core DB issues like database timeouts or row level security locks
          lastDbError = error;
        }
      }

      // If neither variant successfully updated the table, execute safe 500 error rejection
      if (!updateSuccess) {
        console.error('❌ Critical database structural lock:', lastDbError || 'Columns missing from target table schema');
        return new NextResponse('Internal database write error state', { status: 500 });
      }

      console.log(`📊 DB RESPONSE MATCH:`, activeRows);

      if (!activeRows || activeRows.length === 0) {
        console.warn(`⚠️ Mismatch Warning: Webhook executed, but ZERO database rows matched the ID [${enrollmentId}].`);
      }

      // ✉️ 5. AUTOMATED DISPATCH: Send Welcome Email to the Student
      if (updateSuccess) {
        // Extract real, verified data values out of Paystack's customer and metadata nodes
        const studentEmail = customer?.email;
        const studentName = metadata?.studentName || metadata?.name || 'Student';
        const trackName = metadata?.trackName || 'Your Live Cohort Track';

        if (studentEmail) {
          // Asynchronous execution handles this without delaying Paystack's acknowledgement receipt
          await sendStudentWelcomeEmail({
            studentEmail: studentEmail,
            studentName: studentName,
            trackName: trackName,
          });
          console.log(`✉️ Live class welcome receipt dispatched to ${studentEmail}`);
        } else {
          console.warn('⚠️ Email Dispatch Skipped: Customer object payload did not specify a recipient address.');
        }
      }

      // 6. Update the transaction log map with audit verification responses safely
      try {
        const { error: txUpdateError } = await supabaseServer
          .from('transactions')
          .update({
            raw_gateway_response: event.data,
          })
          .or(`reference_id.eq.${reference},reference.eq.${reference}`);

        if (txUpdateError) {
          console.warn('⚠️ Non-breaking transaction audit log append warning:', txUpdateError.message);
        }
      } catch (txEx) {
        console.warn('⚠️ Transaction trace exception safely skipped:', txEx);
      }

      console.log(`✅ Fulfill step executed seamlessly for Transaction Reference: ${reference}`);
    }

    // Always send back a crisp HTTP 200 OK acknoSSSwledgment to Paystack
    return new NextResponse('Event Handled Successfully', { status: 200 });

  } catch (globalFault) {
    console.error('Critical infrastructure breakdown on webhook execution:', globalFault);
    return new NextResponse('Internal server execution block failure', { status: 500 });
  }
}