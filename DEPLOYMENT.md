# 🚀 DEPLOYMENT GUIDE

## Opțiuni de Deployment

### 🎯 Opțiune 1: VPS (RECOMANDAT pentru SQLite)

Ideal pentru: DigitalOcean, Linode, Hetzner, sau orice VPS cu Node.js

#### Pași:

**1. Pregătește Serverul**
```bash
# SSH în server
ssh user@your-server-ip

# Instalează Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalează PM2 (process manager)
sudo npm install -g pm2
```

**2. Transferă Codul**
```bash
# Opțiune A: Git
git clone your-repo-url
cd wedaycom

# Opțiune B: SCP (din local)
scp -r wedaycom/ user@your-server-ip:/var/www/
```

**3. Setup Environment**
```bash
# Creează .env.local
nano .env.local

# Adaugă:
JWT_SECRET=your-very-long-random-secret-min-32-chars
DATABASE_PATH=./database/wedding.db
NODE_ENV=production
```

**4. Build și Deploy**
```bash
# Instalează dependențe
npm install

# Build producție
npm run build

# Pornește cu PM2
pm2 start npm --name "wedding-site" -- start

# Salvează configurația PM2
pm2 save
pm2 startup
```

**5. Setup Nginx (Reverse Proxy)**
```bash
sudo apt-get install nginx

# Creează configurație
sudo nano /etc/nginx/sites-available/wedding

# Adaugă:
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activează site
sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**6. Setup SSL (HTTPS)**
```bash
# Instalează Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obține certificat SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**7. Auto-restart pe reboot**
```bash
pm2 startup
pm2 save
```

✅ **GATA!** Site-ul rulează pe https://your-domain.com

---

### 🌐 Opțiune 2: Vercel (cu Limitări)

⚠️ **IMPORTANT:** Vercel are limitări cu SQLite. Trebuie să migrezi la Turso sau Vercel Postgres.

#### Migrare la Turso (SQLite Cloud)

**1. Creează cont Turso**
```bash
# Instalează Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Creează database
turso db create wedding-db

# Obține URL-ul
turso db show wedding-db
```

**2. Update Code pentru Turso**
```bash
npm install @libsql/client
```

**3. Modifică `src/lib/db/index.ts`**
```typescript
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export function getDatabase() {
  return client;
}
```

**4. Deploy pe Vercel**
```bash
# Instalează Vercel CLI
npm i -g vercel

# Login
vercel login

# Adaugă environment variables
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add JWT_SECRET

# Deploy
vercel deploy --prod
```

---

### 🐳 Opțiune 3: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  wedding-app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./database:/app/database
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    restart: unless-stopped
```

**Run:**
```bash
docker-compose up -d
```

---

## 🔐 Securitate Pre-Deployment

### 1. Schimbă JWT Secret
```env
# .env.local sau .env.production
JWT_SECRET=generate-a-very-long-random-string-here-min-32-chars
```

Generează unul:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Schimbă Parola Admin
- Login la `/admin/login`
- Du-te la Settings (dacă există) sau direct în database:
```bash
# Generează hash nou
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('NouaParola123!', 12))"

# Update în database
sqlite3 database/wedding.db
UPDATE admin SET password_hash = 'hash-ul-generat' WHERE id = 1;
.quit
```

### 3. Setup Rate Limiting în Producție
Deja implementat! Verifică că funcționează:
- Max 5 încercări login / 15 minute

### 4. Backup Database
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp database/wedding.db backups/wedding_$DATE.db

# Add to crontab (daily backup)
0 2 * * * /path/to/backup-script.sh
```

---

## 📊 Monitorizare

### PM2 Monitoring
```bash
# Vezi status
pm2 status

# Vezi logs
pm2 logs wedding-site

# Monitoring dashboard
pm2 monit

# Restart dacă e nevoie
pm2 restart wedding-site
```

### Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

---

## 🎯 Performance Optimization

### 1. Enable Caching
Nginx config:
```nginx
location /_next/static/ {
    alias /var/www/wedding/.next/static/;
    expires 365d;
    access_log off;
}

location /images/ {
    alias /var/www/wedding/public/images/;
    expires 30d;
    access_log off;
}
```

### 2. Compress Assets
```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 3. Database Optimization
```bash
# Vacuum database periodic
sqlite3 database/wedding.db "VACUUM;"
```

---

## 🔄 Updates & Maintenance

### Update Code
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart
pm2 restart wedding-site
```

### Database Migrations
```bash
# Backup first!
cp database/wedding.db database/wedding.db.backup

# Run migrations (if any)
# Then restart app
```

---

## 📱 Custom Domain

### 1. Buy Domain
- Namecheap, GoDaddy, etc.

### 2. Point DNS to VPS
```
A Record:  @  →  your-vps-ip
A Record:  www  →  your-vps-ip
```

### 3. Update Nginx Config
```nginx
server_name yourdomain.com www.yourdomain.com;
```

### 4. Get SSL
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ✅ Deployment Checklist

Pre-Deployment:
- [ ] JWT_SECRET schimbat
- [ ] Parola admin schimbată
- [ ] Toate datele actualizate
- [ ] Imagini reale încărcate
- [ ] Testat local (npm run build && npm start)
- [ ] Database backup creat

Deployment:
- [ ] Cod încărcat pe server
- [ ] Dependencies instalate
- [ ] Build făcut
- [ ] PM2 configurat
- [ ] Nginx configurat
- [ ] SSL activat
- [ ] Domain pointat

Post-Deployment:
- [ ] Testat toate funcțiile
- [ ] RSVP form funcționează
- [ ] Admin panel accesibil
- [ ] Backup automat configurat
- [ ] Monitoring activ

---

## 🆘 Common Issues

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill -9
# sau
pm2 delete all
```

**Database locked:**
```bash
pm2 stop wedding-site
rm database/*.db-wal database/*.db-shm
pm2 start wedding-site
```

**Nginx 502 Bad Gateway:**
```bash
# Check if app is running
pm2 status

# Check Nginx config
sudo nginx -t

# Restart both
pm2 restart wedding-site
sudo systemctl restart nginx
```

---

## 📞 Support

**Logs Location:**
- App: `pm2 logs wedding-site`
- Nginx: `/var/log/nginx/error.log`
- Database: `database/wedding.db`

**Quick Health Check:**
```bash
curl http://localhost:3000
curl https://yourdomain.com
```

---

**Ready to deploy? Follow the VPS guide for best results!** 🚀
