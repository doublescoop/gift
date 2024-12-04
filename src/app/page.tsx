'use client';
import { motion } from 'framer-motion';
import { MovingBorder } from "@/components/ui/moving-border";
import { AnimatedList } from "@/components/ui/animated-list";
import { AnimatedList as AnimatedList2 } from "@/components/ui/animated-list2";
import { StatsLists } from "@/components/ui/stats-lists";
import { cn } from "@/lib/utils";
import { Notification, notifications } from "@/components/ui/notification";
import { useState, useEffect } from 'react';
import { GiftPopup } from "@/components/ui/gift-popup";

const titles = [
  { text: 'ギフト\nミーム', language: 'Japanese' },
  { text: 'Gift\nMeme', language: 'English' },
  { text: '기프트\n밈', language: 'Korean' },
  { text: '礼物\n模因', language: 'Chinese' },
  { text: 'Gift\nMeme', language: 'English' },
  { text: 'هدية\nميم', language: 'Arabic' },
  { text: 'Подарок\nМем', language: 'Russian' },
  { text: 'Regalo\nMeme', language: 'Spanish' },
  { text: 'Gift\nMeme', language: 'English' },
  { text: 'Cadeau\nMème', language: 'French' },
];

export default function Home() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isGiftPopupOpen, setIsGiftPopupOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-container">
      <div className="content-wrapper">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-section"
        >
          <motion.h1 
            className="hero-title"
            key={currentTitleIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {titles[currentTitleIndex].text.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </motion.h1>
          <p className="hero-subtitle">
            Bundle • Buy • Gift Your Favorite Memecoins
          </p>
          <MovingBorder
            duration={2000}
            containerClassName="mt-8 mb-16"
            borderClassName="bg-gradient-to-r from-primary-red/50 to-primary-red/20"
            className="bg-off-white text-gray-800 hover:text-primary-red/80"
            onClick={() => setIsGiftPopupOpen(true)}
          >
            START GIVING →
          </MovingBorder>
          <GiftPopup 
            isOpen={isGiftPopupOpen}
            onClose={() => setIsGiftPopupOpen(false)}
          />
        </motion.div>

        <AnimatedList2 className="mb-16" delay={4000}>
          {notifications.map((item, idx) => (
            <Notification {...item} key={`notification2-${idx}`} />
          ))}
        </AnimatedList2>

        {//different design
        /* <AnimatedList className="mb-16" delay={4000}>
          {notifications.map((item, idx) => (
            <Notification {...item} key={`notification-${idx}`} />
          ))}
        </AnimatedList> */}

        <StatsLists className="mt-32 mb-16" />

        <div className="hero-title" style={{ fontSize: '5vw' }} > What's this?</div>

        {/* Features Grid */}
        <div className="features-grid">
          {/* Bundle Feature */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="feature-card"
          >
            <h2 className="feature-title">Bundle</h2>
            <p className="feature-description">
              Create custom bundles of your favorite memecoins for better portfolio management
            </p>
          </motion.div>

          {/* Buy Feature */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="feature-card"
          >
            <h2 className="feature-title">Buy</h2>
            <p className="feature-description">
              Purchase memecoins instantly with our streamlined buying process
            </p>
          </motion.div>

          {/* Gift Feature */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="feature-card"
          >
            <h2 className="feature-title">Gift</h2>
            <p className="feature-description">
              Share the joy of memecoins with friends and family
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="cta-section"
        >
          <button className="cta-button">
            oh, hi mark
          </button>
        </motion.div>
      </div>
    </main>
  );
}
