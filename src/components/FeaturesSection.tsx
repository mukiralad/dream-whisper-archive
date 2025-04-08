
import React from "react";
import { Brain, CloudMoon, Star } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
      <div className="glass rounded-xl p-6 border border-white/10 transition-all hover:shadow-lg hover:scale-105 duration-300">
        <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold mb-2">Preserve Memories</h3>
        <p className="text-muted-foreground text-sm">
          Dreams fade within minutes of waking. Quickly record your dreams before they disappear forever.
        </p>
      </div>

      <div className="glass rounded-xl p-6 border border-white/10 transition-all hover:shadow-lg hover:scale-105 duration-300">
        <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <CloudMoon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold mb-2">Track Patterns</h3>
        <p className="text-muted-foreground text-sm">
          Discover recurring themes and patterns in your dreams over time with our intuitive interface.
        </p>
      </div>

      <div className="glass rounded-xl p-6 border border-white/10 transition-all hover:shadow-lg hover:scale-105 duration-300">
        <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <Star className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold mb-2">Unlock Insights</h3>
        <p className="text-muted-foreground text-sm">
          Your dreams may contain valuable insights about your subconscious mind and deepest thoughts.
        </p>
      </div>
    </div>
  );
};
