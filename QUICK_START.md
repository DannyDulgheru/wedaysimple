# 🚀 QUICK START GUIDE

## ✅ Aplicația este GATA și FUNCȚIONALĂ!

Serverul de dezvoltare rulează la: **http://localhost:3000**

---

## 📍 Accesează Aplicația

### 1️⃣ Landing Page Public
**URL:** http://localhost:3000

**Ce vei vedea:**
- Hero section cu numărătoare inversă
- 13 secțiuni complete cu date demo
- Design elegant Blush & Gold
- Animații fluide
- Formular RSVP funcțional

### 2️⃣ Panou de Administrare
**URL:** http://localhost:3000/admin/login

**Credențiale:**
- **Parolă:** `Admin123!`

**După autentificare, vei avea acces la:**
- Dashboard cu statistici
- Editor secțiuni
- Setări design
- Gestionare RSVP
- Gestionare galerie

---

## 🎯 PRIMUL PAS: Personalizează Conținutul

### 1. Autentifică-te în Admin
```
http://localhost:3000/admin/login
Parolă: Admin123!
```

### 2. Editează Datele Mirilor
- Accesează **Secțiuni** din sidebar
- Găsește secțiunea "Hero"
- Click pe "Editează Conținut"
- Modifică JSON-ul:
```json
{
  "brideName": "Maria",  ← Schimbă cu numele miresei
  "groomName": "Ion",    ← Schimbă cu numele mirelui
  "weddingDate": "2026-06-15",  ← Data nuntei (YYYY-MM-DD)
  "location": "Chișinău, Moldova",
  "backgroundImage": "/images/hero-bg.jpg"
}
```
- Click **Salvează**

### 3. Editează Povestea Voastră
- Secțiunea "Our Story"
- Modifică heading și description
- Adaugă evenimente în timeline

### 4. Actualizează Detaliile Ceremoniei
- Secțiunea "Ceremony"
- Modifică data, ora, locația
- Adresa va apărea automat pe Google Maps

### 5. Personalizează Culorile
- Accesează **Design** din sidebar
- Schimbă culorile cu color picker:
  - Primary Color (culoarea principală)
  - Secondary Color (culoarea secundară)
  - Accent Color (culoarea accent)
- Salvează automat la blur

---

## 🖼️ ADAUGĂ IMAGINILE TALE

### Metoda 1: Adaugă Manual
1. Copiază imaginile în `c:\Users\Admin\Downloads\copilot\wedaycom\public\images\`
2. Numește-le clar: `bride.jpg`, `groom.jpg`, `photo1.jpg`, etc.

### Metoda 2: Prin Admin Panel
1. Accesează **Galerie** din admin
2. Adaugă URL-ul: `/images/numele-imaginii.jpg`
3. Click **Adaugă**

### Imagini Recomandate:
- **Hero Background** (1920x1080px): `/images/hero-bg.jpg`
- **Bride Photo** (800x800px): `/images/bride.jpg`
- **Groom Photo** (800x800px): `/images/groom.jpg`
- **Galerie** (min 1200x800px): `/images/photo1.jpg`, etc.

---

## 👀 ASCUNDE/ARATĂ SECȚIUNI

1. Accesează **Secțiuni** din admin
2. Folosește switch-ul "Vizibil/Ascuns" lângă fiecare secțiune
3. Secțiunile ascunse nu vor apărea pe landing page

**Exemplu:** Dacă nu vrei secțiunea "Accommodations":
- Toggle OFF switch-ul de vizibilitate
- Reîmprospătează landing page-ul

---

## 📊 VEZI RSVP-URILE

1. Accesează **RSVP** din admin
2. Vezi statistici:
   - Total confirmări
   - Număr participanți
   - Status (Da/Nu/Poate)
3. Click pe **👁️** pentru detalii complete
4. Exportă lista în CSV cu butonul **Export CSV**

---

## 🎨 SCHEME DE CULORI RAPIDE

### Blush & Gold (Curent)
```
Primary: #D4A5A5
Secondary: #B8860B
Accent: #FFF8F0
```

### Sage Green & Ivory
```
Primary: #8FA888
Secondary: #C9B79C
Accent: #FFFEF9
```

### Navy & Blush
```
Primary: #1C3D5A
Secondary: #F7B5CA
Accent: #F9F6F2
```

Schimbă din **Admin → Design**

---

## 🔧 COMENZI UTILE

### Oprește Serverul
`Ctrl + C` în terminal

### Repornește Serverul
```bash
npm run dev
```

### Verifică Erori
```bash
npm run build
```

### Vezi Database
Folosește un SQLite viewer pentru `./database/wedding.db`

---

## ❓ TROUBLESHOOTING

### Imaginile nu se încarcă?
- Verifică path-ul: `/images/nume.jpg` (cu slash la început)
- Verifică dacă fișierul există în `public/images/`
- Reîmprospătează pagina (Ctrl + F5)

### Modificările nu apar?
- Reîmprospătează cu Ctrl + F5 (hard refresh)
- Verifică că ai salvat în admin
- Verifică console pentru erori (F12)

### Database locked?
```bash
# Oprește serverul (Ctrl + C)
# Șterge fișierele WAL
rm database/*.db-wal database/*.db-shm
# Repornește
npm run dev
```

---

## 📝 CHECKLIST ÎNAINTE DE DEPLOY

- [ ] Am schimbat numele mirilor
- [ ] Am actualizat data nuntei
- [ ] Am adăugat imaginile reale
- [ ] Am editat adresele locațiilor
- [ ] Am testat formularul RSVP
- [ ] Am personalizat culorile
- [ ] Am actualizat toate secțiunile
- [ ] Am schimbat parola admin
- [ ] Am ascuns secțiunile nedorite
- [ ] Am adăugat FAQ-urile relevante

---

## 🎉 GATA DE FOLOSIT!

Aplicația este **100% funcțională** cu:
- ✅ 13 secțiuni complete
- ✅ Design modern și responsive
- ✅ Panou admin securizat
- ✅ RSVP funcțional
- ✅ Galerie foto
- ✅ Toate datele în SQLite

**Urmează:** Personalizează conținutul și adaugă imaginile tale!

---

**Need help?** Verifică `README.md` pentru documentație completă.

**Enjoy your special day! 💒❤️**
