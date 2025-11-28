'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaParking } from 'react-icons/fa';

interface CeremonyProps {
  content: {
    date: string;
    time: string;
    venue: string;
    address: string;
    dressCode: string;
    parking: string;
  };
}

export function CeremonySection({ content }: CeremonyProps) {
  return (
    <section className="py-20 bg-[#FFF8F0]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ceremonia
          </h2>
          <div className="w-24 h-1 bg-[#D4A5A5] mx-auto"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-lg shadow-lg mb-8"
          >
            <h3 className="text-3xl font-semibold mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              {content.venue}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaClock className="text-[#D4A5A5] text-2xl mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Data și Ora</p>
                  <p className="text-gray-700">
                    {new Date(content.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })} la {content.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-[#D4A5A5] text-2xl mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Adresă</p>
                  <p className="text-gray-700">{content.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaParking className="text-[#D4A5A5] text-2xl mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Parcare</p>
                  <p className="text-gray-700">{content.parking}</p>
                </div>
              </div>

              <div className="bg-[#FFF8F0] p-4 rounded-lg mt-6">
                <p className="font-semibold text-gray-900 mb-2">Cod Vestimentar</p>
                <p className="text-gray-700">{content.dressCode}</p>
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
