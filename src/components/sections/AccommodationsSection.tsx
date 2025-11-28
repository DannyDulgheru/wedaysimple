'use client';

import { motion } from 'framer-motion';
import { FaHotel, FaExternalLinkAlt } from 'react-icons/fa';

interface AccommodationsProps {
  content: {
    heading: string;
    hotels: Array<{
      name: string;
      distance: string;
      link: string;
      priceRange: string;
    }>;
  };
}

export function AccommodationsSection({ content }: AccommodationsProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {content.heading}
          </h2>
          <div className="w-24 h-1 bg-[#D4A5A5] mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {content.hotels.map((hotel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#FFF8F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <FaHotel className="text-4xl text-[#D4A5A5] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
              <p className="text-gray-600 mb-2">{hotel.distance}</p>
              <p className="text-[#B8860B] font-semibold mb-4">{hotel.priceRange}</p>
              <a
                href={hotel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#D4A5A5] hover:text-[#B8860B] transition-colors"
              >
                Vezi detalii <FaExternalLinkAlt className="text-sm" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
