# 🌳 Git Workflow - SpeakFuel

## Estrategia de Ramas

### Ramas Principales
- **`main`** - Código de producción (estable, deployable)
- **`develop`** - Rama de integración para desarrollo

### Ramas de Trabajo
- **`feature/nombre-feature`** - Nuevas funcionalidades
- **`hotfix/nombre-fix`** - Correcciones críticas en producción
- **`release/v1.x.x`** - Preparación de releases (opcional)

## 🚀 Flujos de Trabajo

### Desarrollo de Feature
```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear rama feature
git checkout -b feature/user-session-improvements

# 3. Desarrollar y commitear
git add .
git commit -m "feat: implement auto token refresh"

# 4. Push del feature
git push -u origin feature/user-session-improvements

# 5. Crear Pull Request en GitHub (develop ← feature)

# 6. Después del merge, limpiar
git checkout develop
git pull origin develop
git branch -d feature/user-session-improvements
```

### Hotfix de Producción
```bash
# 1. Crear hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/stripe-config-fix

# 2. Fix y commit
git add .
git commit -m "hotfix: fix missing Stripe environment variable"

# 3. Merge a main
git checkout main
git merge hotfix/stripe-config-fix
git push origin main

# 4. Merge a develop también
git checkout develop
git merge hotfix/stripe-config-fix
git push origin develop

# 5. Limpiar
git branch -d hotfix/stripe-config-fix
git push origin --delete hotfix/stripe-config-fix
```

### Release a Producción
```bash
# 1. Merge develop a main
git checkout main
git pull origin main
git merge develop
git push origin main

# 2. Crear tag de versión
git tag -a v1.2.0 -m "Release v1.2.0: Session management and payment fixes"
git push origin v1.2.0
```

## 📝 Convenciones de Commits

### Formato: `tipo: descripción breve`

#### Tipos de Commits
- **`feat:`** - Nueva funcionalidad
- **`fix:`** - Corrección de bug
- **`docs:`** - Documentación
- **`style:`** - Formato (no afecta lógica)
- **`refactor:`** - Refactoring
- **`test:`** - Añadir tests
- **`chore:`** - Build, dependencias, herramientas

#### Ejemplos Específicos de SpeakFuel
```bash
# Features
git commit -m "feat: add 30-day session persistence"
git commit -m "feat: implement magic link authentication"
git commit -m "feat: add user progress tracking"

# Fixes
git commit -m "fix: resolve checkout Stripe key undefined error"
git commit -m "fix: handle session expiry gracefully"
git commit -m "fix: prevent duplicate user registration"

# Docs
git commit -m "docs: update testing guide with reset procedures"
git commit -m "docs: add database schema documentation"

# Refactor
git commit -m "refactor: simplify session management logic"
git commit -m "refactor: extract auth helpers to separate file"
```

## 🔍 Comandos Útiles

### Status y Limpieza
```bash
# Ver estado de ramas
git branch -a

# Limpiar ramas locales que ya no existen en remoto
git remote prune origin

# Ver ramas mergeadas (seguras de borrar)
git branch --merged develop

# Borrar múltiples ramas feature
git branch | grep "feature/" | xargs git branch -d
```

### Logs y Historia
```bash
# Log bonito con gráfico
git log --oneline --graph --decorate --all

# Ver commits entre ramas
git log develop..main

# Ver cambios específicos
git log --grep="feat:" --oneline
```

## 🚀 Workflow Recomendado para SpeakFuel

### Desarrollo Diario
1. **Siempre** trabajar desde `develop`
2. **Una rama por feature** (ej: `feature/lesson-navigation`)
3. **Commits frecuentes** con mensajes descriptivos
4. **Pull Requests** para review de código
5. **Testing** antes de merge a `develop`

### Deploy a Producción
1. **Testing completo** en `develop`
2. **Merge** `develop` → `main`
3. **Tag** la versión
4. **Deploy** desde `main`
5. **Hotfixes** solo si es crítico

## 🛡️ Protección de Ramas

### Configuración Recomendada en GitHub
- **`main`**: Require PR, require reviews, no force push
- **`develop`**: Require PR (opcional para solo desarrollador)

### Comandos de Protección Local
```bash
# Alias útiles en ~/.gitconfig
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = !gitk
```

---

**💡 Tip:** Para equipos pequeños, puedes omitir PRs en `develop` y hacer merge directo, pero **siempre** usa PR para `main`. 