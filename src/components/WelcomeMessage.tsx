import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export const WelcomeMessage: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Dreamer';

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center mb-4"
    >
      <motion.h2
        className="text-xl text-primary/80 font-medium"
      >
        Welcome back, {displayName}
      </motion.h2>
    </motion.div>
  );
}; 