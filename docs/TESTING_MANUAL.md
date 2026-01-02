# Testing Manual - AND MVP

## Escenarios de Prueba

### ✅ Escenario 1: Usuario Nuevo (Registro)

**Pasos:**
1. Ir a `/landing`
2. Click en "Registrarse"
3. Seleccionar "Empresa"
4. Llenar formulario:
   - Nombre: "Test Company S.A.C."
   - Email: "test@company.com"
   - RUC: "20123456789"
5. Aceptar términos
6. Click "Crear Cuenta Empresarial"

**Resultado Esperado:**
- ✓ Redirección a `/dashboard`
- ✓ Se muestra sección de gamificación con "🚀 Iniciando"
- ✓ Métricas en 0 (usuario nuevo)
- ✓ Botón "Emitir Factura Local" habilitado
- ✓ Estado: RUC Conectado ✓, Primera Factura: Pendiente

---

### ✅ Escenario 2: Usuario Existente (Login)

**Pasos:**
1. Ir a `/login`
2. Ingresar email: cualquiera
3. Ingresar contraseña: cualquiera
4. Click "Iniciar Sesión"

**Resultado Esperado:**
- ✓ Redirección a `/dashboard`
- ✓ NO se muestra gamificación
- ✓ Métricas con datos (mock):
  - Total facturado: $53,000
  - Ahorro fiscal: $2,650
  - Facturas emitidas: 12
  - Facturas pendientes: 2
- ✓ Botón "Emitir Factura Local" habilitado
- ✓ Estado: RUC Conectado ✓, Primera Factura ✓

---

### ✅ Escenario 3: Emitir Factura (Usuario con RUC)

**Pasos:**
1. Estar en dashboard (usuario con RUC conectado)
2. Click en "Emitir Factura Local"
3. Seleccionar campaña: "Campaña de Lanzamiento - Meta"
4. Ingresar monto: 10000
5. Verificar cálculo tributario automático
6. Click "Emitir Factura"

**Resultado Esperado:**
- ✓ Modal se abre correctamente
- ✓ Cálculo tributario muestra:
  - Base: $10,000.00
  - IVA (15%): $1,500.00
  - ISD (5%) EVITADO: $500.00
  - Total a facturar: $11,475.00
  - Ahorro fiscal: $550.00
- ✓ Spinner "Procesando factura..." (2 segundos)
- ✓ Mensaje de éxito "¡Factura Emitida!"
- ✓ Modal se cierra automáticamente
- ✓ Si era primera factura: gamificación desaparece

---

### ✅ Escenario 4: Validación - Sin RUC

**Pasos:**
1. Modificar temporalmente usuario para simular RUC no conectado
2. Intentar emitir factura

**Resultado Esperado:**
- ✓ Botón "Emitir Factura Local" no aparece
- ✓ Se muestra mensaje de advertencia:
  "Debes conectar tus datos tributarios (RUC) antes de emitir facturas"
- ✓ Aparece botón "Conectar RUC"

---

### ✅ Escenario 5: Validación - Campaña Inválida

**Pasos:**
1. Abrir modal de emisión
2. NO seleccionar campaña
3. Ingresar monto: 5000
4. Click "Emitir Factura"

**Resultado Esperado:**
- ✓ Botón "Emitir Factura" deshabilitado mientras no hay campaña
- ✓ Al seleccionar campaña, botón se habilita

---

### ✅ Escenario 6: Validación - Monto Inválido

**Pasos:**
1. Abrir modal de emisión
2. Seleccionar campaña
3. Ingresar monto: 0 o negativo o vacío
4. Intentar emitir

**Resultado Esperado:**
- ✓ Botón "Emitir Factura" deshabilitado
- ✓ No se puede proceder sin monto válido

---

### ✅ Escenario 7: Error en Emisión (10% probabilidad)

**Pasos:**
1. Emitir factura normalmente
2. (10% de probabilidad de simular error)

**Resultado Esperado:**
- ✓ Ícono de error (X rojo)
- ✓ Mensaje: "Error al conectar con el SRI. Intenta nuevamente."
- ✓ Botón "Reintentar" visible
- ✓ Al click en reintentar, vuelve al formulario

---

### ✅ Escenario 8: Navegación

**Pasos:**
1. Ir a `/landing`
2. Explorar secciones
3. Click en "Iniciar Sesión" (header)

**Resultado Esperado:**
- ✓ Landing page muestra hero, empresas, influencers
- ✓ Botón "Iniciar Sesión" siempre visible en header
- ✓ Redirección correcta a `/login`

---

### ✅ Escenario 9: Gamificación Desaparece

**Pasos:**
1. Crear usuario nuevo (registro)
2. Verificar que gamificación es visible
3. Emitir primera factura
4. Recargar página

**Resultado Esperado:**
- ✓ Después de primera factura, gamificación desaparece
- ✓ Persistencia en localStorage mantiene estado
- ✓ Al recargar, gamificación sigue oculta

---

### ✅ Escenario 10: Theme Toggle

**Pasos:**
1. Estar en cualquier página
2. Click en botón de theme (sol/luna)

**Resultado Esperado:**
- ✓ Cambio suave entre dark/light mode
- ✓ Colores se ajustan correctamente
- ✓ Iconos y gradientes mantienen contraste

---

## Datos Mock para Testing

### Usuario Nuevo (Registro):
```typescript
{
  id: "new-user-[timestamp]",
  type: "empresa",
  isNew: true,
  email: "[ingresado]",
  name: "[ingresado]",
  rucConnected: true (si ingresa RUC),
  hasEmittedFirstInvoice: false
}
```

### Usuario Existente (Login):
```typescript
{
  id: "existing-user-123",
  type: "empresa",
  isNew: false,
  email: "[ingresado]",
  name: "Empresa Demo",
  rucConnected: true,
  hasEmittedFirstInvoice: true
}
```

### Campañas Mock:
```typescript
[
  {
    id: "camp-1",
    name: "Campaña de Lanzamiento - Meta",
    platform: "Meta",
    budget: 10000,
    status: "activa",
    isValid: true
  },
  {
    id: "camp-2",
    name: "Influencers TikTok Q1",
    platform: "TikTok",
    budget: 5000,
    status: "activa",
    isValid: true
  }
]
```

---

## Comandos para Testing

### Iniciar servidor de desarrollo:
```bash
npm run dev
```

### Limpiar localStorage (reset usuario):
```javascript
// En consola del navegador:
localStorage.clear();
location.reload();
```

### Simular usuario sin RUC:
```javascript
// En consola del navegador:
const user = JSON.parse(localStorage.getItem('and_user'));
user.rucConnected = false;
localStorage.setItem('and_user', JSON.stringify(user));
location.reload();
```

### Simular usuario nuevo:
```javascript
// En consola del navegador:
const user = JSON.parse(localStorage.getItem('and_user'));
user.isNew = true;
user.hasEmittedFirstInvoice = false;
localStorage.setItem('and_user', JSON.stringify(user));
location.reload();
```

---

## Checklist de Calidad

### Funcionalidad:
- [ ] Flujo de registro funciona
- [ ] Flujo de login funciona
- [ ] Dashboard muestra métricas correctas
- [ ] Emisión de factura procesa correctamente
- [ ] Validaciones funcionan
- [ ] Gamificación aparece/desaparece según reglas
- [ ] Estados se persisten en localStorage

### UI/UX:
- [ ] Animaciones suaves
- [ ] Mensajes de error claros
- [ ] Botones deshabilitados cuando corresponde
- [ ] Colores tienen buen contraste
- [ ] Responsive en mobile
- [ ] Dark mode funciona correctamente

### Performance:
- [ ] Página carga rápido
- [ ] Transiciones no generan lag
- [ ] Imágenes optimizadas
- [ ] No hay console errors

### Accesibilidad:
- [ ] Textos legibles
- [ ] Botones con tamaño adecuado
- [ ] Contraste suficiente
- [ ] Navegación con teclado funciona

---

## Errores Comunes y Soluciones

### Error: "useUser must be used within a UserProvider"
**Causa:** Componente no está dentro del UserProvider  
**Solución:** Verificar que UserProvider está en layout.tsx

### Error: Gamificación no desaparece
**Causa:** Estado no se actualiza correctamente  
**Solución:** Verificar que `updateUser` se llama al emitir factura

### Error: Modal no se abre
**Causa:** Estado showInvoiceModal no cambia  
**Solución:** Verificar onClick en botón

### Error: Cálculos incorrectos
**Causa:** Funciones de calculator.ts no se usan correctamente  
**Solución:** Verificar importación y uso de `calculateBillingTax`

---

## Métricas de Éxito

### Usuario Nuevo:
- ✓ Completa registro en < 2 minutos
- ✓ Entiende el valor de facturación local
- ✓ Ve trayectoria de gamificación
- ✓ Emite primera factura sin confusión

### Usuario Existente:
- ✓ Login en < 30 segundos
- ✓ Accede directo a dashboard
- ✓ Ve métricas relevantes inmediatamente
- ✓ Emite facturas sin fricción

---

**Última actualización:** 2 de enero, 2026
