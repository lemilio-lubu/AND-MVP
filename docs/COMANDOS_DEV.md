# Comandos de Desarrollo - AND MVP

## 🚀 Inicio Rápido

### Instalar dependencias
```bash
npm install
```

### Iniciar servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Build de producción
```bash
npm run build
```

### Iniciar servidor de producción
```bash
npm start
```

---

## 🧹 Linting y Formateo

### Ejecutar linter
```bash
npm run lint
```

### Fix automático de errores
```bash
npm run lint -- --fix
```

---

## 🧪 Testing (Para implementar en Semana 3)

### Unit tests
```bash
npm test
```

### Watch mode
```bash
npm test -- --watch
```

### Coverage
```bash
npm test -- --coverage
```

---

## 🔍 Debugging

### Verificar errores de TypeScript
```bash
npx tsc --noEmit
```

### Analizar bundle size
```bash
npm run build
npx @next/bundle-analyzer
```

---

## 🛠️ Utilidades de Desarrollo

### Limpiar caché de Next.js
```bash
rm -rf .next
npm run dev
```

### Limpiar node_modules y reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

### Ver información del proyecto
```bash
npm list
```

---

## 💾 Gestión de Estado (LocalStorage)

### Limpiar localStorage en navegador
```javascript
// En consola del navegador (F12):
localStorage.clear();
location.reload();
```

### Ver usuario actual
```javascript
// En consola del navegador:
const user = JSON.parse(localStorage.getItem('and_user'));
console.log(user);
```

### Modificar usuario actual
```javascript
// En consola del navegador:
const user = JSON.parse(localStorage.getItem('and_user'));
user.isNew = true; // o cualquier otra propiedad
localStorage.setItem('and_user', JSON.stringify(user));
location.reload();
```

### Simular usuario sin RUC
```javascript
const user = JSON.parse(localStorage.getItem('and_user'));
user.rucConnected = false;
localStorage.setItem('and_user', JSON.stringify(user));
location.reload();
```

### Simular usuario nuevo con gamificación
```javascript
const user = JSON.parse(localStorage.getItem('and_user'));
user.isNew = true;
user.hasEmittedFirstInvoice = false;
localStorage.setItem('and_user', JSON.stringify(user));
location.reload();
```

---

## 🎨 Tailwind CSS

### Rebuild CSS
```bash
npm run dev
# Tailwind reconstruye automáticamente en desarrollo
```

### Purge CSS (automático en build)
```bash
npm run build
# Solo incluye clases usadas
```

---

## 📦 Dependencias

### Ver dependencias outdated
```bash
npm outdated
```

### Actualizar dependencias
```bash
npm update
```

### Actualizar dependencia específica
```bash
npm update [package-name]
```

### Instalar nueva dependencia
```bash
npm install [package-name]
```

### Instalar dependencia de desarrollo
```bash
npm install -D [package-name]
```

---

## 🔐 Variables de Entorno (Futuro)

### Crear archivo .env.local
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SRI_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/and_mvp
```

### Acceder en código
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 📝 Git Workflow (Recomendado)

### Crear rama para feature
```bash
git checkout -b feature/nombre-feature
```

### Commit con mensaje descriptivo
```bash
git add .
git commit -m "feat: descripción del cambio"
```

### Push a rama
```bash
git push origin feature/nombre-feature
```

### Merge a main
```bash
git checkout main
git merge feature/nombre-feature
git push origin main
```

---

## 🐛 Troubleshooting

### Error: "Module not found"
```bash
# Limpiar caché y reinstalar
rm -rf node_modules .next
npm install
npm run dev
```

### Error: "Port 3000 already in use"
```bash
# Matar proceso en puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Error: TypeScript no encuentra tipos
```bash
# Reinstalar tipos
npm install -D @types/node @types/react @types/react-dom
```

### Error: Hydration error
```bash
# Asegurarse de usar "use client" en componentes con hooks
# Verificar que no hay diferencias entre SSR y cliente
```

---

## 📊 Monitoreo de Performance

### Lighthouse en Chrome
1. Abrir DevTools (F12)
2. Tab "Lighthouse"
3. "Generate report"

### Analizar renders innecesarios
```typescript
// Agregar en componente:
useEffect(() => {
  console.log('Component rendered');
});
```

### React DevTools Profiler
1. Instalar React DevTools extension
2. Tab "Profiler"
3. Grabar interacción
4. Analizar flame graph

---

## 🔄 Hotkeys de Desarrollo

### VS Code
- `Ctrl + Shift + P` - Command Palette
- `Ctrl + P` - Quick Open File
- `Ctrl + \`` - Toggle Terminal
- `Ctrl + B` - Toggle Sidebar
- `F5` - Start Debugging

### Chrome DevTools
- `F12` - Abrir DevTools
- `Ctrl + Shift + C` - Inspect Element
- `Ctrl + Shift + M` - Toggle Device Toolbar
- `Ctrl + Shift + I` - DevTools
- `Ctrl + Shift + J` - Console

---

## 📚 Recursos Útiles

### Documentación
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Herramientas
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 🎯 Scripts Personalizados (Futuros)

### Generar componente
```bash
npm run generate:component [nombre]
```

### Seed de base de datos
```bash
npm run db:seed
```

### Migrations
```bash
npm run db:migrate
```

### Backup
```bash
npm run backup
```

---

## 🚀 Deploy (Futuro)

### Vercel
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

## 📞 Comandos de Ayuda

### Ver todos los scripts disponibles
```bash
npm run
```

### Información de Node y npm
```bash
node -v
npm -v
```

### Información del sistema
```bash
npx envinfo --system --binaries
```

---

**Última actualización:** 2 de enero, 2026
