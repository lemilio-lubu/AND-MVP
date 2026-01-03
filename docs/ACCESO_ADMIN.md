# Acceso Admin - Guía de Uso

**Fecha:** 2 de enero, 2026  
**Versión:** 1.0

---

## 🔑 Credenciales de Admin

Para acceder al panel de administrador de AND:

### Login Admin
- **URL:** [http://localhost:3000/login](http://localhost:3000/login)
- **Tipo de acceso:** Seleccionar "Admin AND" 🔑
- **Email:** `admin@and.com`
- **Contraseña:** `admin123`
- **Redirección:** `/admin`

---

## 👥 Tipos de Usuario

### 1. **Empresa (Cliente)**
- **Acceso:** [/login](http://localhost:3000/login) → Seleccionar "Empresa" 🏢
- **Dashboard:** `/dashboard`
- **Funciones:**
  - Solicitar facturación local
  - Ver solicitudes activas
  - Aprobar montos calculados
  - Ver historial de facturas

### 2. **Admin AND (Operador)**
- **Acceso:** [/login](http://localhost:3000/login) → Seleccionar "Admin AND" 🔑
- **Dashboard:** `/admin`
- **Funciones:**
  - Calcular valores (Excel simulado)
  - Emitir facturas reales
  - Registrar pagos
  - Ejecutar recargas
  - Completar procesos

### 3. **Influencer**
- **Acceso:** Solo registro de datos
- **Dashboard:** No implementado (futuro)

---

## 🔄 Flujo Completo con Admin

### Paso 1: Cliente Solicita
1. Login como empresa
2. Dashboard → "Solicitar Facturación Local"
3. Seleccionar plataforma (Meta, TikTok, Google, LinkedIn)
4. Ingresar monto de pauta
5. Enviar solicitud
6. **Estado:** `REQUEST_CREATED`

### Paso 2: Admin Calcula
1. Login como admin (`admin@and.com` / `admin123`)
2. Ver solicitudes con estado "REQUEST_CREATED"
3. Click en "Calcular"
4. Modal muestra valores sugeridos:
   - Base: Monto solicitado
   - Comisión: 5.5% del monto
   - Total: Base + Comisión
5. Ajustar valores si es necesario
6. Guardar cálculo
7. **Estado:** `CALCULATED`

### Paso 3: Cliente Aprueba (Mock)
- En producción, el cliente vería el desglose y aprobaría
- Para testing, puedes simular con datos mock
- **Estado:** `APPROVED_BY_CLIENT`

### Paso 4: Admin Emite Factura
1. Ver solicitud con estado "APPROVED_BY_CLIENT"
2. Click en "Emitir Factura"
3. Sistema genera número de factura: `AND-{timestamp}`
4. Alerta confirma emisión
5. **Estado:** `INVOICED`

### Paso 5: Admin Registra Pago
1. Ver solicitud con estado "INVOICED"
2. Click en "Registrar Pago"
3. Confirmar que el cliente pagó
4. **Estado:** `PAID`

### Paso 6: Admin Ejecuta Recarga
1. Ver solicitud con estado "PAID"
2. Click en "Ejecutar Recarga"
3. Simula coordinación con MISIVA
4. **Estado:** `RECHARGE_EXECUTED`

### Paso 7: Admin Completa Proceso
1. Ver solicitud con estado "RECHARGE_EXECUTED"
2. Click en "Completar"
3. Proceso archivado
4. Métricas actualizadas
5. **Estado:** `COMPLETED`

---

## 📊 Métricas del Admin Dashboard

### Panel de Control
- **Pendientes de Calcular:** Solicitudes nuevas (REQUEST_CREATED)
- **Pendientes de Aprobación:** Solicitudes calculadas esperando cliente (CALCULATED)
- **Pendientes de Emitir:** Solicitudes aprobadas por cliente (APPROVED_BY_CLIENT)
- **Pendientes de Pago:** Facturas emitidas sin pago (INVOICED)
- **Pendientes de Recarga:** Pagos confirmados sin recarga (PAID)
- **Completadas (Mes):** Procesos finalizados (COMPLETED)
- **Ingresos Totales:** Suma de todas las comisiones cobradas

---

## 🎨 Estados Visuales

| Estado | Color | Acción Disponible |
|--------|-------|-------------------|
| `REQUEST_CREATED` | Azul | Calcular |
| `CALCULATED` | Amarillo | (Espera cliente) |
| `APPROVED_BY_CLIENT` | Verde | Emitir Factura |
| `INVOICED` | Púrpura | Registrar Pago |
| `PAID` | Naranja | Ejecutar Recarga |
| `RECHARGE_EXECUTED` | Teal | Completar |
| `COMPLETED` | Verde ✓ | (Archivado) |
| `ERROR` | Rojo | (Revisar) |

---

## 🛡️ Seguridad y Roles

### Protección de Rutas
- **Empresa:** Solo puede acceder a `/dashboard`
- **Admin:** Solo puede acceder a `/admin`
- **Redirección automática:** Si un admin intenta entrar a `/dashboard`, es redirigido a `/admin`

### Persistencia de Sesión
- Usuario se guarda en `localStorage` con key `and_user`
- Incluye tipo de usuario (`type: "empresa" | "admin" | "influencer"`)
- Persiste entre recargas de página

### Limpiar Sesión
```javascript
// En consola del navegador (F12):
localStorage.removeItem('and_user');
location.reload();
```

---

## 🧪 Testing Manual

### Test 1: Login Admin
1. Ir a [/login](http://localhost:3000/login)
2. Seleccionar "Admin AND" 🔑
3. Ingresar: `admin@and.com` / `admin123`
4. Click "Acceder como Admin"
5. ✓ Debe redirigir a `/admin`
6. ✓ Debe mostrar 8 solicitudes mock en diferentes estados

### Test 2: Calcular Solicitud
1. Login como admin
2. Buscar solicitud con estado "REQUEST_CREATED"
3. Click "Calcular"
4. ✓ Modal se abre con valores pre-cargados
5. ✓ Base: Monto solicitado
6. ✓ Comisión: 5.5% del monto
7. ✓ Total: Base + Comisión
8. Click "Guardar Cálculo"
9. ✓ Modal se cierra
10. ✓ Estado cambia a "CALCULATED"
11. ✓ Métrica "Pendientes de Calcular" decrementa
12. ✓ Métrica "Pendientes de Aprobación" incrementa

### Test 3: Emitir Factura
1. Solicitud debe estar en "APPROVED_BY_CLIENT"
2. Click "Emitir Factura"
3. ✓ Número de factura generado (`AND-{timestamp}`)
4. ✓ Alerta confirma emisión
5. ✓ Estado cambia a "INVOICED"

### Test 4: Flujo Completo
1. Solicitud en "REQUEST_CREATED" → Calcular
2. Simular aprobación del cliente (datos mock)
3. Solicitud en "APPROVED_BY_CLIENT" → Emitir Factura
4. Solicitud en "INVOICED" → Registrar Pago
5. Solicitud en "PAID" → Ejecutar Recarga
6. Solicitud en "RECHARGE_EXECUTED" → Completar
7. ✓ Solicitud desaparece de lista activa
8. ✓ Métrica "Completadas (Mes)" incrementa
9. ✓ "Ingresos Totales" incrementa con la comisión

### Test 5: Validaciones
1. Intentar "Emitir Factura" en solicitud "CALCULATED"
2. ✓ Debe mostrar alerta: "La solicitud debe estar aprobada..."
3. Intentar "Registrar Pago" en solicitud "CALCULATED"
4. ✓ Debe mostrar alerta: "Solo se puede registrar pago..."

---

## 🔧 Datos Mock Disponibles

### Solicitudes Pre-cargadas (8 total)

| ID | Plataforma | Monto | Estado |
|----|-----------|-------|--------|
| req-1 | Meta | $5,000 | REQUEST_CREATED |
| req-2 | Meta | $2,000 | REQUEST_CREATED |
| req-3 | TikTok | $3,000 | CALCULATED |
| req-4 | Google | $10,000 | APPROVED_BY_CLIENT |
| req-5 | LinkedIn | $7,000 | INVOICED |
| req-6 | Meta | $15,000 | PAID |
| req-7 | TikTok | $4,000 | RECHARGE_EXECUTED |
| req-8 | Google | $8,000 | COMPLETED |

---

## 📝 Notas de Implementación

### Funcionalidad Real Implementada
✅ **Actualización de estados:** Los botones realmente cambian el estado de las solicitudes
✅ **Actualización de métricas:** Los contadores se actualizan automáticamente
✅ **Validaciones:** Solo se pueden ejecutar acciones en el estado correcto
✅ **Cálculo de comisión:** 5.5% sobre monto base
✅ **Generación de número de factura:** Formato `AND-{timestamp}`
✅ **Persistencia visual:** Los cambios se reflejan inmediatamente en la UI

### Pendiente para Producción
⚠️ **Backend:** Guardar cambios en base de datos
⚠️ **Excel real:** Integrar con archivo Excel oficial de AND
⚠️ **PDF:** Generar factura electrónica en formato PDF
⚠️ **Email:** Notificaciones automáticas por email
⚠️ **MISIVA:** Integración real para ejecutar recargas
⚠️ **Aprobación cliente:** Implementar flujo de aprobación en dashboard de empresa

---

## 🚀 Comandos Útiles

### Iniciar servidor
```bash
npm run dev
```

### Build de producción
```bash
npm run build
```

### Ver usuario actual (consola navegador)
```javascript
console.log(JSON.parse(localStorage.getItem('and_user')));
```

### Cambiar a admin (consola navegador)
```javascript
const adminUser = {
  id: "admin-and-001",
  type: "admin",
  isNew: false,
  email: "admin@and.com",
  name: "Operador AND",
  rucConnected: true,
  hasEmittedFirstInvoice: true
};
localStorage.setItem('and_user', JSON.stringify(adminUser));
location.reload();
```

---

## 🎯 Resumen

**Para acceder como Admin:**
1. Ir a [http://localhost:3000/login](http://localhost:3000/login)
2. Seleccionar "Admin AND" 🔑
3. Email: `admin@and.com`
4. Contraseña: `admin123`
5. Gestionar solicitudes en `/admin`

**Flujo de 7 pasos implementado:**
REQUEST_CREATED → CALCULATED → APPROVED_BY_CLIENT → INVOICED → PAID → RECHARGE_EXECUTED → COMPLETED

**Todas las acciones son funcionales** y actualizan estados y métricas en tiempo real.
