'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface WeddingPartyProps {
  content: {
    heading: string;
  };
  members: Array<{
    name: string;
    role: string;
    photo_url?: string;
    description?: string;
  }>;
}

export function WeddingPartySection({ content, members }: WeddingPartyProps) {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#D4A5A5]">
                <Image
                  src={member.photo_url || '/images/placeholder.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
              <p className="text-[#B8860B] mb-2">{member.role}</p>
              {member.description && (
                <p className="text-gray-600 text-sm px-4">{member.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
