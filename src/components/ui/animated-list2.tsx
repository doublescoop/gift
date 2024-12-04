"use client";

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MovingBorder } from "./moving-border";

// Mock data for gift contents
const mockGiftContents: Record<string, { name: string; amount: string }[]> = {
  "WAGMI Bundle": [
    { name: 'PEPE', amount: '100K' },
    { name: 'DOGE', amount: '50K' },
    { name: 'SHIB', amount: '75K' },
    { name: 'BONK', amount: '25K' },
  ],
  "MEME Bundle": [
    { name: 'WOJAK', amount: '80K' },
    { name: 'PEPE', amount: '60K' },
    { name: 'DOGE', amount: '40K' },
  ],
  "Meme Starter Pack": [
    { name: 'PEPE', amount: '100K' },
    { name: 'DOGE', amount: '50K' },
    { name: 'SHIB', amount: '75K' },
    { name: 'BONK', amount: '25K' },
  ],
  "Expensive Shit": [
    { name: 'WOJAK', amount: '80K' },
    { name: 'PEPE', amount: '60K' },
    { name: 'DOGE', amount: '40K' },
  ],
  "Pepe's Treasure Chest": [
    { name: 'PEPE', amount: '100K' },
    { name: 'DOGE', amount: '50K' },
    { name: 'SHIB', amount: '75K' },
    { name: 'BONK', amount: '25K' },
  ],
  "Ultimate Doge Pack": [
    { name: 'WOJAK', amount: '80K' },
    { name: 'PEPE', amount: '60K' },
    { name: 'DOGE', amount: '40K' },
  ],
};

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 1000 }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children],
    );

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, delay);

      return () => clearTimeout(timeout);
    }, [index, delay, childrenArray.length]);

    const itemsToShow = useMemo(() => {
      let currentIndex = index % childrenArray.length;
      let result = [];
      
      // Add items in reverse chronological order
      for (let i = 0; i < Math.min(4, childrenArray.length); i++) {
        let idx = (currentIndex - i + childrenArray.length) % childrenArray.length;
        result.push(childrenArray[idx]);
      }
      
      return result;
    }, [index, childrenArray]);

    return (
      <div className={`flex flex-col items-center gap-4 w-full max-w-3xl mx-auto ${className}`}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const giftName = (children as React.ReactElement)?.props?.giftName;
  const giftContents = mockGiftContents[giftName] || [];

  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <>
      <motion.div 
        {...animations} 
        layout 
        className="w-full max-w-full relative"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <div className="w-full p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div
              className="flex size-10 items-center justify-center rounded-2xl mr-3"
              style={{
                backgroundColor: (children as React.ReactElement)?.props?.color || '#FF3D71',
              }}
            >
              <span className="text-lg">{(children as React.ReactElement)?.props?.icon || '🎁'}</span>
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-primary">
              <span className="text-primary-red font-extrabold">{(children as React.ReactElement)?.props?.fromAddress}</span> is giving <span className="text-primary-red font-extrabold">{(children as React.ReactElement)?.props?.giftName}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                to {(children as React.ReactElement)?.props?.toAddress}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="relative inline-block">
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg transform rotate-3 shadow-lg">
                <span className="text-sm">worth </span>
                <span className="font-bold">{(children as React.ReactElement)?.props?.value}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white p-6 rounded-lg shadow-xl border-4 border-red-500 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{giftName}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">What's Inside?</h4>
                <ul className="space-y-2">
                  {giftContents.map((item, index) => (
                    <li key={`content-${index}`} className="flex justify-between items-center py-2 border-b border-primary-red/20 last:border-0">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-500">{item.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <MovingBorder
                  duration={2000}
                  containerClassName="w-full"
                  borderClassName="bg-gradient-to-r from-primary-red/50 to-primary-red/20"
                  className="bg-off-white text-gray-800 hover:text-primary-red/80 w-full flex justify-center"
                >
                  IT'S GIVING →
                </MovingBorder>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
