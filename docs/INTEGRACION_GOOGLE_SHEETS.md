# Integración de Leads con Google Sheets

Para que los datos de la calculadora se guarden automáticamente en un Google Sheets, sigue estos pasos:

## 1. Crear el Google Sheet
1. Crea un nuevo Google Sheet.
2. Agrega los encabezados en la primera fila: `Fecha`, `Nombre`, `Empresa`, `Email`, `Teléfono`, `Pauta Mensual`, `Ahorro Anual`.

## 2. Crear el Script de Google Apps
1. En tu Google Sheet, ve a **Extensiones > Apps Script**.
2. Borra todo lo que haya en el editor y pega el siguiente código:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.fullName,
    data.companyName,
    data.email,
    data.phone,
    data.monthlyInvestment,
    data.annualSavings
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Haz clic en **Implementar > Nueva implementación**.
4. Selecciona el tipo: **Aplicación web**.
5. Configura:
   - Descripción: "Lead Capture AND"
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquiera** (esto es necesario para que el API de Next.js pueda enviar datos).
6. Haz clic en **Implementar** y copia la **URL de la aplicación web**.

## 3. Configurar en tu Proyecto
1. Abre tu archivo `.env.local` (o créalo si no existe).
2. Agrega la URL que copiaste:
```env
GOOGLE_SHEETS_WEBHOOK_URL=TU_URL_AQUI
```

¡Listo! Cada vez que alguien complete el formulario en la calculadora, se agregará una nueva fila a tu Google Sheet.
