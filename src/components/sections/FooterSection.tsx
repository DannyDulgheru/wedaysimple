'use client';

import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaHeart } from 'react-icons/fa';

interface FooterProps {
  content: {
    thankYouMessage: string;
    hashtag: string;
    contactEmail: string;
  };
}

export function FooterSection({ content }: FooterProps) {
  return (
    <footer className="py-16 bg-[#2C2C2C] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <FaHeart className="text-4xl text-[#D4A5A5] mx-auto mb-6" />
          <p className="text-2xl mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            {content.thankYouMessage}
          </p>
          
          <div className="mb-8">
            <p className="text-3xl mb-2" style={{ fontFamily: 'Great Vibes, cursive' }}>
              {content.hashtag}
            </p>
            <p className="text-gray-400">Folosește hashtag-ul nostru când postezi!</p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <a
              href="#"
              className="text-3xl hover:text-[#D4A5A5] transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-3xl hover:text-[#D4A5A5] transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
          </div>

          <div className="text-sm text-gray-400">
            <p>Întrebări? Contactează-ne la:</p>
            <a
              href={`mailto:${content.contactEmail}`}
              className="text-[#D4A5A5] hover:text-white transition-colors"
            >
              {content.contactEmail}
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} - Toate drepturile rezervate</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
