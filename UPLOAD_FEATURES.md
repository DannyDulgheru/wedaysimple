# Actualizări Admin Panel - File Upload și Input Fields

## Modificări Implementate

### 1. **Pagina Secțiuni (Admin Sections)**
- ✅ **Înlocuit editor JSON** cu inputuri individuale pentru fiecare câmp
- ✅ **File upload** pentru toate câmpurile de tip imagine/video cu buton "Upload"
- ✅ **Preview automat** pentru imagini și video-uri încărcate
- ✅ **Buton de ștergere** pentru fiecare fișier din preview
- ✅ **Detecție automată** a tipului de câmp:
  - Câmpuri cu `image`, `photo`, `Photo`, `Image`, `backgroundImage` → Input text + Upload + Preview
  - Câmpuri cu `description`, `message`, `bio`, `text` → Textarea
  - Obiecte și array-uri → JSON editor cu textarea
  - Câmpuri simple → Input text standard

**Funcționalități:**
- Click pe "Upload" pentru a selecta fișier de pe computer
- Preview instant după încărcare
- Poți șterge preview-ul și reîncărca alt fișier
- Salvare automată a path-ului fișierului în baza de date

### 2. **Pagina Galerie (Admin Gallery)**
- ✅ **Înlocuit input URL** cu file upload
- ✅ **Multi-file selection** - selectează mai multe imagini/video-uri deodată
- ✅ **Grid preview** pentru toate fișierele selectate
- ✅ **Upload batch** - încarcă toate fișierele selectate cu un click
- ✅ **Video preview** pentru fișiere video

**Funcționalități:**
- Selectează multiple fișiere dintr-o dată
- Preview imediat pentru toate fișierele selectate
- Buton "Adaugă" pentru upload batch
- Buton "Anulează" pentru a șterge selecția
- Counter pentru numărul de fișiere selectate

### 3. **API Upload Endpoint (`/api/upload`)**
- ✅ **POST endpoint** pentru încărcare fișiere
- ✅ **Validare tip fișier**:
  - Imagini: JPG, PNG, GIF, WebP, SVG
  - Video: MP4, WebM, OGG
- ✅ **Validare mărime**: Max 10MB per fișier
- ✅ **Nume unic**: Timestamp + nume original sanitizat
- ✅ **Stocare** în `/public/uploads/`
- ✅ **Protecție autentificare**: Doar admin autentificat poate încărca

**Response Format:**
```json
{
  "success": true,
  "filePath": "/uploads/1234567890_photo.jpg",
  "fileName": "1234567890_photo.jpg",
  "fileSize": 123456,
  "fileType": "image/jpeg"
}
```

### 4. **Middleware Actualizat**
- ✅ **withAuth** actualizat pentru a accepta `NextRequest` ca parametru
- ✅ **Toate rutele API** actualizate pentru a folosi noul pattern:
  - `/api/sections` (PUT)
  - `/api/design` (PUT)
  - `/api/gallery` (GET, POST, DELETE)
  - `/api/rsvp` (GET, DELETE)
  - `/api/upload` (POST - NOU)

### 5. **Structură Fișiere**
```
/public/uploads/          # Folder pentru fișiere încărcate
  .gitkeep               # Păstrează folder-ul în git
  [fișiere upload]       # Ignorate de git

/src/app/api/upload/
  route.ts               # Endpoint nou pentru upload

.gitignore               # Actualizat pentru a ignora uploads
```

### 6. **Securitate**
- ✅ Doar admin autentificat poate încărca fișiere
- ✅ Validare strictă a tipului de fișier (MIME type)
- ✅ Limite de mărime (10MB)
- ✅ Sanitizare nume fișier
- ✅ Protecție împotriva path traversal
- ✅ Upload folder separat de surse

## Cum se Folosește

### Editare Secțiune:
1. Navighează la **Admin → Secțiuni**
2. Click pe **"Editează Conținut"** pentru secțiunea dorită
3. Modifică textele în input-urile afișate
4. Pentru imagini:
   - Poți scrie manual un URL în input
   - SAU click pe **"Upload"** și selectezi fișier
   - Preview-ul apare automat după încărcare
5. Click **"Salvează"**

### Adăugare Imagini în Galerie:
1. Navighează la **Admin → Galerie**
2. Click pe **"Selectează Fișiere"**
3. Selectează una sau mai multe imagini/video-uri
4. Preview-urile apar imediat
5. Click **"Adaugă"** pentru upload
6. Toate imaginile sunt adăugate în galerie

## Tipuri de Câmpuri Suportate

### În Secțiuni:
- **Text simplu**: `name`, `title`, `location`, `date`, etc.
- **Text lung**: `description`, `message`, `bio`, `text`
- **Imagini/Video**: `image`, `photo`, `Image`, `Photo`, `backgroundImage`
- **Structuri complexe**: `timeline`, `hotels`, `faqs` (JSON editor)

### Exemplu Câmpuri Secțiune "Hero":
```typescript
{
  "groomName": "Ion",           // Input text
  "brideName": "Maria",         // Input text
  "weddingDate": "2024-07-20",  // Input text
  "location": "București",      // Input text
  "backgroundImage": "/..."     // Input text + Upload + Preview
}
```

## Fișiere Modificate

1. **`src/app/admin/(protected)/sections/page.tsx`** - UI nou cu input fields
2. **`src/app/admin/(protected)/gallery/page.tsx`** - File upload cu preview
3. **`src/app/api/upload/route.ts`** - Endpoint nou pentru upload
4. **`src/lib/auth/middleware.ts`** - Actualizat withAuth pentru request
5. **`src/app/api/sections/route.ts`** - Pattern nou pentru withAuth
6. **`src/app/api/design/route.ts`** - Pattern nou pentru withAuth
7. **`src/app/api/gallery/route.ts`** - Pattern nou pentru withAuth
8. **`src/app/api/rsvp/route.ts`** - Pattern nou pentru withAuth
9. **`.gitignore`** - Adăugat `/public/uploads/*`
10. **`public/uploads/.gitkeep`** - Păstrează folder-ul

## Testare

### Test Upload Secțiune:
1. Login admin → Secțiuni
2. Editează "Hero"
3. Click Upload pe "Background Image"
4. Selectează o imagine
5. Verifică preview-ul
6. Salvează
7. Refresh pagina principală → imaginea apare

### Test Upload Galerie:
1. Login admin → Galerie
2. Click "Selectează Fișiere"
3. Alege 3-5 imagini
4. Verifică preview grid
5. Click "Adaugă"
6. Verifică că imaginile apar în galerie
7. Refresh pagina principală → imaginile apar în secțiunea Gallery

## Note Tehnice

- **Mărime max fișier**: 10MB
- **Formate acceptate**: JPG, PNG, GIF, WebP, SVG, MP4, WebM, OGG
- **Folder upload**: `/public/uploads/` (accesibil public)
- **Nume fișiere**: `timestamp_nume_original.ext`
- **Autentificare**: Obligatorie pentru upload
- **Database**: Path-ul fișierului se salvează în `content_json`

## Avantaje

✅ **UX îmbunătățit** - nu mai e nevoie de cunoștințe JSON  
✅ **Upload simplu** - drag & drop sau click  
✅ **Preview instant** - vezi imaginea înainte de salvare  
✅ **Batch upload** - încarcă mai multe fișiere deodată  
✅ **Validare strictă** - doar fișiere sigure  
✅ **Mobile friendly** - funcționează pe telefon  
✅ **Type detection** - câmpurile potrivite pentru fiecare tip de date  

## Erori Comune

❌ **"Tipul fișierului nu este permis"**  
→ Folosește doar JPG, PNG, GIF, WebP, SVG, MP4, WebM, OGG

❌ **"Fișierul este prea mare"**  
→ Comprimă imaginea sub 10MB

❌ **"Unauthorized"**  
→ Login din nou în admin panel

❌ **"Eroare la încărcarea fișierului"**  
→ Verifică permisiunile folder-ului `/public/uploads/`
