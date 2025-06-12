import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import featureVideos from "./FeatureVideos";

gsap.registerPlugin(ScrollTrigger);

const LandingUnderstand = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyVideoRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile viewport on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create animation timeline for each feature section
    featuresRef.current.forEach((featureElement, index) => {
      // Create a scroll trigger for each feature
      ScrollTrigger.create({
        trigger: featureElement,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveFeature(index),
        onEnterBack: () => setActiveFeature(index),
        markers: false // Set to true during development to see trigger points
      });
    });

    // Animation setup complete

    // Watch for activeFeature change to trigger animation
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Watch for activeFeature change to trigger animation
  useEffect(() => {
    // Fade out current video
    gsap.to(".feature-video", {
      opacity: 0,
      scale: 0.98,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        // Fade in new video with slight scale-up animation
        gsap.to(".feature-video", {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.1,
          ease: "power2.out"
        });
      }
    });

    // Reset all feature items to default style
    gsap.to(".feature-item", {
      backgroundColor: "rgba(243, 244, 246, 1)", // Gray-50 
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      ease: "power2.out",
      duration: 0.3
    });

    // Highlight the active feature with animation
    gsap.to(`.feature-item-${activeFeature}`, {
      backgroundColor: "rgba(236, 253, 245, 1)", // Green-50
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      ease: "power2.out",
      duration: 0.5
    });

    // Ensure the correct video is playing
    setTimeout(() => {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          if (index === activeFeature) {
            video.play().catch(e => console.log("Autoplay prevented", e));
          } else {
            video.pause();
          }
        }
      });
    }, 100);
  }, [activeFeature]);

  return (
    <section className="py-16 md:py-24 bg-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Understand — Civic Engagement Simplified</h2>
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-3xl mx-auto">
            From knowing your leaders to protecting your vote, Citizens United helps you move from awareness to action in 5 powerful steps.
          </p>
        </div>

        {/* Desktop layout - Left text (2/5), Right video (3/5) */}
        <div className="grid md:grid-cols-5 gap-y-8 md:gap-x-12 md:gap-y-0">
          {/* Features Content (Left - 2 columns on desktop, full width on mobile) */}
          <div className="md:col-span-2 space-y-6 md:space-y-10 md:pr-4">
            {featureVideos.map((feature, index) => (
              <div
                key={feature.id}
                ref={(el) => el && (featuresRef.current[index] = el)}
                className={`feature-item feature-item-${index} rounded-xl p-4 md:p-6 transition-all duration-300 ${activeFeature === index
                  ? "bg-green-50 border-l-4 border-green-500"
                  : "bg-gray-50"
                  }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`bg-green-100 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0 ${activeFeature === index ? "bg-green-200" : "bg-green-100"
                    }`}>
                    {index === 0 && (
                      <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    )}
                    {index === 1 && (
                      <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    )}
                    {index === 2 && (
                      <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">{feature.title}</h3>
                    <p className="text-sm md:text-sm text-gray-600">{feature.description}</p>
                    <button
                      className={`mt-3 md:mt-4 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeFeature === index
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      onClick={() => setActiveFeature(index)}
                    >
                      See how it works
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Video Container (Right - 3 columns on desktop, full width on mobile) */}
          <div className="relative md:col-span-3 mt-8 md:mt-0">
            <div
              ref={stickyVideoRef}
              className="md:sticky top-36 rounded-2xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-200"
            >
              <div className="aspect-video bg-gradient-to-tr from-gray-900 to-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,150,100,0.15)_0,_transparent_60%)] animate-pulse"></div>
                {featureVideos.map((feature, index) => (
                  <div
                    key={feature.id}
                    className={`feature-video absolute inset-0 transition-opacity duration-300 ${activeFeature === index ? 'block' : 'hidden'}`}
                  >
                    {feature.placeholder.endsWith('.mov') || feature.placeholder.endsWith('.mp4') ? (
                      <div className="relative w-full h-full">
                        <video
                          ref={el => videoRefs.current[index] = el}
                          src={feature.placeholder}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          poster="/logo-icon.svg"
                        />
                        {/* Mobile tap overlay for better UX */}
                        <div className="absolute inset-0 md:hidden bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center">
                          <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                            Autoplay video
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={feature.placeholder}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 md:p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-base md:text-lg">{featureVideos[activeFeature].title}</h4>
                    <p className="text-xs md:text-sm text-gray-500">Watch how this feature works</p>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-green-600">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs">Autoplay</span>
                  </div>
                </div>
                {isMobileView && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Video plays automatically</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingUnderstand;
