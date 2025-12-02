'use client';

import { motion } from 'framer-motion';
import { FaGift, FaHeart } from 'react-icons/fa';

interface RegistryProps {
  content: {
    heading: string;
    message: string;
    links: Array<{
      name: string;
      url: string;
    }>;
  };
}

export function RegistrySection({ content }: RegistryProps) {
  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {content.heading}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <FaHeart className="text-5xl text-primary mx-auto mb-6" />
          <p className="text-lg text-gray-700 leading-relaxed mb-8">{content.message}</p>

          {content.links && content.links.length > 0 && (
            <div className="space-y-4">
              {content.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <FaGift /> {link.name}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
