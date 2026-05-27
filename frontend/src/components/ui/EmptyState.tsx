'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "No assignments yet",
  description = "Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.",
  actionLabel = "Create Your First Assignment",
  actionHref = "/create",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-4 sm:py-8 md:py-12 lg:py-20 px-3 sm:px-6 md:px-8"
    >
      {/* Main Illustration - Magnifying glass with X */}
      <motion.div 
        className="mb-4 sm:mb-8 md:mb-14 lg:mb-20 relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <svg
          viewBox="0 0 240 240"
          className="h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 drop-shadow-lg transition-all duration-300"
          aria-hidden="true"
        >
          {/* Decorative sparkles */}
          {/* Top left sparkle */}
          <circle cx="50" cy="60" r="4" fill="#93c5fd" opacity="0.6" />
          {/* Top right sparkle */}
          <circle cx="190" cy="50" r="3" fill="#bfdbfe" opacity="0.5" />
          {/* Bottom right sparkle */}
          <circle cx="200" cy="160" r="3.5" fill="#60a5fa" opacity="0.7" />
          {/* Bottom left sparkle */}
          <circle cx="40" cy="180" r="2.5" fill="#93c5fd" opacity="0.4" />
          
          {/* Magnifying glass circle (lens) */}
          <circle
            cx="110"
            cy="100"
            r="50"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Magnifying glass handle */}
          <line
            x1="150"
            y1="150"
            x2="190"
            y2="190"
            stroke="#d1d5db"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Red X mark - first line */}
          <line
            x1="90"
            y1="80"
            x2="130"
            y2="120"
            stroke="#ef4444"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Red X mark - second line */}
          <line
            x1="130"
            y1="80"
            x2="90"
            y2="120"
            stroke="#ef4444"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Subtle background circle for X */}
          <circle
            cx="110"
            cy="100"
            r="32"
            fill="rgba(243, 244, 246, 0.8)"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      {/* Text Content */}
      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 text-center text-foreground">
        {title}
      </h3>
      
      <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-lg mb-8 sm:mb-10 md:mb-12 lg:mb-14 leading-relaxed">
        {description}
      </p>

      {/* Call to Action Button */}
      <Link
        href={actionHref}
        className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold bg-black text-white hover:bg-gray-800 hover:shadow-lg active:scale-95 transition-all duration-200"
      >
        <span className="text-xl sm:text-2xl md:text-2xl">+</span>
        {actionLabel}
      </Link>
    </motion.div>
  );
}
