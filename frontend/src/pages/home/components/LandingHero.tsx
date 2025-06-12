import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { gsap } from "gsap";

const LandingHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Hero animations
    tl.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
      .fromTo(textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6" // Start slightly before the previous animation ends
      )
      .fromTo(buttonsRef.current ? Array.from(buttonsRef.current.children) : [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
        "-=0.4"
      )
      .fromTo(scrollIndicatorRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.2"
      );

    // Animate scroll indicator continuously
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut"
    });
  }, []);

  const scrollToUnderstand = () => {
    const understandSection = document.getElementById('understand');
    if (understandSection) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: understandSection,
          offsetY: 80
        },
        ease: "power3.inOut"
      });
    }
  };

  return (
    <div id="hero" className="relative overflow-hidden h-screen flex items-center" ref={heroRef}>
      {/* Background image with subtle zoom animation */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/15997.jpg"
          alt=""
          className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center min-h-full flex flex-col items-center justify-center">
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6"
          >
            Welcome To Your Civic Engine
          </h1>

          <p
            ref={textRef}
            className="text-lg md:text-lg text-white/90 mb-10 font-light leading-normal"
          >
            From knowing your leaders to protecting your vote, Citizens United helps you move from
            awareness to action in 5 powerful steps.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/sign-up"
              className="px-8 py-4 bg-white text-[#006837] rounded-full font-normal text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Get Started
            </Link>
            <div
              onClick={scrollToUnderstand}
              className="px-8 py-4 bg-transparent cursor-pointer border-2 border-white text-white rounded-full font-normal text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              Learn More
              <ChevronDown className="text-white animate-bounce" size={24} />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default LandingHero;