import { NextResponse } from "next/server";

const BIGIN_TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";
const BIGIN_CONTACTS_URL = "https://www.zohoapis.com/bigin/v2/Contacts";

type LeadPayload = {
  fullName?: unknown;
  companyName?: unknown;
  email?: unknown;
  phone?: unknown;
  countryCode?: unknown;
  monthlyInvestment?: unknown;
  annualSavings?: unknown;
  consent?: unknown;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : NaN;
}

function splitName(fullName: string) {
  const parts = fullName.split(/\s+/).filter(Boolean);
  const lastName = parts.length > 1 ? parts.pop()! : parts[0];

  return { firstName: parts.join(" "), lastName };
}

function biginDateTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;

  return `${value("year")}-${value("month")}-${value("day")}T${value("hour")}:${value("minute")}:${value("second")}-05:00`;
}

async function getAccessToken() {
  const clientId = process.env.ZOHO_BIGIN_CLIENT_ID;
  const clientSecret = process.env.ZOHO_BIGIN_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_BIGIN_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Bigin is not configured");
  }

  const response = await fetch(BIGIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  const result = (await response.json()) as { access_token?: string };

  if (!response.ok || !result.access_token) {
    throw new Error("Unable to refresh Bigin access token");
  }

  return result.access_token;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;
    const fullName = text(body.fullName);
    const companyName = text(body.companyName);
    const email = text(body.email).toLowerCase();
    const phone = text(body.phone);
    const countryCode = text(body.countryCode);
    const monthlyInvestment = finiteNumber(body.monthlyInvestment);
    const annualSavings = finiteNumber(body.annualSavings);

    if (!fullName || !companyName || !email || !phone || !countryCode || body.consent !== true) {
      return NextResponse.json({ error: "Completa todos los campos y acepta el tratamiento de datos." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || monthlyInvestment < 0 || !Number.isFinite(annualSavings)) {
      return NextResponse.json({ error: "Los datos enviados no son válidos." }, { status: 400 });
    }

    if (!/^\+\d{1,4}$/.test(countryCode) || !/^\d{6,15}$/.test(phone)) {
      return NextResponse.json({ error: "Ingresa un número de teléfono válido." }, { status: 400 });
    }

    const { firstName, lastName } = splitName(fullName);
    const accessToken = await getAccessToken();
    const response = await fetch(BIGIN_CONTACTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [{
          First_Name: firstName,
          Last_Name: lastName,
          Email: email,
          Home_Phone: `${countryCode}${phone}`,

          // Campo personalizado, ya no usamos Account_Name
          Nombre_Empresa: companyName,

          Pauta_Mensual: monthlyInvestment,
          Ahorro_Anual: annualSavings,
          Fecha_Captura: biginDateTime(),
          Consentimientos_de_datos: true,
          Origen_Formularios: "Landing Page ROI Calculator",
        }],
        trigger: ["workflow"],
      }),
      cache: "no-store",
    });
    const result = (await response.json()) as {
      data?: Array<{
        code?: string;
        message?: string;
        details?: { id?: string; api_name?: string; expected_data_type?: string };
      }>;
    };
    const record = result.data?.[0];

    if (!response.ok || record?.code !== "SUCCESS") {
      const duplicate = record?.code === "DUPLICATE_DATA";
      console.error("Bigin lead creation failed", {
        status: response.status,
        code: record?.code,
        message: record?.message,
        details: record?.details,
      });
      return NextResponse.json(
        { error: duplicate ? "Ya existe un contacto con este correo." : "No pudimos registrar tus datos. Intenta nuevamente." },
        { status: duplicate ? 409 : 502 },
      );
    }

    return NextResponse.json({ message: "Lead guardado correctamente", id: record.details?.id }, { status: 201 });
  } catch (error) {
    console.error("Lead API error", error);
    return NextResponse.json({ error: "Error interno al registrar los datos." }, { status: 500 });
  }
}
