import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, companyName, email, phone, monthlyInvestment, annualSavings, timestamp } = body;

    // TODO: Configura tu URL de Google Apps Script o Webhook aquí
    // Ejemplo de implementación con Google Apps Script:
    // https://script.google.com/macros/s/TU_SCRIPT_ID/exec
    const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          companyName,
          email,
          phone,
          monthlyInvestment,
          annualSavings,
          timestamp,
          source: 'Landing Page ROI Calculator'
        }),
      });
    }

    // Por ahora simulamos éxito y logeamos en consola de servidor
    console.log('Nuevo Lead Recibido:', body);

    return NextResponse.json({ message: 'Lead guardado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error in leads API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
