
import React from "react";

export const QuoteSection: React.FC = () => {
  return (
    <div className="glass rounded-xl p-8 my-12 text-center border border-white/10">
      <blockquote className="relative">
        <div className="text-4xl font-serif leading-tight mb-4 italic text-foreground/90">
          "Dreams are the touchstones of our character."
        </div>
        <footer className="text-sm text-muted-foreground">
          — Henry David Thoreau
        </footer>
      </blockquote>
    </div>
  );
};
