import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('dropdown_settings').select('*').order('category').order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('dropdown_settings').insert({
    category: body.category,
    label: body.label,
    value: body.value,
    sort_order: body.sort_order || 0,
    module: body.module || '',
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request) {
  const body = await request.json();
  if (body.bulk) {
    for (const item of body.items) {
      await supabaseAdmin.from('dropdown_settings').update({ label: item.label, value: item.value, sort_order: item.sort_order }).eq('id', item.id);
    }
    return NextResponse.json({ success: true });
  }
  const { id, ...updates } = body;
  const { data, error } = await supabaseAdmin.from('dropdown_settings').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const { error } = await supabaseAdmin.from('dropdown_settings').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
