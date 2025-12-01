'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface CoupleIntroProps {
  content: {
    bridePhoto: string;
    groomPhoto: string;
    brideBio: string;
    groomBio: string;
  };
}

export function CoupleIntroSection({ content }: CoupleIntroProps) {
  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Mirii
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary">
              <Image
                src={content.bridePhoto}
                alt="Mireasa"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-3xl mb-3" style={{ fontFamily: 'Great Vibes, cursive' }}>
              Mireasa
            </h3>
            <p className="text-gray-700 leading-relaxed px-4">{content.brideBio}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary">
              <Image
                src={content.groomPhoto}
                alt="Mirele"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-3xl mb-3" style={{ fontFamily: 'Great Vibes, cursive' }}>
              Mirele
            </h3>
            <p className="text-gray-700 leading-relaxed px-4">{content.groomBio}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
