'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

interface ReceptionProps {
  content: {
    time: string;
    venue: string;
    address: string;
    specialInstructions: string;
  };
}

export function ReceptionSection({ content }: ReceptionProps) {
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
            Recepția
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-accent p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-3xl font-semibold mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              {content.venue}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaClock className="text-primary text-2xl mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Ora</p>
                  <p className="text-gray-700">{content.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-primary text-2xl mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Adresă</p>
                  <p className="text-gray-700">{content.address}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg mt-6">
                <p className="text-gray-700">{content.specialInstructions}</p>
              </div>
            </div>

            <div className="mt-8">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.address)}&output=embed`}
                width="100%"
                height="300"
                className="rounded-lg"
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
