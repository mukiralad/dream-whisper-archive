import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Preload the video
    const video = document.getElementById('background-video') as HTMLVideoElement;
    if (video) {
      video.addEventListener('loadeddata', () => {
        setIsVideoLoaded(true);
      });
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          id="background-video"
          autoPlay
          loop
          muted
          playsInline
          className={`object-cover w-full h-full transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster="/video-poster.jpg" // Add a poster image for better initial load
        >
          <source
            src="/background-video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/40">
        <div className="text-center text-white p-8 max-w-3xl">
          <h1 className="landing-title text-6xl font-semibold mb-6 animate-fade-in">
            Dream Whisper Archive
          </h1>
          <p className="landing-description text-xl mb-8 animate-fade-in-delay">
            Capture and preserve your dreams in our digital sanctuary
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 