# AND MVP - Infraestructura Financiera para Influencers

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)

**AND** conecta marcas y creadores con eficiencia fiscal y cumplimiento normativo en Ecuador.

---

## 🎯 Core del Producto

### Facturación Local
El core de AND es la **Facturación Local**, que permite a empresas:
- ✅ Emitir facturas locales por pauta digital
- 💰 Evitar ISD (5%) en transacciones internacionales
- 📊 Ver ahorro fiscal en tiempo real
- 🧾 Gestionar facturas con estados claros

### Gamificación (Condicional)
La gamificación es **transversal y no invasiva**:
- Solo visible para usuarios nuevos
- Se oculta automáticamente al emitir primera factura
- No afecta el flujo principal

---

## 🚀 Quick Start

### Prerequisitos
- Node.js 18.17 o superior
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone [url]
cd and-mvp

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
and-mvp/
├── app/                          # Next.js App Router
│   ├── components/              # Componentes React
│   │   ├── InvoiceEmissionModal.tsx
│   │   ├── theme-provider.tsx
│   │   └── ui/                  # Componentes UI reutilizables
│   ├── dashboard/               # Dashboard de Facturación
│   ├── landing/                 # Landing page
│   ├── login/                   # Autenticación
│   └── registro/                # Registro usuarios
│
├── lib/                         # Lógica de negocio
│   ├── billing/                # Dominio de facturación
│   │   ├── types.ts           # Tipos TypeScript
│   │   ├── calculator.ts      # Cálculo tributario
│   │   ├── validation.ts      # Reglas de negocio
│   │   └── index.ts
│   └── context/               # Estado global
│       └── UserContext.tsx
│
├── docs/                       # Documentación
│   ├── CORRECCIONES_SEMANA2.md
│   ├── FLUJO_USUARIO.md
│   ├── TESTING_MANUAL.md
│   ├── RESUMEN_EJECUTIVO.md
│   └── COMANDOS_DEV.md
│
└── public/                    # Assets estáticos
```

---

## 🛠️ Tecnologías

- **Framework:** Next.js 16.1.0 (App Router + Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Phosphor Icons
- **State:** React Context API
- **Fonts:** Montserrat, Geist Mono

---

## 📊 Features Implementados

### ✅ P0 - Core Features
- [x] Flujo Home → Login → Registro → Dashboard
- [x] Motor de cálculo tributario (IVA, ISD, ahorro)
- [x] Emisión de facturas con validaciones
- [x] Dashboard con métricas AND específicas

### ✅ P1 - Features Importantes
- [x] Control usuario nuevo vs existente
- [x] Gamificación condicional (solo nuevos)
- [x] Estados de facturación visibles
- [x] Validaciones de negocio (RUC, campaña, monto)

### 🔲 P2 - Roadmap
- [ ] Integración API real del SRI
- [ ] Base de datos PostgreSQL
- [ ] Exportar facturas en PDF
- [ ] Notificaciones por email
- [ ] Testing automatizado

---

## 💼 Casos de Uso

### Usuario Nuevo (Empresa)
1. Se registra desde `/registro/empresa`
2. Ve gamificación inicial (niveles de trayectoria)
3. Accede a dashboard de facturación
4. Emite primera factura
5. Gamificación desaparece automáticamente

### Usuario Existente
1. Hace login desde `/login`
2. Entra directo a dashboard (sin gamificación)
3. Ve métricas y facturas históricas
4. Emite facturas sin fricción

---

## 🧮 Cálculo Tributario

### Ejemplo: $10,000 en pauta digital

| Concepto | Tarjeta Internacional | Facturación Local | Diferencia |
|----------|----------------------|-------------------|------------|
| Base | $10,000 | $10,000 | - |
| IVA (15%) | +$1,500 | +$1,500 | - |
| ISD (5%) | +$500 | **$0** | ✅ **-$500** |
| No deducible | +$25 | -$25 | ✅ **-$25** |
| **TOTAL** | **$12,025** | **$11,475** | 💰 **$550** |

**Ahorro fiscal:** $550 (4.6%)

---

## 🎨 UI/UX

### Principios de Nielsen Aplicados

1. **Visibilidad del estado:** Estados claros en cada componente
2. **Correspondencia con el mundo real:** Lenguaje contable, no técnico
3. **Prevención de errores:** Validaciones previas visibles
4. **Reconocer mejor que recordar:** Información contextual siempre visible
5. **Minimalismo:** Solo métricas relevantes para AND

### Dark Mode
- Toggle en header (sol/luna)
- Transiciones suaves
- Colores optimizados para ambos modos

---

## 🧪 Testing

### Manual Testing
Ver guía completa en [`docs/TESTING_MANUAL.md`](./docs/TESTING_MANUAL.md)

### Ejecutar tests (Semana 3)
```bash
npm test
npm test -- --watch
npm test -- --coverage
```

---

## 📝 Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm start            # Iniciar producción
npm run lint         # Linter
npm run lint:fix     # Fix automático
```

Ver más comandos en [`docs/COMANDOS_DEV.md`](./docs/COMANDOS_DEV.md)

---

## 🔐 Validaciones de Negocio

### Emisión de Factura

```typescript
// Validaciones implementadas:
1. RUC conectado ✓
2. Campaña seleccionada ✓
3. Campaña activa y válida ✓
4. Monto > 0 y < $1,000,000 ✓
```

### Estados de Factura

```
draft → emitida → pagada
            ↓
         rechazada (retry)
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [`CORRECCIONES_SEMANA2.md`](./docs/CORRECCIONES_SEMANA2.md) | Correcciones aplicadas en detalle |
| [`FLUJO_USUARIO.md`](./docs/FLUJO_USUARIO.md) | Diagramas de flujo |
| [`TESTING_MANUAL.md`](./docs/TESTING_MANUAL.md) | Guía de testing |
| [`RESUMEN_EJECUTIVO.md`](./docs/RESUMEN_EJECUTIVO.md) | Resumen para stakeholders |
| [`COMANDOS_DEV.md`](./docs/COMANDOS_DEV.md) | Comandos útiles |

---

## 🐛 Troubleshooting

### Puerto 3000 en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Limpiar caché
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Error de hidratación
- Agregar `"use client"` en componentes con hooks
- Verificar diferencias entre SSR y cliente

---

## 🚢 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel login
vercel
```

### Docker
```bash
docker build -t and-mvp .
docker run -p 3000:3000 and-mvp
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'feat: descripción'`
4. Push: `git push origin feature/nueva-feature`
5. Abrir Pull Request

---

## 📄 Licencia

Privado - AND Ecosystem © 2026

---

## 👥 Equipo

Desarrollado con ❤️ para AND Ecosystem

---

## 📞 Soporte

- **Documentación:** Ver `/docs`
- **Issues:** [GitHub Issues](https://github.com/...)
- **Email:** soporte@and.ec

---

**Versión:** 1.0.0  
**Última actualización:** 2 de enero, 2026  
**Build Status:** ✅ PASSING
