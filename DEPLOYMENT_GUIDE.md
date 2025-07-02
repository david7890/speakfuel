# 🚀 Deployment Guide - SpeakFuel en Vercel

## 🎯 Estrategia de Deploy

### Entornos de Deploy
- **Production** (`main` branch) → `speakfuel.com`
- **Preview** (`develop` branch) → `develop-speakfuel.vercel.app`
- **Feature branches** → URLs temporales de preview

## 📋 Pre-Deploy Checklist

### ✅ Variables de Entorno Requeridas

#### **Supabase**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### **Stripe**
```bash
# Production Keys
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Test Keys (para preview)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### **App Configuration**
```bash
NEXT_PUBLIC_SITE_URL=https://speakfuel.com
NEXTAUTH_SECRET=your-nextauth-secret
NODE_ENV=production
```

### ✅ Archivos de Configuración

#### **`vercel.json`** (Configuración optimizada)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/acceso",
      "has": [
        {
          "type": "query",
          "key": "error",
          "value": "access_denied"
        }
      ],
      "destination": "/?error=access_denied",
      "permanent": false
    }
  ]
}
```

## 🔧 Setup en Vercel

### **Paso 1: Conectar Repositorio**
```bash
# Asegurar que main está actualizado
git checkout main
git pull origin main
git merge develop
git push origin main
```

1. Ve a [vercel.com](https://vercel.com)
2. **Import Git Repository**
3. Selecciona tu repo `speakfuel`
4. **Framework Preset**: Next.js
5. **Root Directory**: `./` (raíz del proyecto)

### **Paso 2: Configurar Variables de Entorno**

#### **En Vercel Dashboard:**
1. **Settings** → **Environment Variables**
2. Agregar **todas** las variables mencionadas arriba
3. **Environments**:
   - ✅ Production (para `main`)
   - ✅ Preview (para `develop` y features)
   - ✅ Development (opcional)

### **Paso 3: Configurar Deploy Branches**
1. **Settings** → **Git**
2. **Production Branch**: `main`
3. **Deploy Hooks**: Configurar webhook para `develop`

## 🌐 Configuración de Dominios

### **Dominios Recomendados:**
- **Producción**: `speakfuel.com` (desde `main`)
- **Staging**: `dev.speakfuel.com` (desde `develop`)
- **Features**: Auto-generadas por Vercel

### **Setup DNS:**
```bash
# En tu proveedor de dominio (Namecheap, GoDaddy, etc.)
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: dev
Value: cname.vercel-dns.com
```

## 📊 Monitoring y Analytics

### **Vercel Analytics**
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### **Error Monitoring**
- **Vercel Dashboard** → **Functions** → **Logs**
- **Supabase Dashboard** → **Logs**
- **Stripe Dashboard** → **Events**

## 🔄 Workflow de Deploy

### **Deploy de Features**
```bash
# 1. Crear feature
git checkout develop
git checkout -b feature/payment-improvements

# 2. Desarrollar...
git add .
git commit -m "feat: improve payment flow UX"
git push -u origin feature/payment-improvements

# 3. Vercel auto-deploya preview URL
# 4. Testing en URL preview
# 5. Merge a develop
git checkout develop
git merge feature/payment-improvements
git push origin develop

# 6. Vercel auto-deploya staging (dev.speakfuel.com)
```

### **Deploy a Producción**
```bash
# 1. Testing completo en staging
# 2. Merge develop → main
git checkout main
git pull origin main
git merge develop
git tag -a v1.4.0 -m "Release v1.4.0: Payment improvements"
git push origin main
git push origin v1.4.0

# 3. Vercel auto-deploya a producción (speakfuel.com)
# 4. Verificar deploy exitoso
```

### **Rollback de Emergencia**
```bash
# En Vercel Dashboard:
# 1. Deployments → Seleccionar deployment anterior
# 2. Click "Promote to Production"

# O desde Git:
git checkout main
git revert HEAD  # Revertir último commit
git push origin main
```

## 🛡️ Seguridad en Producción

### **Headers de Seguridad** (ya en vercel.json)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY  
- X-XSS-Protection: 1; mode=block

### **Variables Sensibles**
- ❌ **NUNCA** committear claves en el código
- ✅ **Siempre** usar variables de entorno de Vercel
- ✅ **Rotar claves** regularmente

### **HTTPS y SSL**
- ✅ Vercel automáticamente provee SSL
- ✅ Force HTTPS en settings
- ✅ HSTS headers

## 📈 Performance Optimizations

### **Next.js Optimizations**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
```

### **Database Optimizations**
- Connection pooling en Supabase
- Indexes apropiados en queries frecuentes
- Caching de datos estáticos

## 🚨 Troubleshooting

### **Errores Comunes**

#### **Build Errors**
```bash
# Error: Missing environment variables
# Solución: Verificar variables en Vercel Dashboard
```

#### **Runtime Errors**
```bash
# Error: Database connection failed
# Solución: Verificar SUPABASE_SERVICE_ROLE_KEY
```

#### **Stripe Webhooks**
```bash
# Error: Webhook signature verification failed
# Solución: Actualizar STRIPE_WEBHOOK_SECRET
```

### **Debugging Tools**
```bash
# Logs en tiempo real
vercel logs [deployment-url] --follow

# Logs de funciones
vercel logs [deployment-url] --scope=functions
```

## 📝 Post-Deploy Checklist

### **✅ Verificaciones Obligatorias**
- [ ] Homepage carga correctamente
- [ ] Login/registro funciona
- [ ] Proceso de pago completo
- [ ] Dashboard accesible post-pago
- [ ] Magic links funcionan
- [ ] Webhooks de Stripe conectados
- [ ] SSL certificate activo
- [ ] Analytics funcionando

### **✅ Testing de Producción**
- [ ] Flujo completo usuario nuevo
- [ ] Flujo de acceso usuario existente
- [ ] Pagos en modo live
- [ ] Responsive design
- [ ] Velocidad de carga < 3s

---

## 🎯 Comandos Quick Deploy

```bash
# Deploy rápido a staging
git checkout develop
git add .
git commit -m "fix: quick production fix"
git push origin develop

# Deploy rápido a producción  
git checkout main
git merge develop
git push origin main
```

**🚀 Ready for Launch!** 