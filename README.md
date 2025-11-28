# 💒 Wedding Invitation Landing Page

Un site web modern și elegant pentru invitații de nuntă, cu panou de administrare complet funcțional.

## 🌟 Funcționalități

### Landing Page Public
- **13 Secțiuni Personalizabile:**
  - 🎉 Hero Section (cu numărătoare inversă)
  - 👫 Introducere Miri
  - 💕 Povestea Noastră (timeline evenimente)
  - ⛪ Detalii Ceremonie (cu hartă Google Maps)
  - 🎊 Detalii Recepție
  - ⏰ Program Nuntă
  - 👥 Nași și Martori
  - 📸 Galerie Foto (cu lightbox)
  - 🏨 Cazare
  - 🎁 Registry/Cadouri
  - ✉️ Formular RSVP
  - ❓ FAQ (Întrebări Frecvente)
  - 👋 Footer

### Panou de Administrare
- 🔐 **Autentificare securizată** cu parolă (JWT + bcrypt)
- 📊 **Dashboard** cu statistici RSVP în timp real
- ✏️ **Editor Secțiuni** - editează conținutul tuturor secțiunilor
- 👁️ **Toggle Vizibilitate** - ascunde/arată secțiuni
- 🎨 **Personalizare Design** - schimbă culori, fonturi, imagini
- 📋 **Gestionare RSVP** - vezi lista completă, exportă CSV
- 🖼️ **Gestionare Galerie** - adaugă/șterge imagini

## 🚀 Instalare Rapidă

```bash
# 1. Instalează dependențele
npm install

# 2. Pornește serverul de dezvoltare
npm run dev

# 3. Accesează aplicația
# Landing Page: http://localhost:3000
# Panou Admin: http://localhost:3000/admin/login
```

## 🔐 Autentificare Admin

**Parolă implicită:** `Admin123!`

⚠️ **IMPORTANT:** Schimbă această parolă după prima autentificare!

## 🛠️ Tehnologii Folosite

- **Framework:** Next.js 14+ (App Router)
- **Limbaj:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **Animații:** Framer Motion
- **Bază de Date:** SQLite (better-sqlite3)
- **Autentificare:** JWT (jose) + bcrypt
- **Validare:** Zod + React Hook Form
- **Icons:** React Icons
- **Notificări:** Sonner

## 📊 Baza de Date

Fișier: `./database/wedding.db` (creat automat la prima rulare)

**Tabele:**
- `admin` - Credențiale admin
- `sections` - Conținut secțiuni (13 secțiuni pre-populate)
- `design_settings` - Culori, fonturi, imagini
- `rsvp_responses` - Confirmări prezență
- `gallery_images` - Galerie foto
- `wedding_party` - Nași și martori
- `timeline_events` - Evenimente poveste
- `faq_items` - Întrebări frecvente

## 🎨 Personalizare

### 1. Schimbă Culorile
- Accesează **Admin → Design**
- Modifică culorile cu color picker
- Salvează și reîmprospătează pagina

### 2. Editează Conținutul
- Accesează **Admin → Secțiuni**
- Editează JSON-ul fiecărei secțiuni
- Toggle vizibilitate pentru a ascunde secțiuni

### 3. Adaugă Imagini
- Încarcă în `/public/images/`
- Accesează **Admin → Galerie**
- Adaugă URL (ex: `/images/photo1.jpg`)

## 📝 Comenzi Disponibile

```bash
npm run dev      # Dezvoltare (port 3000)
npm run build    # Build producție
npm start        # Rulează build
npm run lint     # ESLint
```

## 🚀 Deployment

### Opțiune 1: VPS (Recomandat)
```bash
npm run build
npm start
# sau cu PM2: pm2 start npm --name wedding -- start
```

### Opțiune 2: Vercel
⚠️ Necesită migrare la Turso/Vercel Postgres pentru SQLite

## 🔒 Securitate

- ✅ Rate limiting (5 încercări / 15 min)
- ✅ Parole hashate (bcrypt, 12 rounds)
- ✅ JWT în httpOnly cookies
- ✅ CSRF & XSS protection
- ✅ SQL injection protection
- ✅ Validare server-side

## 📧 RSVP Features

Formularul colectează:
- Nume, email, telefon
- Status participare (Da/Nu/Poate)
- Număr invitați
- Preferință meniu
- Restricții alimentare
- Cereri muzicale
- Mesaj pentru miri

**Export:** CSV din panoul admin

## 🎉 Ready to Use!

✅ Date demo pre-populate  
✅ Design modern Blush & Gold  
✅ Panou admin funcțional  
✅ Toate secțiunile implementate  
✅ RSVP funcțional  

**Pasul următor:** Personalizează din panoul admin!

---

**Made with ❤️ for your special day!**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
