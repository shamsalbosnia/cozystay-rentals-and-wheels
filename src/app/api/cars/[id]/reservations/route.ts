import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('car_reservations')
    .select('start_date, end_date, status')
    .eq('car_id', parseInt(id))
    .in('status', ['confirmed', 'pending']);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const carId = parseInt(id);
  const body = await req.json();

  const { customer_name, customer_email, customer_phone, start_date, end_date } = body;

  console.log('[CAR RESERVATION] body received:', { customer_name, customer_email, customer_phone, start_date, end_date });

  const missing = [];
  if (!customer_name) missing.push('customer_name');
  if (!customer_email) missing.push('customer_email');
  if (!start_date) missing.push('start_date');
  if (!end_date) missing.push('end_date');

  if (missing.length > 0) {
    console.log('[CAR RESERVATION] missing fields:', missing);
    return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
  }

  if (new Date(end_date) <= new Date(start_date)) {
    return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const { data: overlap } = await supabase
    .from('car_reservations')
    .select('id')
    .eq('car_id', carId)
    .eq('status', 'confirmed')
    .lt('start_date', end_date)
    .gt('end_date', start_date)
    .limit(1);

  if (overlap && overlap.length > 0) {
    return NextResponse.json({ error: 'Car is already booked for these dates' }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('car_reservations')
    .insert({
      car_id: carId,
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      start_date,
      end_date,
      status: 'pending',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
