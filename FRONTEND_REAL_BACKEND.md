# AND MVP - Frontend

## Conexión Backend Real Implementada ✅

### Estado Actual

El frontend ahora está completamente conectado al backend real, eliminando todos los mocks y localStorage de usuario.

---

## 🔄 Cambios Implementados

### 1. API Client Centralizado
**Archivo**: `lib/api/client.ts`

Cliente centralizado para todas las llamadas al backend:
- Auth: `login()`, `register()`
- User: `getMe()`
- Empresas: `createEmpresa()`, `getMyEmpresa()`
- Facturación: `createFacturacionRequest()`, `getMyFacturacionRequests()`, `approveFacturacionRequest()`, etc.
- Storage: `saveToken()`, `removeToken()`, `hasToken()`

### 2. UserContext Actualizado
**Archivo**: `lib/context/UserContext.tsx`

Cambios principales:
- ❌ **ELIMINADO**: Guardar usuario completo en localStorage
- ✅ **NUEVO**: Solo guarda `access_token`
- ✅ **NUEVO**: Obtiene datos de usuario desde `/me` endpoint
- ✅ **NUEVO**: `refreshUser()` para actualizar datos en tiempo real
- ✅ **NUEVO**: `loading` state para mejor UX

Interface User ahora mapeada desde `MeResponse`:
```typescript
{
  id: string;
  type: "admin" | "empresa" | "influencer";
  isNew: boolean;
  email: string;
  name: string;
  hasEmittedFirstInvoice: boolean;
  empresa?: {...}
}
```

### 3. Login Real
**Archivo**: `app/login/page.tsx`

- ❌ **ELIMINADO**: Mock de credenciales
- ✅ **NUEVO**: `POST /auth/login` con email/password
- ✅ **NUEVO**: Guarda solo token, NO usuario completo
- ✅ **NUEVO**: Manejo de errores con feedback visual
- ✅ **NUEVO**: Loading state en botón

### 4. Registro Real
**Archivo**: `app/registro/empresa/page.tsx`

Flujo completo:
1. `POST /auth/register` (email, password, role=EMPRESA)
2. Login automático con token recibido
3. `POST /empresas` (razon_social, ruc, correo_corporativo, telefono, ciudad)
4. Redirección a dashboard

Campos nuevos requeridos:
- ✅ Teléfono
- ✅ Ciudad

### 5. Dashboard con Datos Reales
**Archivo**: `app/dashboard/page.tsx`

- ❌ **ELIMINADO**: `loadMockData()` con datos falsos
- ✅ **NUEVO**: `loadData()` consume `GET /facturacion/mine`
- ✅ **NUEVO**: Métricas calculadas desde datos reales
- ✅ **NUEVO**: Botón "Aprobar" funcional llama a `PUT /facturacion/approve`
- ✅ **NUEVO**: `refreshUser()` después de acciones
- ✅ **NUEVO**: Loading states y skeleton screens

Métricas calculadas en tiempo real:
- Total facturado del mes
- Ahorro fiscal acumulado
- Facturas emitidas
- Facturas pendientes
- Solicitudes activas

### 6. Modal de Solicitud Real
**Archivo**: `app/components/BillingRequestModal.tsx`

- ❌ **ELIMINADO**: Simulación con `setTimeout`
- ✅ **NUEVO**: `POST /facturacion/request` real
- ✅ **NUEVO**: Plataformas actualizadas: META, TIKTOK, GOOGLE, OTRO
- ✅ **NUEVO**: `refreshUser()` después de crear solicitud
- ✅ **NUEVO**: Manejo de estado "error"

---

## 🔧 Configuración Requerida

### 1. Variables de Entorno
Crea archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Para producción:
```env
NEXT_PUBLIC_API_URL=https://api.and-backend.com
```

### 2. Instalación

```bash
npm install
```

### 3. Ejecutar Frontend

```bash
npm run dev
```

Frontend correrá en: `http://localhost:3000`

---

## 📊 Flujo de Autenticación

### Login
```
Usuario ingresa email/password
    ↓
POST /auth/login
    ↓
Recibe access_token
    ↓
Guarda en localStorage: "and_token"
    ↓
GET /me automático
    ↓
Usuario cargado en contexto
    ↓
Redirección a dashboard
```

### Registro
```
Usuario llena formulario
    ↓
POST /auth/register (email, password, role=EMPRESA)
    ↓
Recibe access_token
    ↓
Login automático con token
    ↓
GET /me automático
    ↓
POST /empresas (datos corporativos)
    ↓
Redirección a dashboard
```

### Navegación Protegida
```
Usuario intenta acceder a ruta protegida
    ↓
useUser() verifica si hay token
    ↓
Si NO hay token → redirect /login
    ↓
Si SÍ hay token → GET /me
    ↓
Si GET /me falla → removeToken() → redirect /login
    ↓
Si GET /me OK → usuario cargado → continuar
```

---

## 🎯 Endpoints Consumidos

### Auth (sin autenticación)
- `POST /auth/register` - Crear cuenta
- `POST /auth/login` - Iniciar sesión

### Usuario (requiere token)
- `GET /me` - Obtener info del usuario logueado

### Empresas (requiere token, role=EMPRESA)
- `POST /empresas` - Crear empresa
- `GET /empresas/mine` - Obtener mi empresa

### Facturación (requiere token, role=EMPRESA)
- `POST /facturacion/request` - Crear solicitud
- `GET /facturacion/mine` - Mis solicitudes
- `PUT /facturacion/approve` - Aprobar solicitud

---

## 🔐 Seguridad

### ✅ Implementado
- Token JWT guardado en localStorage
- Header `Authorization: Bearer <token>` en todas las peticiones
- Logout limpia token
- Refresh automático si token inválido
- Contraseñas enviadas al backend (no se guardan en front)

### ⚠️ Consideraciones para Producción
- Implementar refresh tokens
- Considerar httpOnly cookies en lugar de localStorage
- Agregar rate limiting
- HTTPS obligatorio
- CSP headers

---

## 📋 Checklist de Validación

### Para Usuario Empresa

- [ ] Registro completo funciona
- [ ] Login funciona
- [ ] Dashboard carga datos reales
- [ ] Crear solicitud funciona
- [ ] Aprobar solicitud funciona
- [ ] Logout funciona
- [ ] Gamificación se oculta después de primera factura

### Para Admin (cuando esté listo el backend)

- [ ] Login admin funciona
- [ ] Ver todas las solicitudes
- [ ] Calcular valores
- [ ] Emitir factura
- [ ] Registrar pago
- [ ] Ejecutar recarga
- [ ] Completar proceso

---

## 🚨 Troubleshooting

### Error: "Network request failed"
- Verifica que backend esté corriendo en `http://localhost:3001`
- Verifica CORS en backend permite `http://localhost:3000`
- Verifica `.env.local` tiene `NEXT_PUBLIC_API_URL` correcto

### Error: "Unauthorized"
- Token expiró o es inválido
- Haz logout y login de nuevo
- Verifica backend JWT_SECRET coincide

### Error: "Cannot read empresa"
- Usuario no tiene empresa creada
- Completa flujo de registro empresa

### Dashboard vacío
- Usuario nuevo sin solicitudes aún
- Crea primera solicitud desde modal

---

## 📁 Archivos Modificados

```
lib/
├── api/
│   └── client.ts               # NUEVO - Cliente API centralizado
├── context/
│   └── UserContext.tsx         # MODIFICADO - Auth real con token
├── billing/                    # Sin cambios (tipos y validaciones)

app/
├── login/
│   └── page.tsx                # MODIFICADO - Login real
├── registro/
│   └── empresa/
│       └── page.tsx            # MODIFICADO - Registro real
├── dashboard/
│   └── page.tsx                # MODIFICADO - Datos reales
├── components/
│   └── BillingRequestModal.tsx # MODIFICADO - API real

.env.local.example              # NUEVO - Template de env vars
```

---

## 🎉 Resultado Final

### Antes (Mock)
- Usuario guardado completo en localStorage
- Datos fake en dashboard
- Sin validación real de credenciales
- Sin persistencia entre sesiones

### Ahora (Real)
- Solo token en localStorage
- Datos desde backend via API
- Validación real de credenciales
- Persistencia real via Supabase
- Gamificación controlada por backend
- Trazabilidad de todas las acciones

---

## 📞 Próximos Pasos

1. Implementar Admin Dashboard con datos reales
2. Agregar funcionalidad de upload de archivos (PDFs, comprobantes)
3. Implementar notificaciones en tiempo real (WebSocket)
4. Agregar paginación en tabla de solicitudes
5. Implementar filtros y búsqueda
6. Agregar exportación de datos (CSV, PDF)

---

**Versión**: 3.0 - Frontend Conectado a Backend Real  
**Fecha**: 17 de enero, 2026  
**Autor**: GitHub Copilot
