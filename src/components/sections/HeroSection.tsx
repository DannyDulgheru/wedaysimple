'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  content: {
    brideName: string;
    groomName: string;
    weddingDate: string;
    location: string;
    backgroundImage?: string;
  };
}

export function HeroSection({ content }: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(content.weddingDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [content.weddingDate]);

  const formattedDate = new Date(content.weddingDate).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${content.backgroundImage || '/images/hero-bg.jpg'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-xl md:text-2xl mb-4 font-light tracking-wide">Ne căsătorim</p>
          <h1 className="font-script text-6xl md:text-8xl lg:text-9xl mb-6" style={{ fontFamily: 'Great Vibes, cursive' }}>
            {content.brideName} & {content.groomName}
          </h1>
          <p className="text-2xl md:text-3xl mb-8 font-light tracking-wider">{formattedDate}</p>
          <p className="text-xl md:text-2xl mb-12">{content.location}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-12"
        >
          <p className="text-lg mb-6 uppercase tracking-widest">Numărătoare inversă</p>
          <div className="flex justify-center gap-4 md:gap-8">
            {[
              { value: timeLeft.days, label: 'Zile' },
              { value: timeLeft.hours, label: 'Ore' },
              { value: timeLeft.minutes, label: 'Minute' },
              { value: timeLeft.seconds, label: 'Secunde' }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm px-4 py-6 rounded-lg min-w-[80px] md:min-w-[100px]">
                <div className="text-4xl md:text-5xl font-bold mb-2">{item.value}</div>
                <div className="text-sm uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
