
import React from "react";

export const DreamyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background via-purple-50/30" />
      
      {/* Floating blur elements */}
      <div className="absolute top-[15%] left-[20%] w-64 h-64 rounded-full bg-purple-300/20 blur-3xl animate-float" 
        style={{ animationDelay: "0s" }} />
      <div className="absolute top-[40%] right-[15%] w-80 h-80 rounded-full bg-blue-300/20 blur-3xl animate-float" 
        style={{ animationDelay: "-2s" }} />
      <div className="absolute bottom-[10%] left-[30%] w-72 h-72 rounded-full bg-pink-300/10 blur-3xl animate-float" 
        style={{ animationDelay: "-4s" }} />
    </div>
  );
};
