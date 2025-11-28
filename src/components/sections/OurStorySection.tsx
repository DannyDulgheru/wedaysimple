'use client';

import { motion } from 'framer-motion';

interface OurStoryProps {
  content: {
    heading: string;
    description: string;
  };
  timelineEvents: Array<{
    event_title: string;
    event_date: string;
    event_description: string;
    event_image_url?: string;
  }>;
}

export function OurStorySection({ content, timelineEvents }: OurStoryProps) {
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
          <div className="w-24 h-1 bg-[#D4A5A5] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row gap-8 mb-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="md:w-1/2">
                <div className="bg-[#FFF8F0] p-8 rounded-lg">
                  <p className="text-[#B8860B] font-semibold mb-2">
                    {new Date(event.event_date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {event.event_title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{event.event_description}</p>
                </div>
              </div>
              <div className="md:w-1/2 flex items-center justify-center">
                <div className="w-3 h-3 bg-[#D4A5A5] rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
