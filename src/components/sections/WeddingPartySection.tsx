'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface WeddingPartyProps {
  content: {
    nasiHeading: string;
    martoriHeading: string;
  };
  members: Array<{
    name: string;
    role: string;
    category: 'nasi' | 'martori';
    photo_url?: string;
    description?: string;
  }>;
}

export function WeddingPartySection({ content, members }: WeddingPartyProps) {
  // Don't render if no members
  if (!members || members.length === 0) {
    return null;
  }

  const nasi = members.filter(m => m.category === 'nasi');
  const martori = members.filter(m => m.category === 'martori');

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Nași Section */}
        {nasi.length > 0 && (
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {content.nasiHeading}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {nasi.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary">
                    <Image
                      src={member.photo_url || '/images/placeholder.jpg'}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-secondary mb-2">{member.role}</p>
                  {member.description && (
                    <p className="text-gray-600 text-sm px-4">{member.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Martori Section */}
        {martori.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {content.martoriHeading}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {martori.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary">
                    <Image
                      src={member.photo_url || '/images/placeholder.jpg'}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-secondary mb-2">{member.role}</p>
                  {member.description && (
                    <p className="text-gray-600 text-sm px-4">{member.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
