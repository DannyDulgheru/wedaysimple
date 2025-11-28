import { getDatabase } from './index';

// Section queries
export function getAllSections() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM sections ORDER BY display_order ASC').all();
}

export function getVisibleSections() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM sections WHERE is_visible = 1 ORDER BY display_order ASC').all();
}

export function getSectionByKey(key: string) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM sections WHERE section_key = ?').get(key);
}

export function updateSection(id: number, data: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE sections 
    SET section_title = ?, is_visible = ?, display_order = ?, content_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(data.section_title, data.is_visible, data.display_order, data.content_json, id);
}

export function toggleSectionVisibility(id: number, isVisible: boolean) {
  const db = getDatabase();
  return db.prepare('UPDATE sections SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(isVisible ? 1 : 0, id);
}

// Design settings queries
export function getAllDesignSettings() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM design_settings').all();
}

export function getDesignSettingsByCategory(category: string) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM design_settings WHERE setting_category = ?').all(category);
}

export function updateDesignSetting(key: string, value: string) {
  const db = getDatabase();
  return db.prepare(`
    UPDATE design_settings 
    SET setting_value = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE setting_key = ?
  `).run(value, key);
}

// RSVP queries
export function getAllRSVPs() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM rsvp_responses ORDER BY submitted_at DESC').all();
}

export function getRSVPById(id: number) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM rsvp_responses WHERE id = ?').get(id);
}

export function createRSVP(data: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO rsvp_responses 
    (guest_name, email, phone, number_of_guests, attendance_status, meal_preference, dietary_restrictions, song_requests, message, plus_one_name, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.guest_name,
    data.email,
    data.phone || null,
    data.number_of_guests,
    data.attendance_status,
    data.meal_preference || null,
    data.dietary_restrictions || null,
    data.song_requests || null,
    data.message || null,
    data.plus_one_name || null,
    data.ip_address || null
  );
}

export function deleteRSVP(id: number) {
  const db = getDatabase();
  return db.prepare('DELETE FROM rsvp_responses WHERE id = ?').run(id);
}

export function getRSVPStats() {
  const db = getDatabase();
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN attendance_status = 'yes' THEN 1 ELSE 0 END) as attending,
      SUM(CASE WHEN attendance_status = 'no' THEN 1 ELSE 0 END) as not_attending,
      SUM(CASE WHEN attendance_status = 'maybe' THEN 1 ELSE 0 END) as maybe,
      SUM(CASE WHEN attendance_status = 'yes' THEN number_of_guests ELSE 0 END) as total_guests
    FROM rsvp_responses
  `).get();
  return stats;
}

// Gallery queries
export function getAllGalleryImages() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM gallery_images WHERE is_visible = 1 ORDER BY display_order ASC').all();
}

export function getAllGalleryImagesAdmin() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM gallery_images ORDER BY display_order ASC').all();
}

export function createGalleryImage(data: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO gallery_images (image_url, image_alt, category, display_order)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(data.image_url, data.image_alt || null, data.category || null, data.display_order || 999);
}

export function deleteGalleryImage(id: number) {
  const db = getDatabase();
  return db.prepare('DELETE FROM gallery_images WHERE id = ?').run(id);
}

export function updateGalleryImageOrder(id: number, order: number) {
  const db = getDatabase();
  return db.prepare('UPDATE gallery_images SET display_order = ? WHERE id = ?').run(order, id);
}

// Wedding party queries
export function getAllWeddingPartyMembers() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM wedding_party WHERE is_visible = 1 ORDER BY display_order ASC').all();
}

export function getAllWeddingPartyMembersAdmin() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM wedding_party ORDER BY display_order ASC').all();
}

// Timeline queries
export function getAllTimelineEvents() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM timeline_events WHERE is_visible = 1 ORDER BY display_order ASC').all();
}

export function getAllTimelineEventsAdmin() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM timeline_events ORDER BY display_order ASC').all();
}

// FAQ queries
export function getAllFAQs() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM faq_items WHERE is_visible = 1 ORDER BY display_order ASC').all();
}

export function getAllFAQsAdmin() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM faq_items ORDER BY display_order ASC').all();
}

// Admin queries
export function getAdminPasswordHash() {
  const db = getDatabase();
  const result = db.prepare('SELECT password_hash FROM admin LIMIT 1').get() as { password_hash: string } | undefined;
  return result?.password_hash;
}

export function updateAdminPassword(passwordHash: string) {
  const db = getDatabase();
  return db.prepare('UPDATE admin SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1').run(passwordHash);
}
