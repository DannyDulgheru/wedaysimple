export const GOOGLE_FONTS = [
  // Serif Fonts - Elegant, pentru titluri
  { name: 'Playfair Display', category: 'serif', popular: true },
  { name: 'Merriweather', category: 'serif', popular: true },
  { name: 'Lora', category: 'serif', popular: true },
  { name: 'Crimson Text', category: 'serif' },
  { name: 'EB Garamond', category: 'serif', popular: true },
  { name: 'Cormorant Garamond', category: 'serif' },
  { name: 'Libre Baskerville', category: 'serif' },
  { name: 'Old Standard TT', category: 'serif' },
  { name: 'Cardo', category: 'serif' },
  { name: 'Spectral', category: 'serif' },
  
  // Sans-serif Fonts - Modern, pentru text
  { name: 'Montserrat', category: 'sans-serif', popular: true },
  { name: 'Open Sans', category: 'sans-serif', popular: true },
  { name: 'Roboto', category: 'sans-serif', popular: true },
  { name: 'Lato', category: 'sans-serif', popular: true },
  { name: 'Poppins', category: 'sans-serif', popular: true },
  { name: 'Raleway', category: 'sans-serif', popular: true },
  { name: 'Inter', category: 'sans-serif', popular: true },
  { name: 'Work Sans', category: 'sans-serif' },
  { name: 'Nunito', category: 'sans-serif' },
  { name: 'Josefin Sans', category: 'sans-serif' },
  { name: 'Quicksand', category: 'sans-serif' },
  { name: 'Barlow', category: 'sans-serif' },
  
  // Handwriting/Script Fonts - Pentru design elegant
  { name: 'Great Vibes', category: 'handwriting', popular: true },
  { name: 'Pacifico', category: 'handwriting', popular: true },
  { name: 'Dancing Script', category: 'handwriting', popular: true },
  { name: 'Allura', category: 'handwriting' },
  { name: 'Alex Brush', category: 'handwriting' },
  { name: 'Satisfy', category: 'handwriting' },
  { name: 'Sacramento', category: 'handwriting' },
  { name: 'Pinyon Script', category: 'handwriting' },
  { name: 'Tangerine', category: 'handwriting' },
  { name: 'Courgette', category: 'handwriting' },
  { name: 'Amatic SC', category: 'handwriting' },
  { name: 'Cookie', category: 'handwriting' },
  { name: 'Petit Formal Script', category: 'handwriting' },
  { name: 'Kaushan Script', category: 'handwriting' },
  
  // Display Fonts - Pentru accente
  { name: 'Cinzel', category: 'display' },
  { name: 'Abril Fatface', category: 'display' },
  { name: 'Bebas Neue', category: 'display' },
  { name: 'Righteous', category: 'display' },
];

// Generate Google Fonts URL
export function getGoogleFontsUrl(fonts: string[]): string {
  const fontFamilies = fonts
    .map(font => font.replace(/ /g, '+'))
    .map(font => `family=${font}:wght@300;400;500;600;700`)
    .join('&');
  
  return `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`;
}

// Get fonts by category
export function getFontsByCategory(category: string) {
  return GOOGLE_FONTS.filter(font => font.category === category);
}

// Get popular fonts
export function getPopularFonts() {
  return GOOGLE_FONTS.filter(font => font.popular);
}
