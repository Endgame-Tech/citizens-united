import { Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { User, Users, Network } from 'lucide-react';

const LandingCta = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [counter, setCounter] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // The stages of our story
  const stages = [
    { count: 1, text: "voice starts with you", description: "One voice can identify a problem. Your voice matters." },
    { count: 10, text: "voices form a conversation", description: "When a few people speak up, others begin to listen." },
    { count: 100, text: "voices create awareness", description: "As more join, the message spreads throughout communities." },
    { count: 1000, text: "voices build pressure", description: "Leaders take notice when citizens unite with purpose." },
    { count: 10000, text: "voices demand action", description: "Public officials can no longer ignore the collective will." },
    { count: 1000000, text: "voices create movements", description: "Together we transform awareness into nationwide action." },
    { count: 30000000, text: "voices? That's change.", description: "This is how we transform Nigeria. Together." },
  ];

  // Add animations and observe section visibility
  useEffect(() => {
    // Add keyframe animations to the document
    const styleId = 'cta-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-15px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(20px); }
        }
        
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes growLine {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 0.5; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes drawLine {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Intersection Observer to trigger animation when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      // No need to remove the styles on unmount as they might be reused
    };
  }, []);

  // Animation effect for fading between stages
  useEffect(() => {
    // If section is not visible yet, don't start animations
    if (!isVisible) return;

    // Safety check to ensure activeIndex is within bounds
    if (activeIndex < 0 || activeIndex >= stages.length) {
      console.error(`Invalid activeIndex: ${activeIndex}. Resetting to 0.`);
      setActiveIndex(0);
      return;
    }

    // Set the counter to match the current stage immediately (no animation)
    setCounter(stages[activeIndex].count);

    let timeout: NodeJS.Timeout;

    // Automatically advance to the next stage after a delay
    if (activeIndex < stages.length - 1) {
      timeout = setTimeout(() => {
        setActiveIndex(prev => Math.min(prev + 1, stages.length - 1));
      }, 4000); // Longer delay to give people time to read
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [activeIndex, isVisible, stages]);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section ref={sectionRef} className="min-h-screen py-24 bg-green-900 text-white relative overflow-hidden flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col h-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-medium mb-8">This Is How We Win. Together.</h2>

          {/* The animated counter story - now much larger and more dominant */}
          <div className={`flex-grow transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-green-800/30 backdrop-blur-sm rounded-2xl p-4 md:p-8 h-[70vh] min-h-[500px] mx-auto relative overflow-hidden border border-green-700/30">
              {/* Network visualization with people icons */}
              <div className="absolute inset-0 w-full h-full">
                {/* Dynamic network of people based on current count */}
                <div className="relative w-full h-full">
                  {/* Single person icon for first stage */}
                  {activeIndex === 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <User
                        className="text-white h-16 w-16"
                        style={{ animation: "pulse 2s infinite ease-in-out" }}
                      />
                    </div>
                  )}

                  {/* Small network for stages 1-2 */}
                  {(activeIndex === 1 || activeIndex === 2) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-64 w-64">
                        {/* Center person */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                          <User className="text-white h-12 w-12" />
                        </div>

                        {/* Surrounding people at various positions */}
                        {Array.from({ length: activeIndex === 1 ? 5 : 10 }).map((_, i) => {
                          const angle = (i / (activeIndex === 1 ? 5 : 10)) * Math.PI * 2;
                          const radius = 100;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;

                          return (
                            <div
                              key={i}
                              className="absolute z-0"
                              style={{
                                top: `calc(50% + ${y}px)`,
                                left: `calc(50% + ${x}px)`,
                                transform: 'translate(-50%, -50%)',
                                animation: `fadeInScale 0.5s ease-out forwards ${i * 0.1}s`
                              }}
                            >
                              <User className="text-white/80 h-8 w-8" />

                              {/* Connection line */}
                              <div
                                className="absolute top-1/2 left-1/2 h-px bg-white/30"
                                style={{
                                  width: `${radius}px`,
                                  transformOrigin: 'left center',
                                  transform: `rotate(${angle + Math.PI}rad)`,
                                  animation: `growLine 0.5s ease-out forwards ${i * 0.1 + 0.2}s`
                                }}
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Medium network for stages 3-4 */}
                  {(activeIndex === 3 || activeIndex === 4) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-[90%] w-[90%]">
                        {/* Main clusters */}
                        {Array.from({ length: 5 }).map((_, clusterIndex) => {
                          const clusterAngle = (clusterIndex / 5) * Math.PI * 2;
                          const clusterRadius = 150;
                          const clusterX = Math.cos(clusterAngle) * clusterRadius;
                          const clusterY = Math.sin(clusterAngle) * clusterRadius;

                          return (
                            <div
                              key={`cluster-${clusterIndex}`}
                              className="absolute"
                              style={{
                                top: `calc(50% + ${clusterY}px)`,
                                left: `calc(50% + ${clusterX}px)`,
                                animation: `fadeInScale 0.5s ease-out forwards ${clusterIndex * 0.2}s`
                              }}
                            >
                              <Users className="text-white/90 h-12 w-12" />

                              {/* People in each cluster */}
                              {Array.from({ length: 5 }).map((_, i) => {
                                const angle = (i / 5) * Math.PI * 2;
                                const radius = 40;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;

                                return (
                                  <div
                                    key={`person-${clusterIndex}-${i}`}
                                    className="absolute"
                                    style={{
                                      top: `${y}px`,
                                      left: `${x}px`,
                                      animation: `fadeInScale 0.3s ease-out forwards ${clusterIndex * 0.2 + i * 0.1}s`
                                    }}
                                  >
                                    <User className="text-white/70 h-6 w-6" />
                                  </div>
                                );
                              })}

                              {/* Connection to center */}
                              <div
                                className="absolute top-1/2 left-1/2 h-px bg-white/20"
                                style={{
                                  width: `${clusterRadius}px`,
                                  transformOrigin: 'left center',
                                  transform: `rotate(${clusterAngle + Math.PI}rad)`,
                                  animation: `growLine 0.7s ease-out forwards ${clusterIndex * 0.1}s`
                                }}
                              ></div>
                            </div>
                          );
                        })}

                        {/* Center network icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                          <Network className="text-white h-16 w-16" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Large nationwide network for stages 5-6 */}
                  {(activeIndex === 5 || activeIndex === 6) && (
                    <div className="absolute inset-0">
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* Background network pattern */}
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600">
                          <g style={{ animation: "fadeIn 1s ease-out forwards" }}>
                            {/* Create a dynamic network pattern */}
                            {Array.from({ length: 30 }).map((_, i) => {
                              const x1 = Math.random() * 800;
                              const y1 = Math.random() * 600;
                              const x2 = Math.random() * 800;
                              const y2 = Math.random() * 600;

                              return (
                                <line
                                  key={i}
                                  x1={x1}
                                  y1={y1}
                                  x2={x2}
                                  y2={y2}
                                  stroke="white"
                                  strokeWidth="1"
                                  strokeDasharray="1000"
                                  style={{
                                    animation: `drawLine 3s ease-out forwards ${i * 0.1}s`,
                                    opacity: 0.15
                                  }}
                                />
                              );
                            })}
                          </g>
                        </svg>

                        {/* Nigeria map silhouette in the background */}
                        <div
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-10"
                          style={{
                            backgroundImage: "url('/finalPics2.jpg')",
                            animation: "fadeIn 2s ease-out forwards"
                          }}>
                        </div>

                        {/* Multiple user group icons across the map */}
                        {Array.from({ length: activeIndex === 5 ? 12 : 24 }).map((_, i) => {
                          // Position randomly but with some structure
                          const col = i % 6;
                          const row = Math.floor(i / 6);

                          // Add some randomness to position
                          const xOffset = (Math.random() - 0.5) * 20;
                          const yOffset = (Math.random() - 0.5) * 20;

                          return (
                            <div
                              key={`group-${i}`}
                              className="absolute"
                              style={{
                                top: `${10 + row * 25 + yOffset}%`,
                                left: `${10 + col * 18 + xOffset}%`,
                                animation: `fadeInScale 0.5s ease-out forwards ${i * 0.1}s`
                              }}
                            >
                              <Users
                                className={`${activeIndex === 6 ? 'text-white' : 'text-white/70'}`}
                                size={activeIndex === 6 ? 20 : 16}
                              />
                            </div>
                          );
                        })}

                        {/* Central large emblem for the final stage */}
                        {activeIndex === 6 && (
                          <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{ animation: "fadeInScale 1s ease-out forwards" }}
                          >
                            <div className="rounded-full bg-white/10 p-6 backdrop-blur-sm border border-white/20">
                              <Network className="text-white h-24 w-24" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Counter and message container */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/90 to-green-900/0 pt-20 pb-8 px-6">
                <div className="relative text-center max-w-2xl mx-auto">
                  {/* The counter number with improved fade animation */}
                  <div
                    key={`counter-${activeIndex}`}
                    className="text-6xl md:text-8xl font-semibold mb-3"
                    style={{ animation: "fadeIn 1s ease-out forwards" }}
                  >
                    {formatNumber(counter || 1)}
                  </div>

                  {/* The message that changes - with safety check */}
                  <div
                    key={`text-${activeIndex}`}
                    className="text-2xl md:text-3xl font-medium mb-4"
                    style={{ animation: "fadeIn 1.2s ease-out forwards" }}
                  >
                    {activeIndex >= 0 && activeIndex < stages.length ? stages[activeIndex].text : ''}
                  </div>

                  {/* Description that explains impact - with safety check */}
                  <p
                    key={`desc-${activeIndex}`}
                    className="text-xl opacity-90 max-w-xl mx-auto"
                    style={{ animation: "fadeIn 1.5s ease-out forwards" }}
                  >
                    {activeIndex >= 0 && activeIndex < stages.length ? stages[activeIndex].description : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Manual stage navigation dots and reset button */}
          <div className="mt-6 mb-4 flex flex-col items-center">
            {/* Reset button */}
            {activeIndex === stages.length - 1 && (
              <button
                onClick={() => {
                  setActiveIndex(0);
                  setCounter(1);
                }}
                className="mb-6 py-2 px-6 rounded-full border border-white/30 hover:bg-white/10 transition-colors text-sm font-medium"
                style={{ animation: "fadeIn 1s ease-out forwards" }}
              >
                Watch Again
              </button>
            )}

            {/* Manual navigation dots */}
            <div className="flex justify-center space-x-2">
              {stages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveIndex(idx);
                    setCounter(stages[idx].count);
                  }}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${activeIndex === idx
                    ? 'bg-white scale-110'
                    : 'bg-white/30 hover:bg-white/50'
                    }`}
                  aria-label={`Go to stage ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Final CTA and buttons */}
          <div className="text-center mt-8">
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              The time to act as one is here. Sign up and use the Citizens United App to organize and be one of the 30 million voices that will transform Nigeria.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Link
                to="/auth/sign-up"
                className="bg-white text-green-800 hover:bg-gray-100 font-semibold py-3 px-8 rounded-3xl text-lg transition-colors w-full md:w-auto flex justify-center items-center group"
              >
                Create a Citizen Account
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/finalPics2.jpg')" }}></div>

        {/* Dark green overlay */}
        <div className="absolute inset-0 bg-green-900/80"></div>

        {/* Connected dots background effect - subtle */}
        <div className="absolute inset-0 bg-no-repeat bg-cover opacity-5"
          style={{ backgroundImage: "url('/web_globe.svg')" }}></div>

        {/* Background gradients for depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-800/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-green-800/30 to-transparent"></div>
      </div>
    </section>
  );
};

export default LandingCta;
