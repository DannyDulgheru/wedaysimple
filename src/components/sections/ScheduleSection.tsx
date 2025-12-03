'use client';

import { motion } from 'framer-motion';
import { FaClock, FaChurch, FaCamera, FaGlassCheers, FaUtensils, FaMusic } from 'react-icons/fa';

interface ScheduleProps {
  content: {
    events: Array<{
      time: string;
      title: string;
      description: string;
    }>;
    sectionTitle?: string;
  };
}

const iconMap: { [key: string]: any } = {
  Ceremonia: FaChurch,
  'Sesiune Foto': FaCamera,
  Cocktail: FaGlassCheers,
  Cina: FaUtensils,
  'Dans și Petrecere': FaMusic,
};

export function ScheduleSection({ content }: ScheduleProps) {
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
            {content.sectionTitle || 'Program'}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {content.events.map((event, index) => {
            const Icon = iconMap[event.title] || FaClock;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 mb-8"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                    <Icon />
                  </div>
                  {index < content.events.length - 1 && (
                    <div className="w-1 flex-grow bg-primary mt-2"></div>
                  )}
                </div>
                <div className="flex-grow pb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-secondary font-semibold mb-2">{event.time}</p>
                    <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {event.title}
                    </h3>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
