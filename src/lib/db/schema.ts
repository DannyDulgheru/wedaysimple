import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

export function initializeDatabase(db: Database.Database) {
  // Admin credentials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sections configuration table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_key TEXT UNIQUE NOT NULL,
      section_title TEXT NOT NULL,
      is_visible BOOLEAN DEFAULT 1,
      display_order INTEGER NOT NULL,
      content_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Design settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS design_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT NOT NULL,
      setting_category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // RSVP responses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rsvp_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      number_of_guests INTEGER DEFAULT 1,
      attendance_status TEXT CHECK(attendance_status IN ('yes', 'no', 'maybe')) NOT NULL,
      meal_preference TEXT,
      dietary_restrictions TEXT,
      song_requests TEXT,
      message TEXT,
      plus_one_name TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT
    )
  `);

  // Gallery images table
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      image_alt TEXT,
      category TEXT,
      display_order INTEGER,
      is_visible BOOLEAN DEFAULT 1,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Wedding party members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wedding_party (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      category TEXT NOT NULL,
      photo_url TEXT,
      description TEXT,
      social_link TEXT,
      display_order INTEGER,
      is_visible BOOLEAN DEFAULT 1
    )
  `);

  // Timeline events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS timeline_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_title TEXT NOT NULL,
      event_date TEXT NOT NULL,
      event_description TEXT,
      event_image_url TEXT,
      display_order INTEGER,
      is_visible BOOLEAN DEFAULT 1
    )
  `);

  // FAQ items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS faq_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      display_order INTEGER,
      is_visible BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sections_visible ON sections(is_visible, display_order);
    CREATE INDEX IF NOT EXISTS idx_rsvp_submitted ON rsvp_responses(submitted_at DESC);
    CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_images(display_order, is_visible);
  `);

  // Seed initial data
  seedInitialData(db);
}

function seedInitialData(db: Database.Database) {
  // Check if admin exists
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin').get() as { count: number };
  
  if (adminCount.count === 0) {
    // Create default admin with password "Admin123!"
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123!';
    const passwordHash = bcrypt.hashSync(defaultPassword, 12);
    db.prepare('INSERT INTO admin (password_hash) VALUES (?)').run(passwordHash);
  }

  // Check if design settings exist
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM design_settings').get() as { count: number };
  
  if (settingsCount.count === 0) {
    const defaultSettings = [
      { key: 'primary_color', value: '#D4A5A5', category: 'colors' },
      { key: 'secondary_color', value: '#B8860B', category: 'colors' },
      { key: 'accent_color', value: '#FFF8F0', category: 'colors' },
      { key: 'text_color', value: '#2C2C2C', category: 'colors' },
      { key: 'heading_font', value: 'Playfair Display', category: 'typography' },
      { key: 'body_font', value: 'Montserrat', category: 'typography' },
      { key: 'script_font', value: 'Great Vibes', category: 'typography' },
      { key: 'hero_image', value: '/images/hero-default.jpg', category: 'images' },
    ];

    const stmt = db.prepare('INSERT INTO design_settings (setting_key, setting_value, setting_category) VALUES (?, ?, ?)');
    for (const setting of defaultSettings) {
      stmt.run(setting.key, setting.value, setting.category);
    }
  }

  // Check if sections exist
  const sectionsCount = db.prepare('SELECT COUNT(*) as count FROM sections').get() as { count: number };
  
  if (sectionsCount.count === 0) {
    const defaultSections = [
      {
        key: 'hero',
        title: 'Hero',
        order: 1,
        visible: 1,
        content: JSON.stringify({
          brideName: 'Maria',
          groomName: 'Ion',
          weddingDate: '2026-06-15',
          location: 'Chișinău, Moldova',
          backgroundImage: '/images/hero-bg.jpg'
        })
      },
      {
        key: 'couple_intro',
        title: 'Couple Introduction',
        order: 2,
        visible: 1,
        content: JSON.stringify({
          bridePhoto: '/images/bride.jpg',
          groomPhoto: '/images/groom.jpg',
          brideBio: 'O persoană minunată, plină de viață și dragoste.',
          groomBio: 'Un bărbat minunat, plin de umor și grijă.',
        })
      },
      {
        key: 'our_story',
        title: 'Our Story',
        order: 3,
        visible: 1,
        content: JSON.stringify({
          heading: 'Povestea Noastră de Dragoste',
          description: 'O poveste de dragoste care a început într-o zi de vară...'
        })
      },
      {
        key: 'ceremony',
        title: 'Ceremony Details',
        order: 4,
        visible: 1,
        content: JSON.stringify({
          date: '2026-06-15',
          time: '14:00',
          venue: 'Biserica Sfântul Nicolae',
          address: 'Str. Ștefan cel Mare 123, Chișinău',
          dressCode: 'Formal / Cocktail',
          parking: 'Parcare disponibilă în spate'
        })
      },
      {
        key: 'reception',
        title: 'Reception Details',
        order: 5,
        visible: 1,
        content: JSON.stringify({
          time: '18:00',
          venue: 'Restaurant Nobil',
          address: 'Str. Alexandru cel Bun 45, Chișinău',
          specialInstructions: 'Recepția va începe cu cocktail'
        })
      },
      {
        key: 'schedule',
        title: 'Wedding Schedule',
        order: 6,
        visible: 1,
        content: JSON.stringify({
          events: [
            { time: '14:00', title: 'Ceremonia', description: 'Biserica Sfântul Nicolae' },
            { time: '16:00', title: 'Sesiune Foto', description: 'Parcul Central' },
            { time: '18:00', title: 'Cocktail', description: 'Restaurant Nobil' },
            { time: '19:30', title: 'Cina', description: 'Meniul festiv' },
            { time: '21:00', title: 'Dans și Petrecere', description: 'DJ Live' }
          ]
        })
      },
      {
        key: 'wedding_party',
        title: 'Wedding Party',
        order: 7,
        visible: 1,
        content: JSON.stringify({
          nasiHeading: 'Nașii Noștri',
          martoriHeading: 'Martorii Noștri'
        })
      },
      {
        key: 'gallery',
        title: 'Photo Gallery',
        order: 8,
        visible: 1,
        content: JSON.stringify({
          heading: 'Momentele Noastre',
          description: 'Amintiri frumoase din perioada logodnei'
        })
      },
      {
        key: 'accommodations',
        title: 'Accommodations',
        order: 9,
        visible: 1,
        content: JSON.stringify({
          heading: 'Unde să te cazezi',
          hotels: [
            {
              name: 'Hotel Radisson Blu',
              distance: '2 km de locație',
              link: 'https://example.com',
              priceRange: '€€€'
            }
          ]
        })
      },
      {
        key: 'registry',
        title: 'Registry',
        order: 10,
        visible: 1,
        content: JSON.stringify({
          heading: 'Cadouri',
          message: 'Prezența voastră este cel mai mare cadou! Dacă doriți să ne oferiți ceva, apreciem contribuții pentru luna de miere.',
          registryLinks: []
        })
      },
      {
        key: 'rsvp',
        title: 'RSVP',
        order: 11,
        visible: 1,
        content: JSON.stringify({
          heading: 'Confirmă Prezența',
          description: 'Vă rugăm să confirmați prezența până pe 1 Mai 2026',
          deadline: '2026-05-01'
        })
      },
      {
        key: 'faq',
        title: 'FAQ',
        order: 12,
        visible: 1,
        content: JSON.stringify({
          heading: 'Întrebări Frecvente'
        })
      },
      {
        key: 'footer',
        title: 'Footer',
        order: 13,
        visible: 1,
        content: JSON.stringify({
          thankYouMessage: 'Vă mulțumim pentru dragostea și sprijinul vostru!',
          hashtag: '#MariaȘiIon2026',
          contactEmail: 'contact@wedding.com'
        })
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO sections (section_key, section_title, display_order, is_visible, content_json) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    for (const section of defaultSections) {
      stmt.run(section.key, section.title, section.order, section.visible, section.content);
    }
  }

  // Seed some sample timeline events
  const timelineCount = db.prepare('SELECT COUNT(*) as count FROM timeline_events').get() as { count: number };
  
  if (timelineCount.count === 0) {
    const timelineEvents = [
      {
        title: 'Prima Întâlnire',
        date: '2020-07-15',
        description: 'Ne-am întâlnit pentru prima dată într-o cafenea din centru.',
        order: 1
      },
      {
        title: 'Prima Vacanță',
        date: '2021-08-20',
        description: 'Prima noastră vacanță împreună la mare.',
        order: 2
      },
      {
        title: 'Logodna',
        date: '2024-12-25',
        description: 'Cel mai frumos Crăciun din viața noastră!',
        order: 3
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO timeline_events (event_title, event_date, event_description, display_order) 
      VALUES (?, ?, ?, ?)
    `);
    
    for (const event of timelineEvents) {
      stmt.run(event.title, event.date, event.description, event.order);
    }
  }

  // Seed some sample FAQ items
  const faqCount = db.prepare('SELECT COUNT(*) as count FROM faq_items').get() as { count: number };
  
  if (faqCount.count === 0) {
    const faqItems = [
      {
        question: 'Copiii sunt bine veniți?',
        answer: 'Da, copiii sunt bine veniți la nunta noastră! Vă rugăm să ne anunțați în formularul RSVP câți copii vor participa.',
        order: 1
      },
      {
        question: 'Care este codul vestimentar?',
        answer: 'Codul vestimentar este formal/cocktail. Vă rugăm să evitați culoarea albă, care este rezervată miresei.',
        order: 2
      },
      {
        question: 'Pot aduce un însoțitor (+1)?',
        answer: 'Dacă invitația dvs. include "+1", puteți aduce un însoțitor. Vă rugăm să specificați numele în formularul RSVP.',
        order: 3
      },
      {
        question: 'Există restricții alimentare?',
        answer: 'Vă rugăm să ne informați despre orice restricții alimentare sau alergii în formularul RSVP, iar noi vom asigura opțiuni adecvate.',
        order: 4
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO faq_items (question, answer, display_order) 
      VALUES (?, ?, ?)
    `);
    
    for (const item of faqItems) {
      stmt.run(item.question, item.answer, item.order);
    }
  }
}
