import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://automation-biya.useteam.io/webhook/cac3dda7-d5e3-42c8-8380-c0e071514eac');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Error al obtener recomendaciones de IA.' }, { status: 500 });
  }
} 