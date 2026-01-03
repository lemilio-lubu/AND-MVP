# Flujo Real de AND - Facturación Local con Aprobación Humana

**Fecha:** 2 de enero, 2026  
**Versión:** 2.0 - FLUJO REAL CON ADMIN

---

## 🎯 Concepto Clave

**El core de AND NO es emitir facturas automáticamente.**  
**El core es gestionar solicitudes de facturación con control humano.**

---

## 👥 Actores del Sistema

### 1. Cliente (Empresa)
- Solicita recarga de pauta
- Aprueba montos calculados
- Paga facturas
- Recibe confirmación

### 2. Admin AND (NUEVO)
- Calcula valores en Excel
- Emite facturas reales
- Registra pagos
- Coordina con MISIVA para recargas
- Marca procesos como completados

### 3. Influencer (Futuro)
- Solo registro de datos
- No ve facturación

---

## 🔄 Flujo Completo (7 Pasos)

```
┌────────────────────────────────────────────────────────────┐
│  1. CLIENTE SOLICITA                                        │
│  Estado: REQUEST_CREATED                                    │
│                                                             │
│  UI Cliente:                                                │
│  - Botón: "Solicitar Facturación Local"                    │
│  - Campos: Plataforma, Monto de pauta                      │
│  - CTA: "Enviar Solicitud"                                 │
│                                                             │
│  ❗ NO hay factura todavía                                  │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  2. ADMIN CALCULA EN EXCEL                                  │
│  Estado: CALCULATED                                         │
│                                                             │
│  Acción Admin (fuera del sistema):                         │
│  - Abre Excel oficial de AND                               │
│  - Ingresa monto solicitado                                │
│  - Obtiene: base, comisión, total                          │
│                                                             │
│  Acción Admin (en sistema):                                │
│  - Registra valores calculados                             │
│  - Cambia estado a CALCULATED                              │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  3. CLIENTE APRUEBA EL VALOR                                │
│  Estado: APPROVED_BY_CLIENT                                 │
│                                                             │
│  UI Cliente:                                                │
│  - Ve desglose: Base + Comisión = Total                    │
│  - Botón: "Aprobar y Continuar"                            │
│                                                             │
│  ❗ Sin aprobación, no se emite factura                     │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  4. ADMIN EMITE FACTURA                                     │
│  Estado: INVOICED                                           │
│                                                             │
│  Acción Admin:                                              │
│  - Emite factura electrónica REAL                          │
│  - Adjunta número de factura                               │
│  - Sube PDF de factura                                     │
│  - Marca como INVOICED                                     │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  5. CLIENTE PAGA                                            │
│  Estado: PAID                                               │
│                                                             │
│  Cliente:                                                   │
│  - Realiza transferencia bancaria                          │
│  - Sube comprobante de pago                                │
│                                                             │
│  Admin:                                                     │
│  - Valida pago recibido                                    │
│  - Registra fecha y comprobante                            │
│  - Marca como PAID                                         │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  6. AND EJECUTA RECARGA                                     │
│  Estado: RECHARGE_EXECUTED                                  │
│                                                             │
│  Admin + Performance:                                       │
│  - Coordina con MISIVA                                     │
│  - Ejecuta recarga en plataforma                           │
│  - Verifica saldo aplicado                                 │
│  - Marca como RECHARGE_EXECUTED                            │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  7. PROCESO CERRADO                                         │
│  Estado: COMPLETED                                          │
│                                                             │
│  Cliente:                                                   │
│  - Ve confirmación de recarga                              │
│  - Historial completo disponible                           │
│                                                             │
│  Sistema:                                                   │
│  - Actualiza métricas                                      │
│  - Archiva solicitud                                       │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 Estados del Sistema

### Estados de Solicitud (BillingStatus)

| Estado | Descripción | Actor Responsable | Acción Siguiente |
|--------|-------------|-------------------|------------------|
| `REQUEST_CREATED` | Solicitud enviada por cliente | Cliente | Admin calcula |
| `CALCULATED` | Valores calculados por admin | Admin | Cliente aprueba |
| `APPROVED_BY_CLIENT` | Cliente aprobó el monto | Cliente | Admin emite factura |
| `INVOICED` | Factura emitida | Admin | Cliente paga |
| `PAID` | Pago confirmado | Cliente/Admin | Admin ejecuta recarga |
| `RECHARGE_EXECUTED` | Recarga aplicada | Admin | Cerrar proceso |
| `COMPLETED` | Proceso finalizado | Sistema | Archivar |
| `ERROR` | Error en algún paso | Sistema | Revisar y corregir |

---

## 🚫 Lo que NO es AND

### ❌ AND NO es un Ads Manager

- No se crean campañas técnicas en AND
- No se configuran audiencias
- No se optimiza el CTR, CPM, CPC
- No se gestionan creativos

### ✅ AND SÍ es un Gestor de Facturación

- Gestiona solicitudes de recarga
- Calcula valores con comisión
- Emite facturas locales
- Coordina pagos y recargas
- Ahorra ISD (5%)

---

## 💡 Terminología Correcta

| ❌ INCORRECTO | ✅ CORRECTO |
|--------------|-----------|
| "Ver campañas activas" | "Ver solicitudes activas" |
| "Crear campaña" | "Solicitar facturación" |
| "Emitir factura" (cliente) | "Solicitar facturación" |
| "Meta Ads Manager" | "Gestión de Facturación" |
| "Configurar audiencia" | NO APLICA |

---

## 🎯 Diferencias Clave vs. Versión Anterior

### Versión 1.0 (INCORRECTA)
```
Cliente → Emite Factura → Sistema calcula → Factura emitida
```
**Problema:** No hay control humano, no refleja proceso real

### Versión 2.0 (CORRECTA)
```
Cliente → Solicita → Admin calcula → Cliente aprueba → 
Admin emite → Cliente paga → Admin ejecuta → Completado
```
**Beneficio:** Control total, trazabilidad, auditoría

---

## 📝 Campos de RechargeRequest

```typescript
interface RechargeRequest {
  id: string;
  companyId: string;
  
  // Lo que solicita el cliente
  platform: "Meta" | "TikTok" | "Google" | "LinkedIn";
  requestedAmount: number;
  
  // Lo que calcula el admin (en Excel)
  calculatedBase?: number;
  calculatedCommission?: number;
  calculatedTotal?: number;
  
  // Estado del proceso
  status: BillingStatus;
  
  // Timestamps de cada paso
  createdAt: Date;
  calculatedAt?: Date;
  approvedAt?: Date;
  invoicedAt?: Date;
  paidAt?: Date;
  rechargeExecutedAt?: Date;
  completedAt?: Date;
  
  // Evidencia
  invoiceNumber?: string;
  invoicePdfUrl?: string;
  paymentProofUrl?: string;
  errorMessage?: string;
}
```

---

## 🎨 UI Correcta

### Dashboard Cliente

**Botón Principal:**
```
"Solicitar Facturación Local"  ✅
NO: "Emitir Factura"           ❌
```

**Widget de Estado:**
```
"Solicitudes en Proceso: 2"    ✅
NO: "Campañas Activas: 2"      ❌
```

**Lista de Items:**
```
"Solicitudes Recientes"         ✅
NO: "Campañas Recientes"        ❌
```

### Dashboard Admin

**Métricas:**
- Pendientes de Calcular
- Pendientes de Aprobación (cliente)
- Pendientes de Emitir Factura
- Pendientes de Pago
- Pendientes de Ejecutar Recarga
- Completadas este Mes

**Acciones:**
- Calcular valores
- Emitir factura
- Registrar pago
- Marcar recarga ejecutada
- Completar proceso

---

## 🔐 Validaciones por Rol

### Cliente puede:
- ✅ Solicitar facturación
- ✅ Ver sus solicitudes
- ✅ Aprobar montos calculados
- ✅ Subir comprobante de pago
- ❌ NO puede emitir facturas directamente
- ❌ NO puede calcular valores
- ❌ NO puede ejecutar recargas

### Admin puede:
- ✅ Ver todas las solicitudes
- ✅ Calcular valores
- ✅ Emitir facturas
- ✅ Registrar pagos
- ✅ Ejecutar recargas
- ✅ Completar procesos

---

## 📋 Checklist de Corrección

- [x] Estados reflejan flujo real (7 pasos)
- [x] Existe rol de Admin
- [x] Cliente NO emite facturas directamente
- [x] "Campañas" reemplazado por "Solicitudes"
- [x] Control humano en cada paso crítico
- [x] Trazabilidad completa (timestamps)
- [x] Evidencia documentada (PDFs, comprobantes)

---

## 🚀 Frase para la Reunión

> "Hoy el dashboard representa una versión **user-first**. Para alinearlo al proceso real de AND, estamos introduciendo un **rol admin que orquesta la facturación**, manteniendo **control humano y trazabilidad** en cada paso del proceso."

---

**Conclusión:**  
El core de AND NO es emitir facturas automáticamente.  
El core es **gestionar solicitudes de facturación local con aprobación humana.**

---

**Versión:** 2.0  
**Autor:** GitHub Copilot  
**Revisado:** 2 de enero, 2026
